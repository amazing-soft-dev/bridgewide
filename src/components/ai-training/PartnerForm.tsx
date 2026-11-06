"use client";

import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitJson } from "@/components/forms/read-submission";
import { honeypotValue, useFormSubmit } from "@/hooks/use-form-submit";
import { allOk, emailField, fieldErrors, limits, textField } from "@/lib/form";

type PartnerErrors = Partial<
  Record<"name" | "email" | "company" | "need" | "coverage" | "message", string>
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
