import type { ReactNode } from "react";
import { pageWrap } from "@/components/pages/format";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";

export function PageSection({
  id,
  label,
  title,
  lede,
  children,
  tone = "cloud",
}: {
  id?: string;
  label: string;
  title?: string;
  lede?: ReactNode;
  children: ReactNode;
  tone?: "cloud" | "ink";
}) {
  const dark = tone === "ink";
  const headingId = title && id ? `${id}-heading` : undefined;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      aria-label={title ? undefined : label}
      className={`scroll-mt-24 ${
        dark
          ? "bg-ink text-cloud"
          : "border-t border-cloud-soft bg-cloud text-ink"
      }`}
    >
      <div className={`${pageWrap} py-16 md:py-24`}>
        <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
          <SplitWords text={label} />
        </p>
        {title ? (
          <h2
            id={headingId}
            className="font-display mt-3 max-w-3xl text-3xl leading-tight md:text-5xl"
          >
            <SplitWords text={title} delay={0.06} />
          </h2>
        ) : null}
        {lede ? (
          <Reveal delay={0.12}>
            <p className={`mt-4 max-w-2xl text-lg leading-8 ${dark ? "text-cloud-soft" : "text-ink-soft"}`}>
              {lede}
            </p>
          </Reveal>
        ) : null}
        <div className={title || lede ? "mt-10" : "mt-8"}>{children}</div>
      </div>
    </section>
  );
}
