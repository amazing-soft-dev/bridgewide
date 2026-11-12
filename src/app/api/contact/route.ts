import { sla } from "@/content/sla";
import { emailField, honeypotTripped, isRecord, limits, textField, topicField } from "@/lib/form";
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

  const topic = topicField(payload.topic);
  if (!topic.ok) return jsonResult({ ok: false, error: topic.error, status: 400 });

  const message = textField(payload.message, limits.message, "Message");
  if (!message.ok) return jsonResult({ ok: false, error: message.error, status: 400 });

  const subject = `Contact · ${topic.value} from ${name.value}`;
  const text = [`Name: ${name.value}`, `Email: ${email.value}`, `Topic: ${topic.value}`, "", message.value].join("\n");
  const result = await deliverIntake({
    kind: "contact",
    email: email.value,
    roleKey: topic.value,
    subject,
    text,
    ip: clientIp(request),
    visitorSla: sla.employer,
  });
  if (result.ok) return Response.json({ ok: true, id: result.id });
  return jsonResult(result);
}
