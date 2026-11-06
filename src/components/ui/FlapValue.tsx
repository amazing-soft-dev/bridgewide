"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";

function FlapCell({ char, delay }: { char: string; delay: number }) {
  const symbol = !/^\d$/.test(char);
  const [shown, setShown] = useState(symbol ? char : "0");
  const [flipping, setFlipping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const inView = useInView(ref, { threshold: 0.4, once: true });
  /** Under reduced motion the digit lands at once, with no flip sequence. */
  const display = reduced ? char : shown;

  useEffect(() => {
    if (symbol || !inView || reduced) return;

    const target = Number(char);
    const total = 10 + target;
    let step = 0;
    let timer = 0;
    let flip = 0;

    const tick = () => {
      if (step > total) {
        setFlipping(false);
        setShown(char);
        return;
      }
      setShown(String(step % 10));
      setFlipping(true);
      flip = window.setTimeout(() => setFlipping(false), 120);
      step += 1;
      timer = window.setTimeout(tick, 70);
    };
    timer = window.setTimeout(tick, delay);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(flip);
    };
  }, [char, delay, inView, reduced, symbol]);

  return (
    <span
      ref={ref}
      className={`relative inline-grid h-[1.28em] place-items-center text-[clamp(2.5rem,4.6vw,4.25rem)] leading-none font-semibold text-cloud after:absolute after:top-1/2 after:right-0 after:left-0 after:h-[1.5px] after:bg-[rgb(243_1_0/0.7)] after:content-[''] ${
        symbol
          ? "w-[0.55em] bg-transparent shadow-none after:hidden"
          : "w-[0.8em] rounded-[5px] bg-ink shadow-[inset_0_1px_0_rgb(244_240_232/0.1),0_8px_22px_rgb(0_0_0/0.3)]"
      } ${flipping ? "animate-flap-fold" : ""}`}
    >
      {display}
    </span>
  );
}

export function FlapValue({ value, index }: { value: string; index: number }) {
  return (
    <span className="flex gap-[3px] font-mono" aria-label={value}>
      {value.split("").map((char, digit) => (
        <FlapCell key={`${value}-${digit}`} char={char} delay={index * 140 + digit * 60} />
      ))}
    </span>
  );
}
