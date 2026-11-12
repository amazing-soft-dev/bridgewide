"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent, type InputHTMLAttributes } from "react";
import { Honeypot } from "@/components/forms/Field";
import { submitForm } from "@/components/forms/read-submission";
import { cutLg } from "@/components/roles/desk";
import { Button } from "@/components/ui/Button";
import { contact, type Role } from "@/content/site";
import { CV_ACCEPT, CV_HINT, inspectCv } from "@/lib/cv-file";
import { emailField, fieldErrors, limits, optionalText, rightToWorkChoices, rightToWorkField, textField } from "@/lib/form";
import { sla } from "@/content/sla";
import { consultantFor } from "@/lib/role-desk";
import { formsLive } from "@/lib/forms-live";
import { focusFirstInvalid } from "@/hooks/use-form-submit";

type Errors = Partial<Record<"name" | "email" | "phone" | "file" | "rightToWork", string>>;

export function RoleApply({
  role,
  refCode,
  closed = false,
}: {
  role: Role;
  refCode: string;
  closed?: boolean;
}) {
  const person = consultantFor(role.consultantName);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [firstName, setFirstName] = useState("");
  const sending = useRef(false);
  const subject = `${role.title} — ${refCode}`;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const fields = {
      name: textField(data.get("name"), limits.name, "Full name"),
      email: emailField(data.get("email")),
      phone: optionalText(data.get("phone"), limits.phone, "Phone"),
      rightToWork: rightToWorkField(data.get("rightToWork")),
    };
    const nextErrors: Errors = fieldErrors(fields);
    const uploaded = data.get("file");
    if (!(uploaded instanceof File) || uploaded.size === 0) {
      nextErrors.file = "Attach a CV.";
    } else {
      const checked = inspectCv(uploaded);
      if (!checked.ok) nextErrors.file = checked.error;
    }
    if (!fields.name.ok || !fields.email.ok || !fields.phone.ok || !fields.rightToWork.ok || nextErrors.file) {
      setErrors(nextErrors);
      setServerError("");
      setStatus("idle");
      focusFirstInvalid(form);
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
      setFirstName(fields.name.value.trim().split(/\s+/)[0] ?? "");
      setStatus("success");
    } finally {
      sending.current = false;
    }
  }

  return (
    <aside id="apply" className="scroll-mt-28 min-[1024px]:sticky min-[1024px]:top-28">
      <div className={`grid gap-4 rounded-xl border border-cloud-soft bg-white p-5 shadow-[0_30px_70px_color-mix(in_srgb,var(--color-ink)_10%,transparent)] ${cutLg}`}>
        <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3.5 border-b-[1.5px] border-dashed border-cloud-soft pb-3.5">
          {person ? (
            <Image
              src={person.image}
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-md object-cover"
            />
          ) : (
            <span className="h-16 w-16 rounded-md bg-cloud" />
          )}
          <div className="grid gap-0.5">
            <span className="font-mono text-xs tracking-[0.16em] text-brand uppercase">Your consultant</span>
            <b className="font-display text-lg tracking-[-0.02em]">{person?.name ?? role.consultantName}</b>
            {person ? <em className="text-[13px] text-stone not-italic">{person.role}</em> : null}
          </div>
        </div>
        <a
          href={`mailto:${contact.email}?subject=${encodeURIComponent(subject)}`}
          className="w-fit border-b border-cloud-soft font-mono text-xs text-ink no-underline hover:border-ink"
        >
          {contact.email}
        </a>
        {closed ? (
          <div className="grid gap-2">
            <h3 className="font-display m-0 text-[22px] tracking-[-0.03em]">This role is closed.</h3>
            <p className="m-0 text-sm text-stone">
              The close date has passed. Leave a CV and a short profile, and the desk will write if a matching seat opens.
            </p>
            <a className="font-semibold text-ink underline decoration-brand underline-offset-4" href={`/contact?region=${role.region}#keep-profile`}>
              Keep your profile
            </a>
          </div>
        ) : !formsLive() ? (
          <p className="m-0 text-sm text-stone">This copy of the site cannot send forms.</p>
        ) : status === "success" ? (
          <div role="status" className="grid justify-items-start gap-2.5 py-2">
            <span
              data-motion="reveal"
              className="motion-safe:animate-role-stamp -rotate-[7deg] rounded-md border-[2.5px] border-brand px-3 py-1.5 font-mono text-xs tracking-[0.16em] text-brand uppercase"
            >
              Applied
            </span>
            <h3 className="font-display m-0 text-[26px] tracking-[-0.03em]">Thanks, {firstName}.</h3>
            <p className="m-0 text-stone">{sla.role}</p>
          </div>
        ) : (
          <form className="relative grid gap-3" noValidate aria-label="Apply in two minutes" onSubmit={onSubmit}>
            <Honeypot />
            <h3 className="font-display m-0 text-[22px] tracking-[-0.03em]">Apply in two minutes</h3>
            <input type="hidden" name="region" value={role.region} />
            <input type="hidden" name="role" value={role.title} />
            <input type="hidden" name="ref" value={refCode} />
            <FloatField label="Full name" name="name" autoComplete="name" required error={errors.name} />
            <FloatField label="Email" name="email" type="email" autoComplete="email" required error={errors.email} />
            <FloatField label="Phone" name="phone" type="tel" autoComplete="tel" error={errors.phone} />
            <label className="grid gap-1 text-sm">
              <span className="font-mono text-xs tracking-[0.12em] text-stone uppercase">Right to work</span>
              <select name="rightToWork" defaultValue="" className="min-h-12 rounded-md border border-cloud-soft bg-cloud px-3">
                <option value="">Choose one</option>
                {rightToWorkChoices.map((choice) => (
                  <option key={choice} value={choice}>
                    {choice}
                  </option>
                ))}
              </select>
              {errors.rightToWork ? <em className="text-xs text-brand not-italic">{errors.rightToWork}</em> : null}
            </label>
            <FileField error={errors.file} />
            {status === "error" ? (
              <p role="alert" className="m-0 text-xs text-brand">
                {serverError}
              </p>
            ) : null}
            <Button type="submit" className="mt-1 w-full" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send application"}
            </Button>
            <p className="m-0 font-mono text-xs tracking-[0.08em] text-stone">
              No account. Your CV goes to the desk only. {CV_HINT}
            </p>
          </form>
        )}
      </div>
    </aside>
  );
}

