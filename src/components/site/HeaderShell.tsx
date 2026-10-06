"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const TOP_ZONE = 80;
const DELTA = 6;

export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    let last = window.scrollY;
    let frame = 0;

    const apply = () => {
      frame = 0;
      const y = window.scrollY;
      const pinned =
        header.contains(document.activeElement) ||
        header.querySelector('[aria-expanded="true"]') !== null;

      if (y < TOP_ZONE || pinned) {
        setHidden(false);
        last = y;
        return;
      }

      const delta = y - last;
      if (Math.abs(delta) <= DELTA) return;
      setHidden(delta > 0);
      last = y;
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", request, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header
      ref={ref}
      className={`sticky top-0 z-50 w-full border-b border-ink/10 bg-cloud/95 text-ink backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none${hidden ? " -translate-y-full" : ""}`}
      onFocus={() => setHidden(false)}
    >
      {children}
    </header>
  );
}
