"use client";

import { useSearchParams } from "next/navigation";
import { cvFileError } from "@/components/forms/CvForm";
import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitForm } from "@/components/forms/read-submission";
import { useFormSubmit } from "@/hooks/use-form-submit";
import {
  availabilities,
  englishLevels,
  experienceBands,
  formRegions,
  trainingRole,
  workTypes,
} from "@/content/ai-training";
import {
  availabilityField,
  consentField,
  emailField,
  englishField,
  experienceField,
  fieldErrors,
  limits,
  textField,
  trainingRegionField,
  workTypeField,
} from "@/lib/ai-training-form";
import { CV_ACCEPT, CV_HINT } from "@/lib/cv-file";
import { allOk, rightToWorkChoices, rightToWorkField } from "@/lib/form";
import { formsLive } from "@/lib/forms-live";

type ApplyErrors = Partial<
  Record<
    | "name"
    | "email"
    | "experience"
    | "workType"
    | "region"
    | "english"
    | "availability"
    | "file"
    | "consent"
    | "rightToWork",
    string
  >
>;

export function ApplyForm({
  roleSlug,
  roleTitle,
}: {
  roleSlug?: string;
  roleTitle?: string;
}) {
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<ApplyErrors>((data, form) => {
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      experience: experienceField(data.get("experience")),
      workType: workTypeField(data.get("workType")),
      region: trainingRegionField(data.get("region")),
      english: englishField(data.get("english")),
      availability: availabilityField(data.get("availability")),
      consent: consentField(data.get("consent")),
      rightToWork: rightToWorkField(data.get("rightToWork")),
    };
    const file = cvFileError(data.get("file"));
    if (!allOk(fields) || file) return { ok: false, errors: { ...fieldErrors(fields), file } };
    return { ok: true, send: () => submitForm("/api/ai-training/apply", new FormData(form)) };
  });

  return (
    <form
      className="relative grid max-w-xl gap-4"
      noValidate
      aria-label="Apply for AI training work"
      aria-busy={sending}
      onSubmit={onSubmit}
    >
      <Honeypot />
      {!formsLive() ? <p className="text-sm text-stone">This copy of the site cannot send forms.</p> : null}
      {roleSlug ? <input type="hidden" name="role" value={roleSlug} /> : null}
      {roleTitle ? (
        <p className="text-sm text-ink-soft">
          This application mentions the role <span className="text-ink">{roleTitle}</span>.
        </p>
      ) : null}
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
        label="Experience"
        name="experience"
        required
        defaultValue=""
        error={errors.experience}
      >
        <option value="">Choose your experience</option>
        {experienceBands.map((band) => (
          <option key={band.value} value={band.value}>
            {band.label}
          </option>
        ))}
      </Field>
      <Field
        as="select"
        label="Kind of work"
        name="workType"
        required
        defaultValue=""
        error={errors.workType}
      >
        <option value="">Choose a kind of work</option>
        {workTypes.map((type) => (
          <option key={type.slug} value={type.slug}>
            {type.title}
          </option>
        ))}
      </Field>
      <Field as="select" label="Region" name="region" required defaultValue="" error={errors.region}>
        <option value="">Choose a region</option>
        {formRegions.map((region) => (
          <option key={region.slug} value={region.slug}>
            {region.name}
          </option>
        ))}
      </Field>
      <Field
        as="select"
        label="English"
        name="english"
        required
        defaultValue=""
        error={errors.english}
      >
        <option value="">Choose your English level</option>
        {englishLevels.map((level) => (
          <option key={level.value} value={level.value}>
            {level.label}
          </option>
        ))}
      </Field>
      <Field
        as="select"
        label="Availability"
        name="availability"
        required
        defaultValue=""
        error={errors.availability}
      >
        <option value="">Choose part-time or full-time</option>
        {availabilities.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
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
      <Field
        label="CV"
        name="file"
        type="file"
        accept={CV_ACCEPT}
        required
        hint={CV_HINT}
        error={errors.file}
      />
      <div className="grid gap-1.5">
        <label className="flex items-start gap-3 text-sm leading-6 text-ink">
          <input
            className="mt-1"
            type="checkbox"
            name="consent"
            value="yes"
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            I understand my profile is shared with a platform only after I agree to that
            introduction.
          </span>
        </label>
        {errors.consent ? (
          <p id="consent-error" role="alert" className="text-sm font-medium text-ink">
            {errors.consent}
          </p>
        ) : null}
      </div>
      <FormStatus
        status={status}
        error={serverError}
        success="Thanks. The desk aims to review this within three business days."
      />
      <SubmitButton sending={sending}>Apply</SubmitButton>
    </form>
  );
}

/** Reads `?role=` on the client so the page can stay static. */
export function ApplyFormFromQuery() {
  const slug = useSearchParams().get("role") ?? undefined;
  const matched = slug ? trainingRole(slug) : undefined;
  return <ApplyForm roleSlug={matched?.slug} roleTitle={matched?.title} />;
}
