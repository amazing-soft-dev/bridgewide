import { roles } from "@/content/site";
import { pacificDate } from "@/lib/desk-clock";
import { readDigestDate, writeDigestDate } from "@/lib/desk-store";
import { jsonResult, sendFormEmail } from "@/lib/mail";
import { digestText, shouldSendDigest } from "@/lib/role-digest";

export const runtime = "nodejs";

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return jsonResult({ ok: false, error: "Unauthorized.", status: 401 });
  }
  const now = new Date();
  const last = await readDigestDate();
  if (!shouldSendDigest(last, now)) {
    return Response.json({ ok: true, sent: false });
  }
  const text = digestText(roles, now);
  const sent = await sendFormEmail({
    subject: `Role digest ${pacificDate(now)}`,
    text,
  });
  if (!sent.ok) return jsonResult(sent);
  await writeDigestDate(pacificDate(now));
  return Response.json({ ok: true, sent: true });
}
