"use client";

import { useRef, useState, type FormEvent } from "react";
import type { Submission } from "@/components/forms/read-submission";

export type FormStatus = "idle" | "sending" | "success" | "error";

/** The hidden "company website" field. Bots fill it; people never see it. */
export function honeypotValue(data: FormData) {
  const value = data.get("companyWebsite");
  if (typeof value === "string") return value;
  return value ? "filled" : "";
}

/** The Turnstile token the widget put in the form, for forms that post JSON. */
export function humanToken(data: FormData) {
  const value = data.get("cf-turnstile-response");
  return typeof value === "string" ? value : "";
}

export type FormCheck<Errors> =
  | { ok: true; send: () => Promise<Submission> }
  | { ok: false; errors: Errors };

/**
 * Submit flow shared by every form: validate, block double submits, send,
 * and expose idle / sending / success / error with field and server errors.
 *
 * `check` reads the FormData and returns either the field errors or a
 * `send` function that posts the validated values.
 */
export function useFormSubmit<Errors extends object>(
  check: (data: FormData, form: HTMLFormElement) => FormCheck<Errors>,
  { onSuccess }: { onSuccess?: () => void } = {},
) {
  const [errors, setErrors] = useState<Errors>({} as Errors);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverError, setServerError] = useState("");
  const sending = useRef(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;

    const form = event.currentTarget;
    const result = check(new FormData(form), form);

    if (!result.ok) {
      setErrors(result.errors);
      setServerError("");
      setStatus("idle");
      return;
    }

    setErrors({} as Errors);
    setServerError("");
    setStatus("sending");
    sending.current = true;

    try {
      const sent = await result.send();
      if (!sent.ok) {
        setStatus("error");
        setServerError(sent.error);
        return;
      }
      form.reset();
      setStatus("success");
      onSuccess?.();
    } finally {
      sending.current = false;
    }
  }

  return { status, errors, serverError, onSubmit, sending: status === "sending" };
}
