"use client";

import { useState } from "react";
import { Honeypot } from "@/components/forms/Field";
import { SubmitButton } from "@/components/forms/FormFeedback";
import { submitJson } from "@/components/forms/read-submission";
import { useFooterShown } from "@/components/site/FooterCurtain";
import { SplitWords } from "@/components/ui/SplitWords";
import { honeypotValue, humanToken, useFormSubmit } from "@/hooks/use-form-submit";
import { SALARY_GUIDE_THANKS } from "@/content/sla";
import { salaryBands } from "@/content/site";
import { emailField } from "@/lib/form";
import { formsLive } from "@/lib/forms-live";

const rise =
  "transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none";

export function FooterSignup() {
  const shown = useFooterShown();
  const [email, setEmail] = useState("");
  const { status, errors, serverError, sending, onSubmit } = useFormSubmit<{ email?: string }>(
    (data) => {
      const address = emailField(data.get("email"));
      if (!address.ok) return { ok: false, errors: { email: address.error } };
      return {
        ok: true,
        send: () =>
          submitJson("/api/salary-guide", {
            email: address.value,
            companyWebsite: honeypotValue(data),
          turnstileToken: humanToken(data),
          }),
      };
    },
    { onSuccess: () => setEmail("") },
  );
  const error = errors.email || serverError;
  const hidden = shown ? "" : "translate-y-3 opacity-0";

  return (
    <form
      className="grid max-w-[460px] content-start gap-4"
      noValidate
      aria-label="Salary guide"
      aria-busy={sending}
      onSubmit={onSubmit}
    >
      <Honeypot />
      {!formsLive() ? <p className="text-sm text-cloud-soft">This copy of the site cannot send forms.</p> : null}
      <p
        className={`font-mono text-xs tracking-[0.14em] text-cloud-soft uppercase ${rise} ${hidden}`}
      >
        <span className="mr-2 inline-block size-[5px] rounded-[1px] bg-brand align-middle" aria-hidden />
        Salary guide
      </p>
      <h2 className="font-display text-[clamp(1.625rem,2.6vw,2.5rem)] leading-[1.02] tracking-tight text-cloud">
        <SplitWords text={salaryBands.edition} shown={shown} />
      </h2>
      {status === "success" ? (
        <p
          role="status"
          className="rounded-lg border border-dashed border-brand px-4 py-3.5 font-mono text-xs tracking-[0.1em] text-cloud uppercase"
        >
          {SALARY_GUIDE_THANKS}
        </p>
      ) : (
        <div className={`grid gap-3 ${rise} ${hidden}`}>
          <div className="flex flex-col items-stretch gap-2.5 sm:flex-row">
            <label className="relative block min-w-0 flex-1 rounded-lg border border-white/20 bg-white/[0.06] transition-[border-color,background-color] duration-300 focus-within:border-white/35 focus-within:bg-white/10">
              <input
                className="peer block min-h-14 w-full rounded-lg bg-transparent px-4 pt-[22px] pb-1.5 text-[15px] text-cloud outline-none placeholder:text-transparent"
                type="email"
                name="email"
                value={email}
                placeholder="Email"
                autoComplete="email"
                required
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "footer-email-error" : undefined}
                onChange={(event) => setEmail(event.target.value)}
              />
              <span className="pointer-events-none absolute top-5 left-4 origin-left font-mono text-xs tracking-[0.14em] text-white/80 uppercase transition-[translate,scale,color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] peer-focus:-translate-y-[11px] peer-focus:scale-[0.8] peer-focus:text-brand peer-[:not(:placeholder-shown)]:-translate-y-[11px] peer-[:not(:placeholder-shown)]:scale-[0.8]">
                Email
              </span>
              <i
                aria-hidden
                className="pointer-events-none absolute right-0 bottom-[-1px] left-0 h-0.5 origin-left scale-x-0 rounded-b-lg bg-brand transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] peer-focus:scale-x-100"
              />
            </label>
            <SubmitButton sending={sending} className="h-14">
              Send
            </SubmitButton>
          </div>
          {error ? (
            <p id="footer-email-error" role="alert" className="text-sm font-medium text-brand">
              {error}
            </p>
          ) : null}
        </div>
      )}
    </form>
  );
}
