import { Resend, type Attachment } from "resend";

export type MailResult = { ok: true } | { ok: false; error: string; status: number };

export function jsonResult(result: MailResult): Response {
  if (result.ok) return Response.json({ ok: true });
  return Response.json({ ok: false, error: result.error }, { status: result.status });
}

export async function sendFormEmail(input: {
  subject: string;
  text: string;
  replyTo?: string;
  attachments?: Attachment[];
}): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();
  const missing = [
    apiKey ? null : "RESEND_API_KEY",
    to ? null : "CONTACT_TO_EMAIL",
    from ? null : "CONTACT_FROM_EMAIL",
  ].filter((name): name is string => name !== null);

  if (!apiKey || !to || !from) {
    return { ok: false, error: `Missing ${missing.join(", ")}.`, status: 500 };
  }

  const resend = new Resend(apiKey);

  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject: input.subject.replace(/[\r\n]+/g, " ").slice(0, 200),
      text: input.text,
      replyTo: input.replyTo,
      attachments: input.attachments,
    });

    if (error || !data) {
      return {
        ok: false,
        error: error?.message || "Resend could not send the email.",
        status: 502,
      };
    }

    return { ok: true };
  } catch (caught) {
    const message =
      caught instanceof Error && caught.message
        ? caught.message
        : "Resend could not send the email.";
    return { ok: false, error: message, status: 502 };
  }
}
