"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { stats } from "@/content/site";

function FlapCell({
  char,
  delay,
}: {
  char: string;
  delay: number;
}) {
  const symbol = !/^\d$/.test(char);
  const [shown, setShown] = useState(symbol ? char : "0");
  const [flipping, setFlipping] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (symbol) return;
    const node = ref.current;
    if (!node) return;

    const target = Number(char);
    let timer = 0;
    let started = false;

    const land = () => {
      setFlipping(false);
      setShown(char);
    };

    const play = () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        land();
        return;
      }

      let step = 0;
      const total = 10 + target;
      const tick = () => {
        setShown(String(step % 10));
        setFlipping(true);
        window.setTimeout(() => setFlipping(false), 120);
        step += 1;
        if (step > total) {
          land();
          return;
        }
        timer = window.setTimeout(tick, 70);
      };
      timer = window.setTimeout(tick, delay);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return;
        started = true;
        play();
      },
      { threshold: 0.4 },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [char, delay, symbol]);

  return (
    <span
      ref={ref}
      className={`relative inline-grid h-[1.28em] place-items-center text-[clamp(2.5rem,4.6vw,4.25rem)] leading-none font-semibold text-cloud after:absolute after:top-1/2 after:right-0 after:left-0 after:h-[1.5px] after:bg-[rgb(243_1_0/0.7)] after:content-[''] ${
        symbol
          ? "w-[0.55em] bg-transparent shadow-none after:hidden"
          : "w-[0.8em] rounded-[5px] bg-ink shadow-[inset_0_1px_0_rgb(244_240_232/0.1),0_8px_22px_rgb(0_0_0/0.3)]"
      } ${flipping ? "animate-flap-fold" : ""}`}
    >
      {shown}
    </span>
  );
}

function FlapValue({ value, index }: { value: string; index: number }) {
  return (
    <span className="flex gap-[3px] font-mono" aria-label={value}>
      {value.split("").map((char, digit) => (
        <FlapCell
          key={`${value}-${digit}`}
          char={char}
          delay={index * 140 + digit * 60}
        />
      ))}
    </span>
  );
}

export default function RecordSection() {
  return (
    <section data-header-tone="dark"
      className="relative z-10 mt-[calc(var(--seam)*-1)] overflow-hidden bg-ink pt-24 pb-24 text-cloud [clip-path:polygon(0_0,100%_var(--seam),100%_100%,0_100%)] md:pt-28 md:pb-28"
      aria-labelledby="record-heading"
    >
      <p
        className="absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap font-display text-[clamp(5rem,18vw,16rem)] leading-none font-extrabold tracking-[-0.04em] text-transparent pointer-events-none [-webkit-text-stroke:1.5px_rgb(244_240_232/0.16)] max-[899px]:hidden motion-reduce:hidden"
        aria-hidden
      >
        PLACED · PLACED · PLACED
      </p>
      <div
        className={`relative grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] ${sectionContainer}`}
      >
        <SectionHeading
          id="record-heading"
          tone="dark"
          eyebrow="The record"
          title="Numbers we would put on a departures board."
        />
        <ul className="grid grid-cols-2 gap-x-8 gap-y-8">
          {stats.map((stat, index) => (
            <li key={stat.label} className="grid gap-2.5">
              <FlapValue value={stat.value} index={index} />
              <p className="font-mono text-[10.5px] tracking-[0.14em] text-cloud/80 uppercase">
                {stat.label}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
