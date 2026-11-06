"use client";

import { LazyMotion, domAnimation } from "motion/react";
import type { ReactNode } from "react";

/**
 * Loads only the DOM animation features (animate, exit, in-view, hover and
 * tap gestures) once for the whole app. Components render `m.*` elements,
 * which carry no animation runtime of their own. `strict` throws in
 * development if a `motion.*` element slips in and would reload the full
 * runtime.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      {children}
    </LazyMotion>
  );
}
