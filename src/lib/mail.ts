import { Resend, type Attachment } from "resend";

export type MailResult = { ok: true } | { ok: false; error: string; status: number };

export function jsonResult(result: MailResult): Response {
  if (result.ok) return Response.json({ ok: true });
  return Response.json({ ok: false, error: result.error }, { status: result.status });
}

export async function sendFormEmail(
  input: {
  subject: string;
  text: string;
  replyTo?: string;
  to?: string;
  attachments?: Attachment[];
},
  options: { retryDelaysMs?: readonly number[] } = {},
): Promise<MailResult> {
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
  const payload = {
    from,
    to: input.to?.trim() || to,
    subject: input.subject.replace(/\s+/g, " ").trim().slice(0, 200),
    text: input.text,
    replyTo: input.replyTo,
    attachments: input.attachments,
  };

  // Nothing is stored, so a send that fails for a passing reason (a rate limit,
  // a Resend outage, a dropped connection) would lose the message. Try again a
  // couple of times. A 4xx other than 429 means the request itself is wrong, and
  // sending it again would fail the same way.
  const delays = options.retryDelaysMs ?? RETRY_DELAYS_MS;
  let failure: MailResult = { ok: false, error: "Resend could not send the email.", status: 502 };

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    if (attempt > 0) await wait(delays[attempt - 1]);
    let retryable = true;
    try {
      const { data, error } = await resend.emails.send(payload);
      if (!error && data) return { ok: true };
      retryable = error ? isRetryable(error.statusCode) : true;
      failure = { ok: false, error: error?.message || "Resend could not send the email.", status: 502 };
    } catch (caught) {
      const message =
        caught instanceof Error && caught.message ? caught.message : "Resend could not send the email.";
      failure = { ok: false, error: message, status: 502 };
    }
    if (!retryable) break;
  }

  return failure;
}

/** Wait before the second and third try. */
const RETRY_DELAYS_MS: readonly number[] = [400, 1200];

const wait = (ms: number) => (ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve());

/** No status code means the request never got an answer. 429 and 5xx are worth another try. */
function isRetryable(statusCode: number | null): boolean {
  return statusCode === null || statusCode === 429 || statusCode >= 500;
}
