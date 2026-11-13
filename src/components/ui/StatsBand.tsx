"use client";

import { m } from "motion/react";
import { useRef } from "react";
import { DriftingWord } from "@/components/ui/DriftingWord";
import { ChipLabel } from "@/components/ui/EyebrowChip";
import { FlapValue } from "@/components/ui/FlapValue";
import { SplitWords } from "@/components/ui/SplitWords";
import { useInView } from "@/hooks/use-in-view";

/** `basis` is the footnote under a figure: the period it covers and what counts. */
export type BandStat = { value: string; label: string; basis?: string };

const rise = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

function StatFigure({ value, index, on }: { value: string; index: number; on: boolean }) {
  if (!/\d/.test(value)) {
    return (
      <span className="font-display text-[clamp(2.5rem,4.6vw,4.25rem)] leading-none tracking-tight max-[899px]:text-[clamp(1.875rem,8vw,2.75rem)]">
        {value}
      </span>
    );
  }
  return <FlapValue value={value} index={index} on={on} />;
}

/**
 * A brand-red band with a chip eyebrow and heading on the left, a two-by-two
 * grid of split-flap figures on the right, and the outline word drifting
 * along its bottom edge. Figures without a digit are set as plain display
 * text.
 *
 * One in-view trigger starts the whole band: the chip fades and rises, the
 * heading's words slide up through their masks and the ink pill wipes in
 * behind the final words, the stat cards rise one after another, and the
 * tiles start to flip.
 */
export function StatsBand({
  id,
  headingId,
  watermark,
  eyebrow,
  title,
  accentWords = 1,
  stats,
  seam,
  className = "",
  note,
}: {
  id?: string;
  headingId: string;
  watermark: string;
  eyebrow: string;
  title: string;
  /** How many of the title's last words sit on the ink pill. */
  accentWords?: number;
  stats: readonly BandStat[];
  seam: "left" | "right";
  className?: string;
  note?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const on = useInView(ref, { threshold: 0.22, rootMargin: "0px 0px -6% 0px", once: true });

  return (
    <section
      ref={ref}
      id={id}
      data-header-tone="dark"
      className={`relative z-10 overflow-hidden bg-brand pt-[calc(var(--seam)+clamp(4rem,9vh,6.875rem))] pb-[calc(var(--seam)+clamp(4rem,9vh,6.875rem))] text-white ${seam === "left" ? "seam-left" : "seam-right"} ${className}`}
      aria-labelledby={headingId}
    >
      <DriftingWord word={watermark} />
      <div className="wrap relative grid items-center gap-9 min-[900px]:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] min-[900px]:gap-[clamp(1.75rem,4vw,4.5rem)]">
        <header className="grid gap-5">
          <m.p
            className="m-0"
            data-motion="reveal"
            initial={{ opacity: 0, y: 12 }}
            animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.9, ease: rise }}
          >
            <ChipLabel tone="brand">{eyebrow}</ChipLabel>
          </m.p>
          <h2
            id={headingId}
            className="m-0 font-display text-[clamp(1.875rem,3.4vw,3.25rem)] leading-[1.02] tracking-[-0.04em] text-balance text-white"
          >
            <SplitWords
              text={title}
              shown={on}
              masked
              accent
              accentWords={accentWords}
              accentTone="brand"
              delay={0.08}
            />
          </h2>
        </header>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-5 min-[900px]:gap-x-7 min-[900px]:gap-y-[22px]">
          {stats.map((stat, index) => (
            <m.li
              key={stat.label}
              className="grid gap-2.5"
              data-motion="reveal"
              initial={{ opacity: 0, y: 26 }}
              animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
              transition={{ duration: 0.9, ease: rise, delay: 0.2 + index * 0.12 }}
            >
              <StatFigure value={stat.value} index={index} on={on} />
              <p className="font-mono text-xs tracking-[0.14em] text-white uppercase">{stat.label}</p>
              {stat.basis ? <p className="m-0 text-[13px] leading-5 text-white">{stat.basis}</p> : null}
            </m.li>
          ))}
        </ul>
      </div>
      {note ? (
        <p className="wrap relative mt-8 max-w-3xl font-mono text-xs leading-5 tracking-[0.04em] text-white/80">{note}</p>
      ) : null}
    </section>
  );
}
