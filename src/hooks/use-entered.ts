"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

/** Flips on after the first frame so enter transitions can run. */
export function useEntered() {
  const reduced = usePrefersReducedMotion();
  const [on, setOn] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return on || reduced;
}
