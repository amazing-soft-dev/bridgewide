"use client";

import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitJson } from "@/components/forms/read-submission";
import { honeypotValue, useFormSubmit } from "@/hooks/use-form-submit";
import { regions } from "@/content/site";
import { allOk, emailField, fieldErrors, limits, regionListField, textField } from "@/lib/form";
import { formsLive } from "@/lib/forms-live";

type PartnerErrors = Partial<
  Record<"name" | "email" | "company" | "need" | "coverage" | "message" | "volume" | "taskType" | "rate" | "countries", string>
>;

export function PartnerForm() {
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<PartnerErrors>((data) => {
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      company: textField(data.get("company"), limits.company, "Company"),
      need: textField(data.get("need"), limits.roleTitle, "Roles or cohorts"),
      coverage: textField(data.get("coverage"), limits.roleTitle, "Region or time zone"),
      message: textField(data.get("message"), limits.message, "Message"),
      volume: textField(data.get("volume"), 40, "Volume"),
      taskType: textField(data.get("taskType"), limits.roleTitle, "Task type"),
      rate: textField(data.get("rate"), 40, "Rate"),
      countries: regionListField(data.getAll("countries")),
    };
    if (!allOk(fields)) return { ok: false, errors: fieldErrors(fields) };
    return {
      ok: true,
      send: () =>
        submitJson("/api/ai-training/partner", {
          name: fields.name.value,
          email: fields.email.value,
          company: fields.company.value,
          need: fields.need.value,
          coverage: fields.coverage.value,
          message: fields.message.value,
          volume: fields.volume.value,
          taskType: fields.taskType.value,
          rate: fields.rate.value,
          countries: fields.countries.value.split(", ").filter(Boolean),
          companyWebsite: honeypotValue(data),
        }),
    };
  });

  return (
    <form
      className="relative grid max-w-xl gap-4"
      noValidate
      aria-label="Partner inquiry"
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
      <Field label="Company" name="company" autoComplete="organization" required error={errors.company} />
      <Field
        label="Roles or cohorts"
        name="need"
        required
        error={errors.need}
        hint="The kind of people or cohort you need."
      />
      <Field
        label="Region or time zone"
        name="coverage"
        required
        error={errors.coverage}
      />
      <Field label="Volume" name="volume" required error={errors.volume} hint="How many people, or how many tasks." />
      <Field label="Task type" name="taskType" required error={errors.taskType} />
      <Field label="Rate" name="rate" required error={errors.rate} hint="What the platform pays." />
      <fieldset className="grid gap-2">
        <legend className="text-sm font-medium text-ink">Countries that can join</legend>
        {regions.map((region) => (
          <label key={region.slug} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="countries" value={region.slug} />
            {region.name}
          </label>
        ))}
        {errors.countries ? <p className="text-sm font-medium text-ink">{errors.countries}</p> : null}
      </fieldset>
      <Field
        as="textarea"
        label="Message"
        name="message"
        rows={6}
        required
        error={errors.message}
      />
      <FormStatus status={status} error={serverError} success="Thanks. The desk will reply about a shortlist." />
      <SubmitButton sending={sending}>Send inquiry</SubmitButton>
    </form>
  );
}
