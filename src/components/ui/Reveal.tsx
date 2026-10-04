"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import {
  revealTransition,
  revealViewport,
  staggerChild,
} from "@/lib/motion";

const groupTags = {
  div: motion.div,
  dl: motion.dl,
} as const;

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      data-motion="reveal"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  as = "div",
  stagger = 0.08,
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof groupTags;
  stagger?: number;
}) {
  const Tag = groupTags[as];

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: 0.05 },
        },
      }}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} data-motion="reveal" variants={staggerChild}>
      {children}
    </motion.div>
  );
}
