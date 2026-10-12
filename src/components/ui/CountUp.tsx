"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  // Show the new value right away when the prop changes. The effect below
  // animates up to it when motion is allowed.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setShown(value);
  }

  useEffect(() => {
    const node = ref.current;
    const parsed = /^(\d+)(.*)$/.exec(value);
    if (!node || !parsed) return;

    // With reduced motion, `shown` already equals `value`.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const end = Number(parsed[1]);
    const tail = parsed[2];
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        const start = performance.now();
        const duration = 1200;
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - (1 - progress) ** 3;
          setShown(`${Math.round(end * eased)}${tail}`);
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        setShown(`0${tail}`);
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className={className} data-motion="count">
      {shown}
    </span>
  );
}
