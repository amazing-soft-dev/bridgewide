"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { Field, Honeypot } from "@/components/forms/Field";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitForm } from "@/components/forms/read-submission";
import { regions } from "@/content/site";
import { TALENT_CONSENT_WORDING } from "@/content/sla";
import { CV_ACCEPT, CV_HINT } from "@/lib/cv-file";
import { formsLive } from "@/lib/forms-live";

export function TalentPoolForm() {
  const params = useSearchParams();
  const prefill = params.get("region") ?? "";
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  if (!formsLive()) {
    return <p className="text-sm text-stone">This copy of the site cannot send forms.</p>;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (new FormData(form).get("consent") !== "yes") {
      form.querySelector<HTMLInputElement>("[name=consent]")?.focus();
      setStatus("error");
      setServerError("Consent is required to keep a profile.");
      return;
    }
    setStatus("sending");
    const result = await submitForm("/api/talent-pool", new FormData(form));
    if (!result.ok) {
      setStatus("error");
      setServerError(result.error);
      return;
    }
    setStatus("success");
  }

  return (
    <form id="keep-profile" className="grid max-w-xl scroll-mt-28 gap-4" noValidate aria-label="Keep your profile" onSubmit={onSubmit}>
      <Honeypot />
      <Field label="Name" name="name" autoComplete="name" required />
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field
        as="select"
        label="Region"
        name="region"
        required
        key={prefill}
        defaultValue={prefill}
      >
        <option value="">Choose a region</option>
        {regions.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </Field>
      <Field label="Country" name="country" required />
      <Field label="Discipline" name="discipline" required />
      <Field label="Years of experience" name="years" required />
      <Field as="select" label="Work mode" name="workMode" required defaultValue="">
        <option value="">Choose</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
      </Field>
      <Field as="textarea" label="Profile" name="profile" rows={4} required />
      <Field label="CV" name="file" type="file" accept={CV_ACCEPT} required hint={CV_HINT} />
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" value="yes" />
        {TALENT_CONSENT_WORDING}
      </label>
      <FormStatus status={status} error={serverError} success="Thanks. The desk will keep this profile for 12 months." />
      <SubmitButton sending={status === "sending"}>Keep my profile</SubmitButton>
    </form>
  );
}
