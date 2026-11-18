"use client";

import { useCallback, useSyncExternalStore } from "react";

/** Narrow viewports and reduced motion: pinned, scroll-driven sections lay out flat. */
export const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";
export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
export const finePointerQuery = "(hover: hover) and (pointer: fine)";

const lists = new Map<string, MediaQueryList>();

function list(query: string) {
  let found = lists.get(query);
  if (!found) {
    found = window.matchMedia(query);
    lists.set(query, found);
  }
  return found;
}

/**
 * One `matchMedia` subscription per query, read through `useSyncExternalStore`
 * so the server and the first client render agree (`serverValue`), and a
 * change re-renders without an extra effect pass.
 */
export function useMediaQuery(query: string, serverValue = false) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const target = list(query);
      target.addEventListener("change", onChange);
      return () => target.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(subscribe, () => list(query).matches, () => serverValue);
}

export function usePrefersReducedMotion() {
  return useMediaQuery(reducedMotionQuery);
}

export function useFinePointer() {
  return useMediaQuery(finePointerQuery);
}

/** False while the tab is hidden, so timers and loops can pause. */
export function usePageVisible() {
  return useSyncExternalStore(
    (onChange) => {
      document.addEventListener("visibilitychange", onChange);
      return () => document.removeEventListener("visibilitychange", onChange);
    },
    () => document.visibilityState !== "hidden",
    () => true,
  );
}
