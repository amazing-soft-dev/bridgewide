"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { sampleFiguresNote, stats } from "@/content/site";

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
      className={`flap-cell${symbol ? " is-sym" : ""}${flipping ? " is-flip" : ""}`}
    >
      {shown}
    </span>
  );
}

function FlapValue({ value, index }: { value: string; index: number }) {
  return (
    <span className="flap-num" aria-label={value}>
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
    <section
      className="seam-left relative z-10 overflow-hidden bg-ink pt-24 pb-24 text-cloud md:pt-28 md:pb-28"
      aria-labelledby="record-heading"
    >
      <p className="record-back" aria-hidden>
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
          lede={
            <span className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
              {sampleFiguresNote}
            </span>
          }
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
