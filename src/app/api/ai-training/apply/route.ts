import { inspectCv, MAX_CV_BYTES } from "@/lib/cv-file";
import {
  availabilityField,
  consentField,
  emailField,
  englishField,
  experienceField,
  honeypotTripped,
  textField,
  trainingRegionField,
  workTypeField,
  limits,
} from "@/lib/ai-training-form";
import { jsonResult, sendFormEmail } from "@/lib/mail";
import {
  availabilities,
  englishLevels,
  experienceBands,
  formRegionName,
  trainingRole,
  workTypeLabel,
} from "@/content/ai-training";

export const runtime = "nodejs";

function labelFor<T extends string>(
  value: T,
  options: readonly { value: T; label: string }[],
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

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

  const experience = experienceField(form.get("experience"));
  if (!experience.ok) return jsonResult({ ok: false, error: experience.error, status: 400 });

  const workType = workTypeField(form.get("workType"));
  if (!workType.ok) return jsonResult({ ok: false, error: workType.error, status: 400 });

  const region = trainingRegionField(form.get("region"));
  if (!region.ok) return jsonResult({ ok: false, error: region.error, status: 400 });

  const english = englishField(form.get("english"));
  if (!english.ok) return jsonResult({ ok: false, error: english.error, status: 400 });

  const availability = availabilityField(form.get("availability"));
  if (!availability.ok) return jsonResult({ ok: false, error: availability.error, status: 400 });

  const consent = consentField(form.get("consent"));
  if (!consent.ok) return jsonResult({ ok: false, error: consent.error, status: 400 });

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

  const roleValue = form.get("role");
  const role =
    typeof roleValue === "string" && roleValue.trim()
      ? trainingRole(roleValue.trim())
      : undefined;

  return jsonResult(
    await sendFormEmail({
      subject: `AI training application from ${name.value}`,
      replyTo: email.value,
      text: [
        `Name: ${name.value}`,
        `Email: ${email.value}`,
        `Experience: ${labelFor(experience.value, experienceBands)}`,
        `Kind of work: ${workTypeLabel(workType.value)}`,
        `Region: ${formRegionName(region.value)} (${region.value})`,
        `English: ${labelFor(english.value, englishLevels)}`,
        `Availability: ${labelFor(availability.value, availabilities)}`,
        role ? `Role: ${role.title} (${role.slug})` : "Role: none",
        "Consent: profile is shared only after the candidate agrees.",
        `File: ${checked.filename}`,
      ].join("\n"),
      attachments: [
        {
          filename: checked.filename,
          content: bytes.toString("base64"),
          contentType: checked.contentType,
        },
      ],
    }),
  );
}
