import { sla } from "@/content/sla";
import {
  emailField,
  honeypotTripped,
  isRecord,
  limits,
  regionListField,
  textField,
} from "@/lib/form";
import { clientIp, deliverIntake } from "@/lib/intake";
import { jsonResult } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonResult({ ok: false, error: "Request body must be JSON.", status: 400 });
  }

  if (!isRecord(payload)) {
    return jsonResult({ ok: false, error: "Request body must be a JSON object.", status: 400 });
  }

  if (honeypotTripped(payload.companyWebsite)) {
    return jsonResult({ ok: true });
  }

  const name = textField(payload.name, limits.name, "Name");
  if (!name.ok) return jsonResult({ ok: false, error: name.error, status: 400 });

  const email = emailField(payload.email);
  if (!email.ok) return jsonResult({ ok: false, error: email.error, status: 400 });

  const company = textField(payload.company, limits.company, "Company");
  if (!company.ok) return jsonResult({ ok: false, error: company.error, status: 400 });

  const need = textField(payload.need, limits.roleTitle, "Roles or cohorts");
  if (!need.ok) return jsonResult({ ok: false, error: need.error, status: 400 });

  const coverage = textField(payload.coverage, limits.roleTitle, "Region or time zone");
  if (!coverage.ok) return jsonResult({ ok: false, error: coverage.error, status: 400 });

  const message = textField(payload.message, limits.message, "Message");
  if (!message.ok) return jsonResult({ ok: false, error: message.error, status: 400 });

  const volume = textField(payload.volume, 40, "Volume");
  if (!volume.ok) return jsonResult({ ok: false, error: volume.error, status: 400 });

  const taskType = textField(payload.taskType, limits.roleTitle, "Task type");
  if (!taskType.ok) return jsonResult({ ok: false, error: taskType.error, status: 400 });

  const rate = textField(payload.rate, 40, "Rate");
  if (!rate.ok) return jsonResult({ ok: false, error: rate.error, status: 400 });

  const countries = regionListField(payload.countries);
  if (!countries.ok) return jsonResult({ ok: false, error: countries.error, status: 400 });

  const result = await deliverIntake({
    kind: "partner",
    email: email.value,
    roleKey: company.value,
    subject: `AI training partner inquiry from ${company.value}`,
    ip: clientIp(request),
    visitorSla: sla.training,
    text: [
      `Name: ${name.value}`,
      `Email: ${email.value}`,
      `Company: ${company.value}`,
      `Roles or cohorts: ${need.value}`,
      `Region or time zone: ${coverage.value}`,
      `Volume: ${volume.value}`,
      `Task type: ${taskType.value}`,
      `Rate: ${rate.value}`,
      `Countries: ${countries.value}`,
      "",
      message.value,
    ].join("\n"),
  });
  if (result.ok) return Response.json({ ok: true, id: result.id });
  return jsonResult(result);
}
