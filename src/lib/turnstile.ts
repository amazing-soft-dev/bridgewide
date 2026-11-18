import type { MailResult } from "@/lib/mail";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Name of the hidden field the Turnstile widget adds to a form. */
export const TURNSTILE_FIELD = "cf-turnstile-response";

/** The token from a multipart form post. */
export function tokenFromForm(form: FormData): string | undefined {
  const value = form.get(TURNSTILE_FIELD);
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/** The token from a JSON post, where the form sends it as `turnstileToken`. */
export function tokenFromJson(payload: unknown): string | undefined {
  if (typeof payload !== "object" || payload === null) return undefined;
  const value = (payload as Record<string, unknown>).turnstileToken;
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

/**
 * Ask Cloudflare whether the token is real. With no TURNSTILE_SECRET_KEY the
 * check is skipped, so local development and tests need no account. A missing
 * or rejected token is a 400. If Cloudflare cannot be reached the post is
 * refused with a 503 rather than let a bot through; the visitor can retry or
 * email the desk.
 */
export async function verifyHuman(
  token: string | undefined,
  ip: string,
  options: { secret?: string; fetchImpl?: typeof fetch } = {},
): Promise<MailResult> {
  const secret = (options.secret ?? process.env.TURNSTILE_SECRET_KEY)?.trim();
  if (!secret) return { ok: true };

  if (!token) {
    return { ok: false, error: "Complete the check and try again.", status: 400 };
  }

  const body = new URLSearchParams({ secret, response: token });
  if (ip && ip !== "local") body.set("remoteip", ip);

  try {
    const response = await (options.fetchImpl ?? fetch)(VERIFY_URL, { method: "POST", body });
    const result = (await response.json()) as { success?: boolean };
    if (result.success === true) return { ok: true };
    return { ok: false, error: "The check failed. Reload the page and try again.", status: 400 };
  } catch {
    return {
      ok: false,
      error: "We could not run the check just now. Try again in a minute or email the desk.",
      status: 503,
    };
  }
}
