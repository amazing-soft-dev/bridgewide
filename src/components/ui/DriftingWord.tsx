"use client";

import { useRef } from "react";
import { useScrollFrame } from "@/hooks/scroll-frame";
import { motionGate, useMediaQuery } from "@/hooks/use-media-query";

/** How far the band's pass through the viewport slides the word, in pixels. */
const SCROLL_SWAY = 220;

/**
 * The outline word that runs along the bottom edge of a band: "PLACED ·
 * PLACED · PLACED", repeated so it loops. It drifts left on its own and the
 * band's progress through the viewport slides it as well, so it moves
 * faster one way and slower the other. Hidden on narrow viewports and
 * still under reduced motion.
 */
export function DriftingWord({ word, className = "" }: { word: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const gated = useMediaQuery(motionGate);

  useScrollFrame(() => {
    const node = ref.current;
    const band = node?.parentElement;
    if (!node || !band) return;
    const rect = band.getBoundingClientRect();
    // 0 as the band's top enters at the bottom of the viewport, 1 as its bottom leaves at the top.
    const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
    const sway = ((0.5 - progress) * SCROLL_SWAY).toFixed(1);
    return () => node.style.setProperty("--sway", `${sway}px`);
  }, !gated);

  // Six words per copy keeps two copies wider than any viewport, so the loop never shows a gap.
  // The duration grows with the text, so a long word drifts at about the same speed as a short one.
  const run = Array.from({ length: 6 }, () => word).join(" · ") + " · ";
  const duration = `${Math.round(run.length * 1.8)}s`;

  return (
    <p
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute bottom-[-0.08em] left-0 m-0 flex w-max translate-x-[var(--sway,0px)] font-display text-[clamp(4rem,7vw,6.5rem)] leading-none font-extrabold tracking-[-0.04em] whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.22)] max-[899px]:hidden ${className}`}
    >
      <span className="motion-safe:animate-stats-drift" style={{ animationDuration: duration }}>
        {run}
      </span>
      <span className="motion-safe:animate-stats-drift" style={{ animationDuration: duration }}>
        {run}
      </span>
    </p>
  );
}
