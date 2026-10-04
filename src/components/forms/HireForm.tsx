"use client";

import { useRef, useState, type FormEvent } from "react";
import { Field, Honeypot } from "@/components/forms/Field";
import { submitJson } from "@/components/forms/read-submission";
import { Button } from "@/components/ui/Button";
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

function honeypotValue(value: FormDataEntryValue | null) {
  if (typeof value === "string") return value;
  return value ? "filled" : "";
}

export function HireForm() {
  const [errors, setErrors] = useState<HireErrors>({});
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
      company: textField(data.get("company"), limits.company, "Company"),
      roleTitle: textField(data.get("roleTitle"), limits.roleTitle, "Role title"),
      region: regionField(data.get("region")),
      engagement: engagementField(data.get("engagement")),
      message: textField(data.get("message"), limits.message, "Message"),
    };

    if (!allOk(fields)) {
      setErrors(fieldErrors(fields));
      setServerError("");
      setStatus("idle");
      return;
    }

    setErrors({});
    setServerError("");
    setStatus("sending");
    sending.current = true;

    try {
      const result = await submitJson("/api/hire", {
        name: fields.name.value,
        email: fields.email.value,
        company: fields.company.value,
        roleTitle: fields.roleTitle.value,
        region: fields.region.value,
        engagement: fields.engagement.value,
        message: fields.message.value,
        companyWebsite: honeypotValue(data.get("companyWebsite")),
      });

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
      aria-label="Hire engineers"
      aria-busy={status === "sending"}
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
      {status === "success" ? (
        <p role="status" className="text-sm text-ink">
          Thanks. Your hiring brief is on its way.
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-ink">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" variant="primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send hiring brief"}
      </Button>
    </form>
  );
}
