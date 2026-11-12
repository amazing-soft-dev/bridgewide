"use client";

import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitJson } from "@/components/forms/read-submission";
import { honeypotValue, useFormSubmit } from "@/hooks/use-form-submit";
import { regions } from "@/content/site";
import { sla } from "@/content/sla";
import {
  allOk,
  emailField,
  engagementField,
  engagementOptions,
  fieldErrors,
  limits,
  regionListField,
  textField,
} from "@/lib/form";
import { formsLive } from "@/lib/forms-live";
import { scopingCallUrl } from "@/lib/status-mail";

type HireErrors = Partial<
  Record<
    | "name"
    | "email"
    | "company"
    | "roleTitle"
    | "regions"
    | "engagement"
    | "manager"
    | "stack"
    | "band"
    | "ninety"
    | "duration"
    | "fee"
    | "message",
    string
  >
>;

export function HireForm() {
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<HireErrors>((data) => {
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      company: textField(data.get("company"), limits.company, "Company"),
      roleTitle: textField(data.get("roleTitle"), limits.roleTitle, "Role title"),
      regions: regionListField(data.getAll("regions")),
      engagement: engagementField(data.get("engagement")),
      manager: textField(data.get("manager"), limits.name, "Hiring manager"),
      stack: textField(data.get("stack"), limits.roleTitle, "Stack"),
      band: textField(data.get("band"), limits.roleTitle, "Band or day rate"),
      ninety: textField(data.get("ninety"), limits.message, "First ninety days"),
      duration:
        data.get("engagement") === "Contract"
          ? textField(data.get("duration"), limits.roleTitle, "Duration")
          : { ok: true as const, value: "" },
      fee: data.get("fee") === "yes" ? { ok: true as const, value: "yes" } : { ok: false as const, error: "Acknowledge the fee." },
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
          regions: fields.regions.value.split(", "),
          engagement: fields.engagement.value,
          manager: fields.manager.value,
          stack: fields.stack.value,
          band: fields.band.value,
          ninety: fields.ninety.value,
          duration: fields.duration.value,
          confidential: data.get("confidential") === "yes",
          fee: fields.fee.value,
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
      <fieldset className="grid gap-2 border-0 p-0">
        <legend className="font-mono text-xs tracking-[0.12em] text-stone uppercase">Regions</legend>
        {regions.map((region) => (
          <label key={region.slug} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="regions" value={region.slug} />
            {region.name}
          </label>
        ))}
        {errors.regions ? <p className="text-sm font-medium text-ink">{errors.regions}</p> : null}
      </fieldset>
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
      <Field label="Hiring manager" name="manager" required error={errors.manager} />
      <Field label="Stack" name="stack" required error={errors.stack} />
      <Field label="Band or day rate" name="band" required error={errors.band} />
      <Field label="First ninety days" name="ninety" required error={errors.ninety} />
      <Field label="Contract duration" name="duration" error={errors.duration} />
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="confidential" value="yes" />
        Confidential search. Keep the company name off the public brief.
      </label>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="fee" value="yes" />
        I acknowledge the published fee: 20% of first-year base and a 12-week replacement for a permanent hire, or an 18% margin and no replacement clock for a contract.
      </label>
      {errors.fee ? <p className="text-sm font-medium text-ink">{errors.fee}</p> : null}
      <Field
        as="textarea"
        label="Message"
        name="message"
        rows={6}
        required
        error={errors.message}
      />
      {!formsLive() ? <p className="text-sm text-stone">This copy of the site cannot send forms.</p> : null}
      <FormStatus
        status={status}
        error={serverError}
        success={
          <>
            Thanks. Your hiring brief is on its way. {sla.employer}{" "}
            {scopingCallUrl(true) ? (
              <a href={scopingCallUrl(true) ?? undefined}>Book a scoping call</a>
            ) : null}
          </>
        }
      />
      <SubmitButton sending={sending}>Send hiring brief</SubmitButton>
    </form>
  );
}
