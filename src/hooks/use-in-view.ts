"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * Whether `ref` intersects the viewport. With `once`, stays true after the
 * first intersection. Starts false on the server and the first client render.
 */
export function useInView(
  ref: RefObject<Element | null>,
  {
    rootMargin = "0px",
    threshold = 0,
    once = false,
  }: { rootMargin?: string; threshold?: number; once?: boolean } = {},
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        if (visible) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [once, ref, rootMargin, threshold]);

  return inView;
}
