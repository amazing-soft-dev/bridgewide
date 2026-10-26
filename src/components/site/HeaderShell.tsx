"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const TOP_ZONE = 80;
const DELTA = 6;

type Tone = "light" | "dark";

/** Tone of the marked section under the header (sections set data-header-tone="dark"). */
function toneUnderHeader(header: HTMLElement): Tone {
  // Sections start at the header's bottom edge (the header holds its own space in flow).
  const probe = Math.max(0, header.getBoundingClientRect().bottom) + 1;
  let tone: Tone = "light";
  document.querySelectorAll<HTMLElement>("[data-header-tone]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top <= probe && r.bottom > probe) {
      tone = el.dataset.headerTone === "dark" ? "dark" : "light";
    }
  });
  return tone;
}

export function HeaderShell({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(false);
  const [tone, setTone] = useState<Tone>("light");

  useEffect(() => {
    const header = ref.current;
    if (!header) return;

    let last = window.scrollY;
    let frame = 0;

    const apply = () => {
      frame = 0;
      setTone(toneUnderHeader(header));
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

    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const toneClass =
    tone === "dark"
      ? "bg-ink/92 text-cloud border-cloud/10"
      : "bg-cloud/95 text-ink border-ink/10";

  return (
    <header
      ref={ref}
      data-tone={tone}
      className={`group/header sticky top-0 z-50 w-full border-b backdrop-blur-md transition-[transform,background-color,color] duration-300 motion-reduce:transition-none data-[tone=dark]:[&_button]:text-cloud ${toneClass}${hidden ? " -translate-y-full" : ""}`}
      onFocus={() => setHidden(false)}
    >
      {children}
    </header>
  );
}
