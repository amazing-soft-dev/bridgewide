"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

const DIGITS = "0123456789";

/** The first tile starts this long after the band comes into view. */
const START = 260;
/** Each later tile starts this much later and takes one more tick, so the figure settles left to right. */
const STAGGER = 110;
const TICK = 135;

/**
 * One split-flap tile. A digit starts at 0 and, once the band is on, folds
 * through a run of shuffled digits before landing on its own: 5 ticks plus
 * one per tile index, 135ms apart, the digit swapping at the fold's midpoint.
 * A symbol (comma, %, letter) is set plainly, with no tile or fold.
 */
function FlapCell({ char, tile, on }: { char: string; tile: number; on: boolean }) {
  const symbol = !/^\d$/.test(char);
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(symbol ? char : "0");
  const [folding, setFolding] = useState(false);
  /** Under reduced motion the digit lands at once, with no fold sequence. */
  const display = reduced ? char : shown;

  useEffect(() => {
    if (symbol || !on || reduced) return;

    const ticks = 5 + tile;
    const timers: number[] = [];
    const later = (task: () => void, ms: number) => timers.push(window.setTimeout(task, ms));
    let tick = 0;

    const fold = () => {
      tick += 1;
      setFolding(true);
      later(() => setShown(tick >= ticks ? char : DIGITS[(tick * 3 + tile) % 10]), 70);
      later(() => setFolding(false), 120);
      if (tick < ticks) later(fold, TICK);
    };
    later(fold, START + tile * STAGGER);

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [char, on, reduced, symbol, tile]);

  return (
    <span
      className={`relative inline-grid h-[1.28em] place-items-center text-[clamp(2.5rem,4.6vw,4.25rem)] leading-none font-semibold text-cloud after:absolute after:top-1/2 after:right-0 after:left-0 after:h-[1.5px] after:bg-[rgb(243_1_0/0.7)] after:content-[''] max-[899px]:text-[clamp(1.875rem,8vw,2.75rem)] ${
        symbol
          ? "w-[0.7em] bg-transparent shadow-none after:hidden"
          : "w-[0.8em] rounded-[5px] bg-ink shadow-[inset_0_1px_0_rgb(244_240_232/0.1),0_8px_22px_rgb(0_0_0/0.3)]"
      } ${folding ? "animate-flap-fold" : ""}`}
    >
      {display}
    </span>
  );
}

/**
 * A figure set as a row of split-flap tiles. `index` is the figure's place in
 * the band's grid; `on` is the band's single in-view trigger, so every tile
 * on the band counts from the same moment.
 */
export function FlapValue({ value, index, on }: { value: string; index: number; on: boolean }) {
  return (
    <span className="flex gap-[3px] font-mono" aria-label={value}>
      {value.split("").map((char, digit) => (
        <FlapCell key={`${value}-${digit}`} char={char} tile={digit + index * 2} on={on} />
      ))}
    </span>
  );
}
