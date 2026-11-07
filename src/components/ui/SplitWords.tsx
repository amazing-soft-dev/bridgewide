"use client";

import { m } from "motion/react";
import { Fragment } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import {
  accentBlockVariants,
  accentTextVariants,
  maskedWordVariants,
  revealViewport,
  wordVariants,
  wordVariantsVisible,
} from "@/lib/motion";

/** "brand" is a heading on the brand-red band: the pill is ink, and the text is already white. */
export type AccentTone = "light" | "dark" | "brand";

/** The accented word's own box: the block sits behind it and the text turns white over it. */
const accentWordClass = "relative z-0 -mx-[0.08em] inline-block px-[0.08em]";
const accentBlockClass =
  "pointer-events-none absolute inset-x-0 top-[0.1em] bottom-[0.02em] -z-10 origin-left rounded-[0.08em]";
const accentBlockTone: Record<AccentTone, string> = {
  light: "bg-brand",
  dark: "bg-brand",
  brand: "bg-ink",
};

/** The static accent, for reduced motion: block in place, word already white. */
export function AccentWord({ children, tone = "light" }: { children: string; tone?: AccentTone }) {
  return (
    <span className={accentWordClass}>
      <span className={`${accentBlockClass} ${accentBlockTone[tone]}`} aria-hidden />
      <span className="relative text-white">{children}</span>
    </span>
  );
}

export function SplitWords({
  text,
  className,
  immediate = false,
  delay = 0,
  shown,
  keepVisible = false,
  masked = false,
  accent = false,
  accentWords = 1,
  accentTone = "light",
}: {
  text: string;
  className?: string;
  immediate?: boolean;
  delay?: number;
  /** When set, play the rise only after this becomes true. Skips whileInView. */
  shown?: boolean;
  /** Rise without fading in. Use on the page's LCP heading. */
  keepVisible?: boolean;
  /**
   * Each word rises from below its own line through a mask, with no fade,
   * as on the reference's section headings.
   */
  masked?: boolean;
  /** Put the brand block behind the last word(s), wiping in after the words rise. */
  accent?: boolean;
  /** How many trailing words the block sits behind. */
  accentWords?: number;
  /** The heading's colour before the accent word turns white. */
  accentTone?: AccentTone;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/);
  const controlled = shown !== undefined;
  const variants = masked ? maskedWordVariants : keepVisible ? wordVariantsVisible : wordVariants;
  const lastIndex = words.length - 1;
  const firstAccent = accent ? Math.max(0, words.length - accentWords) : words.length;

  if (reduced) {
    if (!accent) return <span className={className}>{text}</span>;
    return (
      <span className={className}>
        {words.map((word, index) => (
          <span key={`${word}-${index}`}>
            {index >= firstAccent ? <AccentWord tone={accentTone}>{word}</AccentWord> : word}
            {index < lastIndex ? " " : null}
          </span>
        ))}
      </span>
    );
  }

  return (
    <m.span
      className={className}
      initial="hidden"
      animate={controlled ? (shown ? "visible" : "hidden") : immediate ? "visible" : undefined}
      whileInView={!controlled && !immediate ? "visible" : undefined}
      viewport={!controlled && !immediate ? revealViewport : undefined}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.055, delayChildren: delay },
        },
      }}
    >
      {words.map((word, index) => {
        const accented = index >= firstAccent;
        const inner = (
          <m.span
            key={`${word}-${index}`}
            className={accented ? accentWordClass : "inline-block"}
            data-motion="reveal"
            variants={variants}
          >
            {accented ? (
              <>
                <m.span
                  className={`${accentBlockClass} ${accentBlockTone[accentTone]}`}
                  variants={accentBlockVariants}
                  aria-hidden
                />
                <m.span className="relative" variants={accentTextVariants[accentTone]}>
                  {word}
                </m.span>
              </>
            ) : (
              word
            )}
          </m.span>
        );
        // The space sits outside the inline-block: a trailing space inside one is collapsed away.
        if (!masked) {
          return (
            <Fragment key={`${word}-${index}`}>
              {inner}
              {index < lastIndex ? " " : null}
            </Fragment>
          );
        }
        // The mask: the word slides up out of it. Its padding keeps descenders and the pill inside the clip.
        return (
          <span
            key={`${word}-${index}`}
            className="-mx-[0.05em] -mb-[0.17em] inline-block overflow-hidden px-[0.05em] pb-[0.17em] align-top whitespace-pre"
          >
            {inner}
            {index < lastIndex ? " " : null}
          </span>
        );
      })}
    </m.span>
  );
}
