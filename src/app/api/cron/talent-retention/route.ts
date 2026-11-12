import { listSubmissions, updateSubmission } from "@/lib/desk-store";
import { jsonResult, sendFormEmail } from "@/lib/mail";

export const runtime = "nodejs";

const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export function expiredTalent(at: string, now = Date.now()): boolean {
  const time = Date.parse(at);
  if (Number.isNaN(time)) return false;
  return now - time > YEAR_MS;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return jsonResult({ ok: false, error: "Unauthorized.", status: 401 });
  }
  const all = await listSubmissions();
  const due = all.filter(
    (item) => item.kind === "talent-pool" && item.status !== "deleted" && expiredTalent(item.at),
  );
  for (const item of due) {
    await updateSubmission(item.id, { status: "deleted", fileBase64: undefined, filename: undefined });
  }
  const sent = await sendFormEmail({
    subject: "Talent pool retention",
    text: `Deleted ${due.length} talent-pool profiles older than 12 months.`,
  });
  if (!sent.ok) return jsonResult(sent);
  return Response.json({ ok: true, deleted: due.length });
}
