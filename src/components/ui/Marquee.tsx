"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/motion";

export function Marquee({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return (
      <div className={className ?? "flex flex-wrap gap-x-8 gap-y-3"}>{children}</div>
    );
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex w-max"
        data-motion="marquee"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 42, ease: "linear", repeat: Infinity }}
      >
        <div className="flex shrink-0 items-center gap-10 pr-10">{children}</div>
        <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
