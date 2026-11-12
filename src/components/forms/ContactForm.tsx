"use client";

import { Honeypot } from "@/components/forms/Field";
import { FloatingField } from "@/components/forms/FloatingField";
import { FormStatus, SubmitButton } from "@/components/forms/FormFeedback";
import { submitJson } from "@/components/forms/read-submission";
import { honeypotValue, useFormSubmit } from "@/hooks/use-form-submit";
import { contactTopics } from "@/content/site";
import { allOk, emailField, fieldErrors, limits, textField, topicField } from "@/lib/form";

type ContactErrors = Partial<Record<"name" | "email" | "topic" | "message", string>>;

/** The rotated "Sent" stamp that replaces the status line once the message is away. */
function SentStamp() {
  return (
    <p role="status" className="flex flex-wrap items-center gap-4 text-sm text-ink">
      <span
        className="inline-block rounded-md border-[2.5px] border-brand px-3.5 py-2 font-mono text-[13px] tracking-[0.16em] text-brand uppercase [rotate:-7deg] motion-safe:animate-role-stamp"
        aria-hidden
      >
        Sent
      </span>
      Thanks. Your message is on its way, and a person will answer.
    </p>
  );
}

export function ContactForm() {
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<ContactErrors>((data) => {
    const fields = {
      name: textField(data.get("name"), limits.name, "Name"),
      email: emailField(data.get("email")),
      topic: topicField(data.get("topic")),
      message: textField(data.get("message"), limits.message, "Message"),
    };
    if (!allOk(fields)) return { ok: false, errors: fieldErrors(fields) };
    return {
      ok: true,
      send: () =>
        submitJson("/api/contact", {
          name: fields.name.value,
          email: fields.email.value,
          topic: fields.topic.value,
          message: fields.message.value,
          companyWebsite: honeypotValue(data),
        }),
    };
  });

  return (
    <form
      className="relative grid grid-cols-1 gap-x-4 gap-y-[18px] min-[900px]:grid-cols-2"
      noValidate
      aria-label="Contact BridgeWide"
      aria-busy={sending}
      onSubmit={onSubmit}
    >
      <Honeypot />
      <FloatingField label="Your name" name="name" autoComplete="name" required error={errors.name} />
      <FloatingField
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={errors.email}
      />
      <FloatingField
        as="select"
        label="Topic"
        name="topic"
        defaultValue=""
        error={errors.topic}
        className="min-[900px]:col-span-2"
      >
        <option value="">Choose one</option>
        {contactTopics.map((topic) => (
          <option key={topic} value={topic}>
            {topic}
          </option>
        ))}
      </FloatingField>
      <FloatingField
        as="textarea"
        label="Message"
        name="message"
        rows={4}
        required
        error={errors.message}
        className="min-[900px]:col-span-2"
      />
      <div className="flex flex-col gap-4 min-[900px]:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        {status === "success" ? (
          <SentStamp />
        ) : (
          <p className="max-w-[260px] font-mono text-[11px] leading-5 tracking-[0.06em] text-ink-soft">
            We only use these details to answer you.
          </p>
        )}
        <SubmitButton sending={sending} className="w-full sm:w-auto">
          Send message
        </SubmitButton>
      </div>
      {status === "error" ? (
        <div className="min-[900px]:col-span-2">
          <FormStatus status={status} error={serverError} success={null} />
        </div>
      ) : null}
    </form>
  );
}
