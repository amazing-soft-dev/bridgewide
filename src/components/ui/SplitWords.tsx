"use client";

import { m } from "motion/react";
import {
  revealViewport,
  usePrefersReducedMotion,
  wordVariants,
  wordVariantsVisible,
} from "@/lib/motion";

export function SplitWords({
  text,
  className,
  immediate = false,
  delay = 0,
  shown,
  keepVisible = false,
}: {
  text: string;
  className?: string;
  immediate?: boolean;
  delay?: number;
  /** When set, play the rise only after this becomes true. Skips whileInView. */
  shown?: boolean;
  /** Rise without fading in. Use on the page's LCP heading. */
  keepVisible?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/);
  const controlled = shown !== undefined;
  const variants = keepVisible ? wordVariantsVisible : wordVariants;

  if (reduced) {
    return <span className={className}>{text}</span>;
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
      {words.map((word, index) => (
        <m.span
          key={`${word}-${index}`}
          className="inline-block"
          data-motion="reveal"
          variants={variants}
        >
          {word}
          {index < words.length - 1 ? " " : null}
        </m.span>
      ))}
    </m.span>
  );
}
