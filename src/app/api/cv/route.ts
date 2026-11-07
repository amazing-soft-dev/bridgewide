import { inspectCv, MAX_CV_BYTES } from "@/lib/cv-file";
import {
  cvTrackField,
  cvTrackLabel,
  emailField,
  honeypotTripped,
  limits,
  optionalText,
  regionField,
  regionName,
  textField,
} from "@/lib/form";
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

  const track = cvTrackField(form.get("track"));
  if (!track.ok) return jsonResult({ ok: false, error: track.error, status: 400 });

  const region = regionField(form.get("region"));
  if (!region.ok) return jsonResult({ ok: false, error: region.error, status: 400 });

  const phone = optionalText(form.get("phone"), limits.phone, "Phone");
  if (!phone.ok) return jsonResult({ ok: false, error: phone.error, status: 400 });

  const seat = optionalText(form.get("role"), limits.roleTitle, "Role");
  if (!seat.ok) return jsonResult({ ok: false, error: seat.error, status: 400 });

  const ref = optionalText(form.get("ref"), 32, "Reference");
  if (!ref.ok) return jsonResult({ ok: false, error: ref.error, status: 400 });

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

  const seatLine = seat.value && ref.value ? `${seat.value} (${ref.value})` : seat.value;
  const trackLine = cvTrackLabel(track.value);
  const lines = [
    `Name: ${name.value}`,
    `Email: ${email.value}`,
    `For: ${trackLine}`,
    `Region: ${regionName(region.value)} (${region.value})`,
    phone.value ? `Phone: ${phone.value}` : "",
    seatLine ? `Role: ${seatLine}` : "",
    `File: ${checked.filename}`,
  ].filter(Boolean);

  return jsonResult(
    await sendFormEmail({
      subject: seatLine ? `CV from ${name.value} — ${seatLine}` : `CV from ${name.value} — ${trackLine}`,
      replyTo: email.value,
      text: lines.join("\n"),
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
