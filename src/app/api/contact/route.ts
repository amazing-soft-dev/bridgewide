import { emailField, honeypotTripped, isRecord, limits, textField } from "@/lib/form";
import { jsonResult, sendFormEmail } from "@/lib/mail";

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

  const message = textField(payload.message, limits.message, "Message");
  if (!message.ok) return jsonResult({ ok: false, error: message.error, status: 400 });

  return jsonResult(
    await sendFormEmail({
      subject: `Contact from ${name.value}`,
      replyTo: email.value,
      text: [`Name: ${name.value}`, `Email: ${email.value}`, "", message.value].join("\n"),
    }),
  );
}
