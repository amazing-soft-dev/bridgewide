"use client";

import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitJson } from "@/components/forms/read-submission";
import { honeypotValue, useFormSubmit } from "@/hooks/use-form-submit";
import { regions } from "@/content/site";
import {
  allOk,
  emailField,
  engagementField,
  engagementOptions,
  fieldErrors,
  limits,
  regionField,
  textField,
} from "@/lib/form";

type HireErrors = Partial<
  Record<"name" | "email" | "company" | "roleTitle" | "region" | "engagement" | "message", string>
>;

export function HireForm() {
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<HireErrors>((data) => {
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      company: textField(data.get("company"), limits.company, "Company"),
      roleTitle: textField(data.get("roleTitle"), limits.roleTitle, "Role title"),
      region: regionField(data.get("region")),
      engagement: engagementField(data.get("engagement")),
      message: textField(data.get("message"), limits.message, "Message"),
    };
    if (!allOk(fields)) return { ok: false, errors: fieldErrors(fields) };
    return {
      ok: true,
      send: () =>
        submitJson("/api/hire", {
          name: fields.name.value,
          email: fields.email.value,
          company: fields.company.value,
          roleTitle: fields.roleTitle.value,
          region: fields.region.value,
          engagement: fields.engagement.value,
          message: fields.message.value,
          companyWebsite: honeypotValue(data),
        }),
    };
  });

  return (
    <form
      className="relative grid max-w-xl gap-4"
      noValidate
      aria-label="Hire engineers"
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
      <Field
        label="Company"
        name="company"
        autoComplete="organization"
        required
        error={errors.company}
      />
      <Field label="Role title" name="roleTitle" required error={errors.roleTitle} />
      <Field as="select" label="Region" name="region" required defaultValue="" error={errors.region}>
        <option value="">Choose a region</option>
        {regions.map((region) => (
          <option key={region.slug} value={region.slug}>
            {region.name}
          </option>
        ))}
      </Field>
      <Field
        as="select"
        label="Engagement"
        name="engagement"
        required
        defaultValue=""
        error={errors.engagement}
      >
        <option value="">Choose engagement</option>
        {engagementOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </Field>
      <Field
        as="textarea"
        label="Message"
        name="message"
        rows={6}
        required
        error={errors.message}
      />
      <FormStatus status={status} error={serverError} success="Thanks. Your hiring brief is on its way." />
      <SubmitButton sending={sending}>Send hiring brief</SubmitButton>
    </form>
  );
}
