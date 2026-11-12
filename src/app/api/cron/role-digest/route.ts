import { roles } from "@/content/site";
import { deskNow, pacificDate } from "@/lib/desk-clock";
import { readDigestDate, writeDigestDate } from "@/lib/desk-store";
import { isAuthorized } from "@/lib/cron-auth";
import { jsonResult, sendFormEmail } from "@/lib/mail";
import { digestText, shouldSendDigest } from "@/lib/role-digest";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return jsonResult({ ok: false, error: "Unauthorized.", status: 401 });
  }
  const now = deskNow();
  const last = await readDigestDate();
  if (!shouldSendDigest(last, now)) {
    return Response.json({ ok: true, sent: false });
  }
  const text = digestText(roles, now);
  const sent = await sendFormEmail({
    subject: `Role digest ${pacificDate(now)}`,
    text,
  });
  if (!sent.ok) {
    // A non-2xx status marks this cron run as failed in the host's cron log,
    // and the structured line is easy to search for and to alert on.
    console.error(
      JSON.stringify({
        event: "role-digest-failed",
        date: pacificDate(now),
        status: sent.status,
        error: sent.error,
      }),
    );
    return jsonResult(sent);
  }
  await writeDigestDate(pacificDate(now));
  return Response.json({ ok: true, sent: true });
}
