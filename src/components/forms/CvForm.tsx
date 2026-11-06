"use client";

import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitForm } from "@/components/forms/read-submission";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { regions } from "@/content/site";
import { CV_ACCEPT, CV_HINT, inspectCv } from "@/lib/cv-file";
import { allOk, emailField, fieldErrors, limits, regionField, textField } from "@/lib/form";

type CvErrors = Partial<Record<"name" | "email" | "region" | "file", string>>;

/** Field error for the CV upload, or undefined when the file passes. */
export function cvFileError(uploaded: FormDataEntryValue | null) {
  if (!(uploaded instanceof File) || uploaded.size === 0) return "Attach a CV.";
  const checked = inspectCv(uploaded);
  return checked.ok ? undefined : checked.error;
}

export function CvForm() {
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<CvErrors>((data, form) => {
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      region: regionField(data.get("region")),
    };
    const file = cvFileError(data.get("file"));
    if (!allOk(fields) || file) return { ok: false, errors: { ...fieldErrors(fields), file } };
    return { ok: true, send: () => submitForm("/api/cv", new FormData(form)) };
  });

  return (
    <form
      className="relative grid max-w-xl gap-4"
      noValidate
      aria-label="Send a CV"
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
      <FormStatus status={status} error={serverError} success="Thanks. Your CV is on its way." />
      <SubmitButton sending={sending}>Send CV</SubmitButton>
    </form>
  );
}
