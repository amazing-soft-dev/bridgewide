"use client";

import { useRef, useState, type FormEvent } from "react";
import { Field, Honeypot } from "@/components/forms/Field";
import { submitForm } from "@/components/forms/read-submission";
import { Button } from "@/components/ui/Button";
import { regions } from "@/content/site";
import { CV_ACCEPT, CV_HINT, inspectCv } from "@/lib/cv-file";
import { allOk, emailField, fieldErrors, limits, regionField, textField } from "@/lib/form";

type CvErrors = Partial<Record<"name" | "email" | "region" | "file", string>>;

export function CvForm() {
  const [errors, setErrors] = useState<CvErrors>({});
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
      region: regionField(data.get("region")),
    };
    const nextErrors: CvErrors = { ...fieldErrors(fields) };
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
      const result = await submitForm("/api/cv", new FormData(form));

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
      aria-label="Send a CV"
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
      <Field as="select" label="Region" name="region" required defaultValue="" error={errors.region}>
        <option value="">Choose a region</option>
        {regions.map((region) => (
          <option key={region.slug} value={region.slug}>
            {region.name}
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
      {status === "success" ? (
        <p role="status" className="text-sm text-ink">
          Thanks. Your CV is on its way.
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="text-sm font-medium text-ink">
          {serverError}
        </p>
      ) : null}
      <Button type="submit" variant="primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send CV"}
      </Button>
    </form>
  );
}
