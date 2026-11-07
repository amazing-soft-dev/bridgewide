"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollFrame } from "@/hooks/scroll-frame";
import { motionGate, useMediaQuery } from "@/hooks/use-media-query";
import { trainingSteps } from "@/content/ai-training";

const stepImages = [
  "/images/training-path-1.webp",
  "/images/training-path-2.webp",
  "/images/training-path-3.webp",
  "/images/training-path-4.webp",
] as const;

const pad = (value: number) => String(value).padStart(2, "0");

/** Where the first card sticks, under the header. Each later card sits `STEP` lower, so the stack shows its edges. */
const STICK_TOP = "7rem";
const STEP = "1.4rem";

/**
 * The four steps as cards that stack as the visitor scrolls: each card slides
 * up over the one before it and holds under the header, so the finished
 * stack is the whole path. The heading, the apply button, and a rail of the
 * step numbers stay put on the left and mark the card on top. On narrow
 * viewports and under reduced motion the cards are a plain list.
 */
export function PathSteps() {
  const gated = useMediaQuery(motionGate);
  const cards = useRef<Array<HTMLLIElement | null>>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useScrollFrame(() => {
    // A card is "on top" once it has reached its own sticky line; the last such card wins.
    let next = 0;
    cards.current.forEach((card, index) => {
      if (!card) return;
      const line = parseFloat(getComputedStyle(card).top) + 2;
      if (card.getBoundingClientRect().top <= line) next = index;
    });
    if (next === activeRef.current) return;
    activeRef.current = next;
    return () => setActive(next);
  }, !gated);

  return (
    <section id="path" aria-labelledby="path-heading" className="scroll-mt-24 border-t border-cloud-soft bg-cloud text-ink">
      <div className="wrap py-16 md:py-24">
        <div className="grid gap-10 min-[900px]:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] min-[900px]:gap-16">
          <div className="min-[900px]:sticky min-[900px]:top-28 min-[900px]:self-start">
            <SectionHeading
              id="path-heading"
              eyebrow="The path"
              title="Apply, match, brief, start."
              lede="The desk aims to review an application within three business days."
            />
            <Button href="/ai-training/for-candidates" className="mt-8">
              Apply once
            </Button>
            <ol className="mt-12 hidden list-none gap-3 p-0 min-[900px]:grid" aria-hidden>
              {trainingSteps.map((step, index) => {
                const on = !gated && index === active;
                const done = !gated && index < active;
                return (
                  <li
                    key={step.title}
                    className={`flex items-center gap-3 font-mono text-xs tracking-[0.14em] uppercase transition-colors duration-300 ${
                      on ? "text-ink" : done ? "text-stone" : "text-stone/60"
                    }`}
                  >
                    <span
                      className={`h-px transition-[width,background-color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] ${
                        on ? "w-8 bg-brand" : "w-4 bg-stone/50"
                      }`}
                    />
                    <span className={on ? "text-brand" : undefined}>{pad(index + 1)}</span>
                    <span>{step.title}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <ol className="m-0 grid list-none gap-4 p-0" style={{ "--step": STEP } as CSSProperties}>
            {trainingSteps.map((step, index) => (
              <li
                key={step.title}
                ref={(node) => {
                  cards.current[index] = node;
                }}
                className="min-[900px]:motion-safe:sticky"
                style={{ top: `calc(${STICK_TOP} + ${index} * var(--step))` } as CSSProperties}
              >
                <article className="corner-cut grid overflow-hidden rounded-lg border border-cloud-soft border-t-[3px] border-t-brand bg-white shadow-[0_24px_48px_rgb(17_17_17/0.1)] min-[640px]:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] min-[900px]:min-h-[23rem]">
                  <div className="flex flex-col p-6 md:p-8">
                    <p className="flex items-center gap-3 font-mono text-xs tracking-[0.16em] text-brand uppercase">
                      <span>{pad(index + 1)}</span>
                      <span className="text-stone">/ {pad(trainingSteps.length)}</span>
                    </p>
                    <h3 className="mt-5 font-display text-3xl leading-[1.05] tracking-tight md:text-4xl">{step.title}</h3>
                    <p className="mt-4 max-w-md leading-7 text-ink-soft">{step.copy}</p>
                    <p className="mt-auto pt-6 font-mono text-[11px] tracking-[0.14em] text-stone uppercase">
                      {index === trainingSteps.length - 1 ? "Paid by the platform" : `Then: ${trainingSteps[index + 1]?.title}`}
                    </p>
                  </div>
                  <div className="relative order-first aspect-[16/10] min-[640px]:order-none min-[640px]:aspect-auto min-[640px]:min-h-[14rem]">
                    <Image
                      src={stepImages[index] ?? stepImages[0]}
                      alt=""
                      fill
                      sizes="(max-width: 639px) 100vw, (max-width: 899px) 45vw, 30vw"
                      className="object-cover saturate-[.7]"
                    />
                    <span
                      className="absolute inset-0 bg-[linear-gradient(90deg,rgb(255_255_255/0.35),transparent_40%)] min-[640px]:bg-[linear-gradient(90deg,rgb(255_255_255/0.6),transparent_35%)]"
                      aria-hidden
                    />
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
