import { sla } from "@/content/sla";
import {
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
    rightToWork: input.rightToWork,
    consent: input.consent,
    feeAcknowledged: input.feeAcknowledged,
    // The CV goes to the desk email only. A record keeps no file data.
    body: input.text,
  };
  await saveSubmission(entry);

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
