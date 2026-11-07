"use client";

import { useEffect, useRef } from "react";
import { useScrollFrame } from "@/hooks/scroll-frame";
import { useMediaQuery } from "@/hooks/use-media-query";

/** How far the band's pass through the viewport slides the word: 20vw each way. */
const SWAY_VW = 40;
/** How much of the remaining distance the word closes each frame, so it eases after the scroll stops. */
const LERP = 0.18;
/** Below this, or under reduced motion, the word is hidden or still. */
const stillQuery = "(max-width: 699px), (prefers-reduced-motion: reduce)";

/**
 * The outline word that runs along the bottom edge of a band: "PLACED ·
 * PLACED · PLACED". It has no motion of its own; the band's progress through
 * the viewport slides it, so it moves left as the visitor scrolls down and
 * back right as they scroll up, easing after each scroll. Hidden on phones
 * and still under reduced motion.
 */
export function DriftingWord({ word, className = "" }: { word: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const still = useMediaQuery(stillQuery);
  const target = useRef(0.5);
  const current = useRef(-1);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  useScrollFrame(() => {
    const node = ref.current;
    const band = node?.parentElement;
    if (!node || !band) return;
    const rect = band.getBoundingClientRect();
    // 0 as the band's top enters at the bottom of the viewport, 1 as its bottom leaves at the top.
    target.current = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));

    return () => {
      if (frame.current) return;
      const settle = () => {
        frame.current = 0;
        const wanted = target.current;
        let progress = current.current;
        // The first measurement lands at once; later ones ease in.
        progress = progress < 0 ? wanted : progress + (wanted - progress) * LERP;
        if (Math.abs(wanted - progress) < 0.0005) progress = wanted;
        current.current = progress;
        node.style.setProperty("--sway", `${((progress - 0.5) * -SWAY_VW).toFixed(3)}vw`);
        if (progress !== wanted) frame.current = requestAnimationFrame(settle);
      };
      frame.current = requestAnimationFrame(settle);
    };
  }, !still);

  const run = Array.from({ length: 4 }, () => word).join(" · ");

  return (
    <p
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute bottom-[calc(var(--seam)-0.3em)] left-0 m-0 w-max translate-x-[var(--sway,0px)] font-display text-[clamp(4.75rem,7vw,6.5rem)] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent will-change-transform [-webkit-text-stroke:1.5px_rgb(255_255_255/0.22)] max-[699px]:hidden ${className}`}
    >
      {run}
    </p>
  );
}
