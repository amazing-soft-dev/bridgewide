"use client";

import { useEffect, useState } from "react";
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
 * Starts false so the server and the first client render match.
 * A stylesheet rule already keeps [data-motion] still and visible
 * when the visitor prefers reduced motion.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return reduced;
}
