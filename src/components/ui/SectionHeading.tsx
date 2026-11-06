import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";

type Tone = "light" | "dark";

/** Eyebrow, section <h2>, and lede, rising in as the section scrolls into view. */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  id,
  tone = "light",
  className,
}: {
  eyebrow?: string;
  title?: string;
  lede?: ReactNode;
  /** The h2's id, for the section's aria-labelledby. */
  id?: string;
  tone?: Tone;
  className?: string;
}) {
  const titleColor = tone === "dark" ? "text-cloud" : "text-ink";
  const ledeColor = tone === "dark" ? "text-cloud/85" : "text-ink-soft";

  return (
    <div className={className}>
      {eyebrow ? (
        <p className="eyebrow">
          <SplitWords text={eyebrow} />
        </p>
      ) : null}
      {title ? (
        <h2
          id={id}
          className={`mt-3 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight md:text-5xl ${titleColor}`}
        >
          <SplitWords text={title} delay={0.06} />
        </h2>
      ) : null}
      {lede ? (
        <Reveal className={`mt-4 max-w-2xl text-lg leading-8 ${ledeColor}`} delay={0.12}>
          {lede}
        </Reveal>
      ) : null}
    </div>
  );
}

export const photoSecondaryClass =
  "!border-cloud !bg-transparent !text-cloud hover:!bg-cloud/10";
