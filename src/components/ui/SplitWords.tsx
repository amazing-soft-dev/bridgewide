"use client";

import { motion } from "motion/react";
import { revealViewport, usePrefersReducedMotion, wordVariants } from "@/lib/motion";

export function SplitWords({
  text,
  className,
  immediate = false,
  delay = 0,
  shown,
}: {
  text: string;
  className?: string;
  immediate?: boolean;
  delay?: number;
  /** When set, play the rise only after this becomes true. Skips whileInView. */
  shown?: boolean;
}) {
  const reduced = usePrefersReducedMotion();
  const words = text.trim().split(/\s+/);
  const controlled = shown !== undefined;

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
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
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          data-motion="reveal"
          variants={wordVariants}
        >
          {word}
          {index < words.length - 1 ? "\u00A0" : null}
        </motion.span>
      ))}
    </motion.span>
  );
}
