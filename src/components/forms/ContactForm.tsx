"use client";

import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitJson } from "@/components/forms/read-submission";
import { honeypotValue, useFormSubmit } from "@/hooks/use-form-submit";
import { allOk, emailField, fieldErrors, limits, textField } from "@/lib/form";

type ContactErrors = Partial<Record<"name" | "email" | "message", string>>;

export function ContactForm() {
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<ContactErrors>((data) => {
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      message: textField(data.get("message"), limits.message, "Message"),
    };
    if (!allOk(fields)) return { ok: false, errors: fieldErrors(fields) };
    return {
      ok: true,
      send: () =>
        submitJson("/api/contact", {
          name: fields.name.value,
          email: fields.email.value,
          message: fields.message.value,
          companyWebsite: honeypotValue(data),
        }),
    };
  });

  return (
    <form
      className="relative grid max-w-xl gap-4"
      noValidate
      aria-label="Contact BridgeWide"
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
        as="textarea"
        label="Message"
        name="message"
        rows={6}
        required
        error={errors.message}
      />
      <FormStatus status={status} error={serverError} success="Thanks. Your message is on its way." />
      <SubmitButton sending={sending}>Send message</SubmitButton>
    </form>
  );
}
