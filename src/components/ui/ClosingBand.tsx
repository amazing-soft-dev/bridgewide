"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { AccentLine } from "@/components/roles/AccentLine";
import { deskWrap } from "@/components/roles/desk";
import { useEntered } from "@/hooks/use-entered";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useScrollFrame } from "@/hooks/scroll-frame";

function chamfer(progress: number) {
  const easedIn = Math.min(1, Math.max(0, (progress - 0.08) / 0.3));
  const smooth = easedIn * easedIn * (3 - 2 * easedIn);
  const inset = (1 - smooth) * 100;
  return {
    clip: `polygon(${inset}% 0, 100% 0, 100% ${100 - inset}%, ${100 - inset}% 100%, 0 100%, 0 ${inset}%)`,
    scale: 1.1 - smooth * 0.1,
  };
}

const rise = (on: boolean) => (on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0");

/**
 * The closing call to action: a brand panel that wipes open from its
 * corners as it scrolls in, the headline rising word by word with the last
 * word wiped in brand, a stamped word on the right, and the live role count.
 */
export function ClosingBand({
  headingId,
  eyebrow,
  title,
  copy,
  actions,
  stamp,
  count,
  countLabel,
  image,
  wide = false,
}: {
  headingId: string;
  eyebrow?: string;
  title: string;
  copy: string;
  actions: ReactNode;
  /** The big stamped word on the right, such as "Open". */
  stamp: string;
  count: number;
  countLabel: string;
  /** Background photo. Each band on the site has its own. */
  image: string;
  /** Use the wider roles-desk column instead of the page column. */
  wide?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const on = useEntered();
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useScrollFrame(() => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const view = window.innerHeight;
    const next = Math.min(1, Math.max(0, (view - rect.top) / (rect.height + view)));
    return () => setProgress(next);
  }, !reduced);

  const shape = chamfer(reduced ? 1 : progress);
  const open = reduced || progress > 0.22;

  return (
    <section ref={ref} data-header-tone="dark" className="bg-cloud text-white" aria-labelledby={headingId}>
      <div className="relative min-h-[max(88vh,640px)] overflow-hidden bg-brand" style={{ clipPath: shape.clip }}>
        <div className="absolute inset-0" aria-hidden style={{ scale: String(shape.scale) }}>
          <Image
            src={image}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-[50%_40%] opacity-55 mix-blend-multiply saturate-50 brightness-75"
          />
          <span className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_srgb,var(--color-ink)_82%,transparent),color-mix(in_srgb,var(--color-ink)_45%,transparent))]" />
        </div>
        <div
          className={`${wide ? deskWrap : "wrap"} relative z-[2] grid min-h-[max(88vh,640px)] items-center gap-8 py-16 min-[900px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] min-[900px]:gap-[clamp(24px,4vw,72px)]`}
        >
          <div className="grid gap-5 max-[899px]:order-2">
            {eyebrow ? (
              <p
                data-motion="reveal"
                className={`eyebrow m-0 text-white/80 transition duration-700 ${rise(on)}`}
              >
                {eyebrow}
              </p>
            ) : null}
            <h2
              id={headingId}
              className="font-display max-w-[14ch] text-[clamp(40px,5.4vw,84px)] leading-[1.02] tracking-[-0.04em]"
            >
              <AccentLine text={title} on={on} tone="dark" />
            </h2>
            <p
              data-motion="reveal"
              className={`m-0 max-w-[480px] text-[17px] leading-[1.6] text-white/90 transition duration-700 delay-300 ${rise(on)}`}
            >
              {copy}
            </p>
            <div data-motion="reveal" className={`flex flex-wrap gap-2.5 transition duration-700 delay-500 ${rise(on)}`}>
              {actions}
            </div>
          </div>
          <div className="grid justify-items-end gap-6 max-[899px]:order-1 max-[899px]:justify-items-start">
            <p
              data-motion="reveal"
              className={`border-[4px] border-white px-6 py-3 font-display text-[clamp(40px,12vw,72px)] leading-[0.95] tracking-[-0.04em] text-white -rotate-8 transition duration-500 min-[900px]:border-[5px] min-[900px]:text-[clamp(48px,7vw,112px)] ${
                open ? "scale-100 opacity-100" : "scale-150 opacity-0"
              }`}
            >
              {stamp}
            </p>
            <p className="inline-flex items-center gap-3 rounded-md bg-ink/60 px-2.5 py-2.5 font-mono text-xs tracking-[0.14em] text-white/85 uppercase backdrop-blur-md">
              <b className="rounded bg-ink px-2 py-0.5 font-display text-[28px] tracking-[-0.03em] text-white">
                {count}
              </b>
              {countLabel}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
