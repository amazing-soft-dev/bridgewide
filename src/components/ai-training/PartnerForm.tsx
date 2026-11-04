"use client";

import { useRef, useState, type FormEvent } from "react";
import { Field, Honeypot } from "@/components/forms/Field";
import { submitJson } from "@/components/forms/read-submission";
import { Button } from "@/components/ui/Button";
import {
  allOk,
  emailField,
  fieldErrors,
  limits,
  textField,
} from "@/lib/form";

type PartnerErrors = Partial<
  Record<"name" | "email" | "company" | "need" | "coverage" | "message", string>
>;

function honeypotValue(value: FormDataEntryValue | null) {
  if (typeof value === "string") return value;
  return value ? "filled" : "";
}

export function PartnerForm() {
  const [errors, setErrors] = useState<PartnerErrors>({});
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
      need: textField(data.get("need"), limits.roleTitle, "Roles or cohorts"),
      coverage: textField(data.get("coverage"), limits.roleTitle, "Region or time zone"),
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
      const result = await submitJson("/api/ai-training/partner", {
        name: fields.name.value,
        email: fields.email.value,
        company: fields.company.value,
        need: fields.need.value,
        coverage: fields.coverage.value,
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
      aria-label="Partner inquiry"
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
      {status === "success" ? (
        <p role="status" className="text-sm text-ink">
          Thanks. The desk will reply about a shortlist.
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-ink">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" variant="primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send inquiry"}
      </Button>
    </form>
  );
}
