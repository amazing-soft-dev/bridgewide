import { sla } from "@/content/sla";
import {
  DuplicateSubmissionError,
  findDuplicate,
  newSubmissionId,
  saveSubmission,
  type Submission,
  type SubmissionKind,
} from "@/lib/desk-store";
import { sendFormEmail, type MailResult } from "@/lib/mail";
import { allowRequest } from "@/lib/rate-limit";
import { statusBody, statusSubjects } from "@/lib/status-mail";

export type IntakeInput = {
  kind: SubmissionKind;
  email: string;
  roleKey?: string;
  engagement?: "Permanent" | "Contract";
  subject: string;
  text: string;
  ip: string;
  visitorSla: string;
  rightToWork?: string;
  consent?: { version: string; at: string };
  feeAcknowledged?: string;
  filename?: string;
  contentType?: string;
  fileBase64?: string;
};

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export type IntakeResult = MailResult & { id?: string; duplicate?: boolean };

export async function deliverIntake(input: IntakeInput): Promise<IntakeResult> {
  if (!allowRequest(`${input.ip}:${input.kind}`)) {
    return { ok: false, error: "Too many requests. Try again shortly.", status: 429 };
  }

  const existing = await findDuplicate(input.email, input.kind, input.roleKey);
  if (existing) return { ok: true, id: existing.id, duplicate: true };

  const id = newSubmissionId();
  const entry: Submission = {
    id,
    kind: input.kind,
    at: new Date().toISOString(),
    status: "received",
    email: input.email,
    roleKey: input.roleKey,
    engagement: input.engagement,
    rightToWork: input.rightToWork,
    consent: input.consent,
    feeAcknowledged: input.feeAcknowledged,
    // The CV goes to the desk email only. A record keeps no file data.
    body: input.text,
  };
  try {
    await saveSubmission(entry);
  } catch (error) {
    // Two posts from one person can pass the check above together. The store's
    // unique rule lets only one in; the other gets that record's id.
    if (error instanceof DuplicateSubmissionError) {
      const winner = await findDuplicate(input.email, input.kind, input.roleKey);
      if (winner) return { ok: true, id: winner.id, duplicate: true };
    }
    throw error;
  }

  const desk = await sendFormEmail({
    subject: input.subject,
    text: [`Reference: ${id}`, input.text].join("\n"),
    replyTo: input.email,
    attachments: input.fileBase64
      ? [
          {
            filename: input.filename ?? "cv.pdf",
            content: input.fileBase64,
            contentType: input.contentType ?? "application/octet-stream",
          },
        ]
      : undefined,
  });
  if (!desk.ok) return desk;

  const visitor = await sendFormEmail({
    to: input.email,
    subject: `${statusSubjects.received} (${id})`,
    text: [statusBody("received", id), input.visitorSla || sla.employer].join("\n\n"),
  });
  if (!visitor.ok) return { ...visitor, id };
  return { ok: true, id };
}
