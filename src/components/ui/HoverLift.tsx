"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

export function HoverLift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  return (
    <m.div
      className={className}
      data-motion="hover"
      whileHover={reduced ? undefined : { y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
