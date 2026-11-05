import { salaryBands } from "@/content/site";
import { emailField, honeypotTripped, isRecord } from "@/lib/form";
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

  const email = emailField(payload.email);
  if (!email.ok) return jsonResult({ ok: false, error: email.error, status: 400 });

  return jsonResult(
    await sendFormEmail({
      subject: "Salary guide request",
      replyTo: email.value,
      text: [`Email: ${email.value}`, `Edition: ${salaryBands.edition}`].join("\n"),
    }),
  );
}
