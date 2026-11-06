"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";
import {
  revealTransition,
  revealViewport,
  staggerChild,
} from "@/lib/motion";

const groupTags = {
  div: m.div,
  dl: m.dl,
  ul: m.ul,
} as const;

const itemTags = {
  div: m.div,
  li: m.li,
} as const;

/**
 * Fades and rises in once the element scrolls into view. `immediate` plays
 * on mount instead, for elements that are on screen at load.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const visible = { opacity: 1, y: 0 };
  return (
    <m.div
      className={className}
      data-motion="reveal"
      initial={{ opacity: 0, y: 24 }}
      animate={immediate ? visible : undefined}
      whileInView={immediate ? undefined : visible}
      viewport={immediate ? undefined : revealViewport}
      transition={{ ...revealTransition, delay }}
    >
      {children}
    </m.div>
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
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: keyof typeof itemTags;
}) {
  const Tag = itemTags[as];

  return (
    <Tag className={className} data-motion="reveal" variants={staggerChild}>
      {children}
    </Tag>
  );
}
