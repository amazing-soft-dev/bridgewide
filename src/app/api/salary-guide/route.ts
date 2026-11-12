import { sla } from "@/content/sla";
import { salaryBands } from "@/content/site";
import { emailField, honeypotTripped, isRecord } from "@/lib/form";
import { clientIp, deliverIntake } from "@/lib/intake";
import { tokenFromJson } from "@/lib/turnstile";
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

  const email = emailField(payload.email);
  if (!email.ok) return jsonResult({ ok: false, error: email.error, status: 400 });

  const text = [
    `Email: ${email.value}`,
    `Edition: ${salaryBands.edition}`,
    "The public guide is already at /salary-guide. This note does not promise a private PDF.",
  ].join("\n");
  const result = await deliverIntake({
    kind: "salary-guide",
    email: email.value,
    subject: "Salary guide request",
    text,
    ip: clientIp(request),
    humanToken: tokenFromJson(payload),
    visitorSla: sla.employer,
  });
  if (result.ok) return Response.json({ ok: true, id: result.id });
  return jsonResult(result);
}
