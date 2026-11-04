"use client";

import { useSearchParams } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import { Field, Honeypot } from "@/components/forms/Field";
import { submitForm } from "@/components/forms/read-submission";
import { Button } from "@/components/ui/Button";
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
import { CV_ACCEPT, CV_HINT, inspectCv } from "@/lib/cv-file";
import { allOk } from "@/lib/form";

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
    | "consent",
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
  const [errors, setErrors] = useState<ApplyErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const sending = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      experience: experienceField(data.get("experience")),
      workType: workTypeField(data.get("workType")),
      region: trainingRegionField(data.get("region")),
      english: englishField(data.get("english")),
      availability: availabilityField(data.get("availability")),
      consent: consentField(data.get("consent")),
    };
    const nextErrors: ApplyErrors = { ...fieldErrors(fields) };
    const uploaded = data.get("file");

    if (!(uploaded instanceof File) || uploaded.size === 0) {
      nextErrors.file = "Attach a CV.";
    } else {
      const checked = inspectCv(uploaded);
      if (!checked.ok) nextErrors.file = checked.error;
    }

    if (!allOk(fields) || nextErrors.file) {
      setErrors(nextErrors);
      setServerError("");
      setStatus("idle");
      return;
    }

    setErrors({});
    setServerError("");
    setStatus("sending");
    sending.current = true;

    try {
      const result = await submitForm("/api/ai-training/apply", new FormData(form));
      if (!result.ok) {
        setStatus("error");
        setServerError(result.error);
        return;
      }
      form.reset();
      setErrors({});
      setStatus("success");
    } finally {
      sending.current = false;
    }
  }

  return (
    <form
      className="relative grid max-w-xl gap-4"
      noValidate
      aria-label="Apply for AI training work"
      aria-busy={status === "sending"}
      onSubmit={onSubmit}
    >
      <Honeypot />
      {roleSlug ? <input type="hidden" name="role" value={roleSlug} /> : null}
      {roleTitle ? (
        <p className="text-sm text-ink-soft">
          This application mentions the example role <span className="text-ink">{roleTitle}</span>.
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
      {status === "success" ? (
        <p role="status" className="text-sm text-ink">
          Thanks. The desk aims to review this within three business days.
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-ink">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" variant="primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Apply"}
      </Button>
    </form>
  );
}

/** Reads `?role=` on the client so the page can stay static. */
export function ApplyFormFromQuery() {
  const slug = useSearchParams().get("role") ?? undefined;
  const matched = slug ? trainingRole(slug) : undefined;
  return <ApplyForm roleSlug={matched?.slug} roleTitle={matched?.title} />;
}
