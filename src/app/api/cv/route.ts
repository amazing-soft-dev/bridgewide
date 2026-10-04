import { inspectCv, MAX_CV_BYTES } from "@/lib/cv-file";
import { emailField, honeypotTripped, limits, regionField, regionName, textField } from "@/lib/form";
import { jsonResult, sendFormEmail } from "@/lib/mail";

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

  const name = textField(form.get("name"), limits.name, "Name");
  if (!name.ok) return jsonResult({ ok: false, error: name.error, status: 400 });

  const email = emailField(form.get("email"));
  if (!email.ok) return jsonResult({ ok: false, error: email.error, status: 400 });

  const region = regionField(form.get("region"));
  if (!region.ok) return jsonResult({ ok: false, error: region.error, status: 400 });

  const uploaded = form.get("file");
  if (!(uploaded instanceof File)) {
    return jsonResult({ ok: false, error: "Attach a CV.", status: 400 });
  }

  const checked = inspectCv(uploaded);
  if (!checked.ok) return jsonResult({ ok: false, error: checked.error, status: 400 });

  const bytes = Buffer.from(await uploaded.arrayBuffer());
  if (bytes.byteLength === 0) {
    return jsonResult({ ok: false, error: "Attach a CV.", status: 400 });
  }
  if (bytes.byteLength > MAX_CV_BYTES) {
    return jsonResult({ ok: false, error: "CV must be 5 MB or smaller.", status: 400 });
  }

  return jsonResult(
    await sendFormEmail({
      subject: `CV from ${name.value}`,
      replyTo: email.value,
      text: [
        `Name: ${name.value}`,
        `Email: ${email.value}`,
        `Region: ${regionName(region.value)} (${region.value})`,
        `File: ${checked.filename}`,
      ].join("\n"),
      attachments: [
        {
          filename: checked.filename,
          // This Resend SDK JSON-encodes the payload, so the in-memory buffer is sent as base64.
          content: bytes.toString("base64"),
          contentType: checked.contentType,
        },
      ],
    }),
  );
}
