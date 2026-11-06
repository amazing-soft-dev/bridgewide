"use client";

import type { Transition, Variants } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const revealViewport = {
  once: true,
  margin: "0px 0px -10% 0px",
} as const;

export const revealTransition: Transition = {
  duration: 0.6,
  ease,
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: revealTransition,
  },
};

export const wordVariants: Variants = {
  hidden: { opacity: 0, y: "0.55em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

/**
 * Rise without the fade. Used on the page `<h1>`, which is often the Largest
 * Contentful Paint element: text at opacity 0 is not painted, so a fade-in
 * would push LCP back by the length of the animation.
 */
export const wordVariantsVisible: Variants = {
  hidden: { y: "0.55em" },
  visible: {
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

/** The brand block behind an accented heading word: wipes in from the left after the word rises. */
export const accentBlockVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.8, ease: [0.7, 0, 0.2, 1], delay: 0.45 },
  },
};

/**
 * The accented word itself: it flips to white once the block is behind it.
 * The hidden colours are the `ink` and `cloud` tokens from globals.css; Motion
 * cannot interpolate `var()`, so the hex values are repeated here.
 */
export const accentTextVariants: Record<"light" | "dark", Variants> = {
  light: {
    hidden: { color: "#111111" },
    visible: { color: "#ffffff", transition: { duration: 0.3, delay: 0.95 } },
  },
  dark: {
    hidden: { color: "#f4f0e8" },
    visible: { color: "#ffffff", transition: { duration: 0.3, delay: 0.95 } },
  },
};
