import { contact } from "@/content/site";

export type Submission = { ok: true } | { ok: false; error: string };

export async function readSubmission(response: Response): Promise<Submission> {
  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    return { ok: false, error: "The request failed." };
  }

  if (
    response.ok &&
    payload !== null &&
    typeof payload === "object" &&
    "ok" in payload &&
    payload.ok === true
  ) {
    return { ok: true };
  }

  const error =
    payload !== null &&
    typeof payload === "object" &&
    "error" in payload &&
    typeof payload.error === "string" &&
    payload.error.trim()
      ? payload.error
      : "The request failed.";

  return { ok: false, error };
}

/**
 * The static export (GitHub Pages) has no server, so the /api form routes do
 * not exist there. Say so instead of posting to a URL that returns 404/405.
 */
const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "1";

const staticExportError = `Online forms are not available on this version of the site. Email ${contact.email} instead.`;

export async function submitJson(url: string, payload: unknown): Promise<Submission> {
  if (staticExport) return { ok: false, error: staticExportError };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    return readSubmission(response);
  } catch {
    return { ok: false, error: "Could not reach the server." };
  }
}

export async function submitForm(url: string, body: FormData): Promise<Submission> {
  if (staticExport) return { ok: false, error: staticExportError };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { Accept: "application/json" },
      body,
    });
    return readSubmission(response);
  } catch {
    return { ok: false, error: "Could not reach the server." };
  }
}
