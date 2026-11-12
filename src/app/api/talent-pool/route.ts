import { TALENT_CONSENT_VERSION, sla } from "@/content/sla";
import { inspectCv, inspectCvContent, MAX_CV_BYTES } from "@/lib/cv-file";
import {
  emailField,
  honeypotTripped,
  limits,
  regionField,
  regionName,
  textField,
} from "@/lib/form";
import { clientIp, deliverIntake } from "@/lib/intake";
import { tokenFromForm } from "@/lib/turnstile";
import { jsonResult } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonResult({ ok: false, error: "Request body must be a form.", status: 400 });
  }

  if (honeypotTripped(form.get("companyWebsite"))) {
    return jsonResult({ ok: true });
  }

  if (form.get("consent") !== "yes") {
    return jsonResult({ ok: false, error: "Consent is required to keep a profile.", status: 400 });
  }

  const name = textField(form.get("name"), limits.name, "Name");
  if (!name.ok) return jsonResult({ ok: false, error: name.error, status: 400 });
  const email = emailField(form.get("email"));
  if (!email.ok) return jsonResult({ ok: false, error: email.error, status: 400 });
  const region = regionField(form.get("region"));
  if (!region.ok) return jsonResult({ ok: false, error: region.error, status: 400 });
  const country = textField(form.get("country"), limits.company, "Country");
  if (!country.ok) return jsonResult({ ok: false, error: country.error, status: 400 });
  const discipline = textField(form.get("discipline"), limits.roleTitle, "Discipline");
  if (!discipline.ok) return jsonResult({ ok: false, error: discipline.error, status: 400 });
  const years = textField(form.get("years"), 20, "Years");
  if (!years.ok) return jsonResult({ ok: false, error: years.error, status: 400 });
  const workMode = textField(form.get("workMode"), 40, "Work mode");
  if (!workMode.ok) return jsonResult({ ok: false, error: workMode.error, status: 400 });
  const profile = textField(form.get("profile"), limits.message, "Profile");
  if (!profile.ok) return jsonResult({ ok: false, error: profile.error, status: 400 });

  const uploaded = form.get("file");
  if (!(uploaded instanceof File)) {
    return jsonResult({ ok: false, error: "Attach a CV.", status: 400 });
  }
  const checked = inspectCv(uploaded);
  if (!checked.ok) return jsonResult({ ok: false, error: checked.error, status: 400 });
  const bytes = Buffer.from(await uploaded.arrayBuffer());
  if (bytes.byteLength > MAX_CV_BYTES) {
    return jsonResult({ ok: false, error: "CV must be 5 MB or smaller.", status: 400 });
  }
  const content = inspectCvContent(checked.filename, bytes);
  if (!content.ok) return jsonResult({ ok: false, error: content.error, status: 400 });

  const result = await deliverIntake({
    kind: "talent-pool",
    email: email.value,
    subject: `Talent pool · ${regionName(region.value)} from ${name.value}`,
    ip: clientIp(request),
    humanToken: tokenFromForm(form),
    visitorSla: sla.role,
    filename: checked.filename,
    fileBase64: bytes.toString("base64"),
    text: [
      `Name: ${name.value}`,
      `Email: ${email.value}`,
      `Region: ${regionName(region.value)}`,
      `Country: ${country.value}`,
      `Discipline: ${discipline.value}`,
      `Years: ${years.value}`,
      `Work mode: ${workMode.value}`,
      `File: ${checked.filename}`,
      `Consent: ${TALENT_CONSENT_VERSION}`,
      "",
      profile.value,
    ].join("\n"),
  });
  if (result.ok) return Response.json({ ok: true, id: result.id });
  return jsonResult(result);
}
