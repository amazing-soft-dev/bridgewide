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
