"use client";

import { m } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import {
  accentBlockVariants,
  accentTextVariants,
  revealViewport,
  wordVariants,
  wordVariantsVisible,
} from "@/lib/motion";

export type AccentTone = "light" | "dark";

/** The accented word's own box: the block sits behind it and the text turns white over it. */
const accentWordClass = "relative z-0 -mx-[0.08em] inline-block px-[0.08em]";
const accentBlockClass =
  "pointer-events-none absolute inset-x-0 top-[0.1em] bottom-[0.02em] -z-10 origin-left rounded-[0.08em] bg-brand";

/** The static accent, for reduced motion: block in place, word already white. */
export function AccentWord({ children }: { children: string }) {
  return (
    <span className={accentWordClass}>
      <span className={accentBlockClass} aria-hidden />
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
  accent = false,
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
  /** Put the brand block behind the last word, wiping in after the words rise. */
  accent?: boolean;
  /** The heading's colour before the accent word turns white. */
  accentTone?: AccentTone;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/);
  const controlled = shown !== undefined;
  const variants = keepVisible ? wordVariantsVisible : wordVariants;
  const lastIndex = words.length - 1;

  if (reduced) {
    if (!accent) return <span className={className}>{text}</span>;
    return (
      <span className={className}>
        {words.slice(0, lastIndex).join(" ")}
        {lastIndex > 0 ? " " : null}
        <AccentWord>{words[lastIndex]}</AccentWord>
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
        const accented = accent && index === lastIndex;
        return (
          <m.span
            key={`${word}-${index}`}
            className={accented ? accentWordClass : "inline-block"}
            data-motion="reveal"
            variants={variants}
          >
            {accented ? (
              <>
                <m.span className={accentBlockClass} variants={accentBlockVariants} aria-hidden />
                <m.span className="relative" variants={accentTextVariants[accentTone]}>
                  {word}
                </m.span>
              </>
            ) : (
              word
            )}
            {index < lastIndex ? " " : null}
          </m.span>
        );
      })}
    </m.span>
  );
}
