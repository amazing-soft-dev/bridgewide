"use client";

import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitForm } from "@/components/forms/read-submission";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { regions } from "@/content/site";
import { AI_CONSENT_WORDING } from "@/content/sla";
import { CV_ACCEPT, CV_HINT, inspectCv } from "@/lib/cv-file";
import {
  allOk,
  cvTrackField,
  cvTracks,
  emailField,
  fieldErrors,
  limits,
  regionField,
  rightToWorkChoices,
  rightToWorkField,
  textField,
} from "@/lib/form";
import { formsLive } from "@/lib/forms-live";

type CvErrors = Partial<Record<"name" | "email" | "track" | "region" | "file" | "consent" | "rightToWork", string>>;

/** Field error for the CV upload, or undefined when the file passes. */
export function cvFileError(uploaded: FormDataEntryValue | null) {
  if (!(uploaded instanceof File) || uploaded.size === 0) return "Attach a CV.";
  const checked = inspectCv(uploaded);
  return checked.ok ? undefined : checked.error;
}

export function CvForm() {
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<CvErrors>((data, form) => {
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      track: cvTrackField(data.get("track")),
      region: regionField(data.get("region")),
      rightToWork: rightToWorkField(data.get("rightToWork")),
    };
    const file = cvFileError(data.get("file"));
    const consent =
      fields.track.ok && fields.track.value === "ai-training" && data.get("consent") !== "yes"
        ? "Consent is required before an AI-training introduction."
        : undefined;
    if (!allOk(fields) || file || consent) {
      return { ok: false, errors: { ...fieldErrors(fields), file, consent } };
    }
    return { ok: true, send: () => submitForm("/api/cv", new FormData(form)) };
  });

  return (
    <form
      className="relative grid max-w-xl gap-4"
      noValidate
      aria-label="Send a CV"
      aria-busy={sending}
      onSubmit={onSubmit}
    >
      <Honeypot />
      {!formsLive() ? <p className="text-sm text-stone">This copy of the site cannot send forms.</p> : null}
      <Field label="Name" name="name" autoComplete="name" required error={errors.name} />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={errors.email}
      />
      <Field
        as="select"
        label="This is for"
        name="track"
        required
        defaultValue={cvTracks[0].value}
        hint="Staffing places you with a company. AI training matches you to platforms that pay for model work."
        error={errors.track}
      >
        {cvTracks.map((track) => (
          <option key={track.value} value={track.value}>
            {track.label}
          </option>
        ))}
      </Field>
      <Field as="select" label="Region" name="region" required defaultValue="" error={errors.region}>
        <option value="">Choose a region</option>
        {regions.map((region) => (
          <option key={region.slug} value={region.slug}>
            {region.name}
          </option>
        ))}
      </Field>
      <Field as="select" label="Right to work in this region" name="rightToWork" required defaultValue="" error={errors.rightToWork}>
        <option value="">Choose one</option>
        {rightToWorkChoices.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </Field>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" value="yes" />
        {AI_CONSENT_WORDING}
      </label>
      {errors.consent ? <p className="text-sm font-medium text-ink">{errors.consent}</p> : null}
      <Field
        label="CV"
        name="file"
        type="file"
        accept={CV_ACCEPT}
        required
        hint={CV_HINT}
        error={errors.file}
      />
      <FormStatus status={status} error={serverError} success="Thanks. Your CV is on its way." />
      <SubmitButton sending={sending}>Send CV</SubmitButton>
    </form>
  );
}
