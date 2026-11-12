import { sla } from "@/content/sla";
import { sendFormEmail, type MailResult } from "@/lib/mail";
import { allowRequest } from "@/lib/rate-limit";

/** Which form a submission came from. */
export type IntakeKind = "hire" | "cv" | "contact" | "salary-guide" | "talent-pool" | "ai-apply" | "partner";

export type IntakeInput = {
  kind: IntakeKind;
  email: string;
  subject: string;
  /** Every field of the form, as plain lines. The desk email carries exactly this. */
  text: string;
  ip: string;
  visitorSla: string;
  filename?: string;
  contentType?: string;
  fileBase64?: string;
};

export function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

export type IntakeResult = MailResult & { id?: string };

/** A short reference both emails quote, so the desk and the visitor can name the same message. */
export function newReference(): string {
  return `BW-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Nothing is stored. A submission becomes two emails: one to the desk with the
 * whole message (and the CV, if there is one, as an attachment), and a short
 * confirmation to the visitor.
 */
export async function deliverIntake(input: IntakeInput): Promise<IntakeResult> {
  if (!allowRequest(`${input.ip}:${input.kind}`)) {
    return { ok: false, error: "Too many requests. Try again shortly.", status: 429 };
  }

  const id = newReference();

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
    subject: `BridgeWide received your note (${id})`,
    text: [
      `Reference: ${id}`,
      "We have it. A person will reply within the published desk hours.",
      input.visitorSla || sla.employer,
    ].join("\n\n"),
  });
  if (!visitor.ok) return { ...visitor, id };
  return { ok: true, id };
}
