"use client";

import { useRef, useState, type FormEvent } from "react";
import { Field, Honeypot } from "@/components/forms/Field";
import { submitJson } from "@/components/forms/read-submission";
import { Button } from "@/components/ui/Button";
import { allOk, emailField, fieldErrors, limits, textField } from "@/lib/form";

type ContactErrors = Partial<Record<"name" | "email" | "message", string>>;

function honeypotValue(value: FormDataEntryValue | null) {
  if (typeof value === "string") return value;
  return value ? "filled" : "";
}

export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
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
      const result = await submitJson("/api/contact", {
        name: fields.name.value,
        email: fields.email.value,
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
      aria-label="Contact BridgeWide"
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
        as="textarea"
        label="Message"
        name="message"
        rows={6}
        required
        error={errors.message}
      />
      {status === "success" ? (
        <p role="status" className="text-sm text-ink">
          Thanks. Your message is on its way.
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-ink">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" variant="primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