function FloatField({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="grid gap-1">
      <span
        className={`relative block rounded-md bg-cloud ${
          error ? "border border-brand" : "border border-transparent focus-within:border-cloud-soft focus-within:bg-white"
        }`}
      >
        <input
          {...props}
          placeholder=" "
          className="peer block w-full min-h-[54px] rounded-md border-0 bg-transparent px-3 pt-[22px] pb-1.5 text-[15px] text-ink outline-none"
        />
        <span className="pointer-events-none absolute top-[18px] left-3 origin-left font-mono text-xs tracking-[0.12em] text-stone uppercase transition duration-300 peer-focus:-translate-y-2.5 peer-focus:scale-[0.82] peer-focus:text-brand peer-[:not(:placeholder-shown)]:-translate-y-2.5 peer-[:not(:placeholder-shown)]:scale-[0.82] peer-[:not(:placeholder-shown)]:text-brand">
          {label}
        </span>
        <i
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-[450ms] peer-focus:scale-x-100"
        />
      </span>
      {error ? <em className="text-xs text-brand not-italic">{error}</em> : null}
    </label>
  );
}

function FileField({ error }: { error?: string }) {
  const [name, setName] = useState("");
  return (
    <label className="grid gap-1">
      <span
        className={`group relative block rounded-md bg-cloud px-3 pt-5 pb-2 ${
          error ? "border border-brand" : "border border-transparent focus-within:border-cloud-soft focus-within:bg-white"
        }`}
      >
        <span className="font-mono text-xs tracking-[0.12em] text-stone uppercase">CV</span>
        <input
          name="file"
          type="file"
          accept={CV_ACCEPT}
          required
          className="mt-1 block w-full text-sm text-ink file:mr-3 file:rounded file:border-0 file:bg-white file:px-2 file:py-1 file:font-mono file:text-xs file:tracking-wide file:text-ink file:uppercase"
          onChange={(event) => setName(event.target.files?.[0]?.name ?? "")}
        />
        {name ? <span className="mt-1 block truncate text-xs text-stone">{name}</span> : null}
        <i
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-brand transition-transform duration-[450ms] group-focus-within:scale-x-100"
        />
      </span>
      {error ? <em className="text-xs text-brand not-italic">{error}</em> : null}
    </label>
  );
}
