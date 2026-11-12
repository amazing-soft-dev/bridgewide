import { listSubmissions, updateSubmission } from "@/lib/desk-store";
import { isAuthorized } from "@/lib/cron-auth";
import { jsonResult, sendFormEmail } from "@/lib/mail";
import { expiredTalent } from "@/lib/talent-retention";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return jsonResult({ ok: false, error: "Unauthorized.", status: 401 });
  }
  const all = await listSubmissions();
  const due = all.filter(
    (item) => item.kind === "talent-pool" && item.status !== "deleted" && expiredTalent(item.at),
  );
  for (const item of due) {
    await updateSubmission(item.id, { status: "deleted" });
  }
  const sent = await sendFormEmail({
    subject: "Talent pool retention",
    text: `Deleted ${due.length} talent-pool profiles older than 12 months.`,
  });
  if (!sent.ok) return jsonResult(sent);
  return Response.json({ ok: true, deleted: due.length });
}
