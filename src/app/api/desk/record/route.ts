import { isRecord } from "@/lib/form";
import {
  canIntroduce,
  guaranteeEnd,
  listSubmissions,
  updateSubmission,
  type SubmissionStatus,
} from "@/lib/desk-store";
import { isAuthorized } from "@/lib/cron-auth";
import { jsonResult, sendFormEmail } from "@/lib/mail";
import { statusBody, statusSubjects } from "@/lib/status-mail";

export const runtime = "nodejs";

const statuses: readonly SubmissionStatus[] = [
  "received",
  "in review",
  "introduced",
  "closed",
  "paused",
  "deleted",
];

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return jsonResult({ ok: false, error: "Unauthorized.", status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResult({ ok: false, error: "Request body must be JSON.", status: 400 });
  }
  if (!isRecord(payload) || typeof payload.id !== "string") {
    return jsonResult({ ok: false, error: "Request body must include an id.", status: 400 });
  }
  if (typeof payload.status !== "string" || !statuses.includes(payload.status as SubmissionStatus)) {
    return jsonResult({ ok: false, error: "Choose a status.", status: 400 });
  }

  const status = payload.status as SubmissionStatus;
  const current = (await listSubmissions()).find((item) => item.id === payload.id);
  if (!current) return jsonResult({ ok: false, error: "No record with that id.", status: 404 });

  const rightToWork = typeof payload.rightToWork === "string" ? payload.rightToWork : current.rightToWork;
  const startDate = typeof payload.startDate === "string" ? payload.startDate : current.startDate;
  const engagement = payload.engagement === "Contract" ? "Contract" : "Permanent";
  if (status === "introduced" && !canIntroduce({ status, rightToWork })) {
    return jsonResult({ ok: false, error: "Right to work is required before an introduction.", status: 400 });
  }
  if (current.status === "closed" && status !== "closed" && current.reopenUsed) {
    return jsonResult({ ok: false, error: "This record was already reopened once.", status: 400 });
  }

  const updated = await updateSubmission(current.id, {
    status,
    rightToWork,
    startDate,
    guaranteeEnd: startDate ? guaranteeEnd(startDate, engagement) : undefined,
    reopenUsed: current.status === "closed" && status !== "closed" ? true : current.reopenUsed,
    ...(status === "deleted" ? { fileBase64: undefined, filename: undefined } : {}),
  });

  const candidate = await sendFormEmail({
    to: current.email,
    subject: `${statusSubjects[status]} (${current.id})`,
    text: statusBody(status, current.id),
  });
  if (!candidate.ok) return jsonResult(candidate);

  const desk = await sendFormEmail({
    subject: `Status ${status} · ${current.id}`,
    text: statusBody(status, current.id),
  });
  if (!desk.ok) return jsonResult(desk);
  return Response.json({ ok: true, id: updated?.id, guaranteeEnd: updated?.guaranteeEnd ?? null });
}
