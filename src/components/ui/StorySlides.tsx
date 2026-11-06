"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ramp } from "@/hooks/scroll-frame";
import { useTrackProgress } from "@/hooks/use-track-progress";

const pad = (value: number) => String(value).padStart(2, "0");

export type StorySlide = {
  key: string;
  image: { src: string; alt: string };
  /** The small mono line under the badge. */
  kicker: ReactNode;
  /** The headline block: a quote with its attribution, or a title with copy. */
  copy: ReactNode;
  cta: { href: string; label: string };
  /** The figure card: the big number, its unit line, and the mono footer. */
  card: { figure: string; unit: ReactNode; foot: ReactNode };
  /** The short line under the card. */
  note: ReactNode;
};

/**
 * Full-screen slides pinned while the visitor scrolls, each wiped in from
 * the right over the last. On narrow viewports and under reduced motion the
 * slides stack as ordinary sections.
 *
 * `clearance` says where a neighbouring seam needs room: "bottom" when the
 * next section cuts up into this one, "top" when this section's own seam
 * cuts its top edge.
 */
export function StorySlides({
  id,
  heading,
  headingId,
  badge,
  slides,
  seam,
  clearance,
}: {
  id?: string;
  heading: string;
  headingId: string;
  badge: string;
  slides: readonly StorySlide[];
  seam: "left" | "right";
  clearance: "top" | "bottom";
}) {
  const count = slides.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const gated = useTrackProgress(trackRef, (progress) => {
    const s = ramp(progress, 0.06, 0.88) * (count - 1);
    const next = Math.min(count - 1, Math.round(s));
    return () => {
      stageRef.current?.style.setProperty("--s", s.toFixed(4));
      if (activeRef.current !== next) {
        activeRef.current = next;
        setActive(next);
      }
    };
  });
  const pinned = !gated;

  const padding =
    clearance === "bottom"
      ? "pt-[clamp(5rem,12vh,7rem)] pb-[calc(var(--seam)_+_clamp(1.5rem,4vh,2.75rem))]"
      : "pt-[calc(var(--seam)_+_clamp(3rem,8vh,5rem))] pb-[clamp(1.5rem,4vh,2.75rem)]";

  return (
    <section
      id={id}
      data-header-tone="dark"
      className={`relative z-10 scroll-mt-24 bg-ink text-cloud ${seam === "left" ? "seam-left" : "seam-right"}`}
      aria-labelledby={headingId}
    >
      <h2 id={headingId} className="sr-only">
        {heading}
      </h2>
      <div
        ref={trackRef}
        className="h-[calc((1+(var(--n)-1)*1.4)*100vh)] gate:h-auto"
        style={{ "--n": count } as CSSProperties}
      >
        <div
          ref={stageRef}
          className="sticky top-0 h-[100vh] overflow-hidden bg-[#111] gate:relative gate:h-auto gate:overflow-visible"
          style={{ "--s": 0 } as CSSProperties}
        >
          {slides.map((slide, index) => {
            const hidden = pinned && index !== active;
            return (
              <article
                key={slide.key}
                className="group/slide absolute inset-0 overflow-hidden [--w:clamp(0,((var(--s)_-_var(--i)_+_0.75)/0.5),1)] [--o:clamp(0,((var(--s)_-_var(--i)_-_0.25)/0.5),1)] [--e:calc(var(--w)*var(--w)*(3_-_2*var(--w)))] [--cut:calc(var(--e)*150%)] [clip-path:polygon(calc(150%_-_var(--cut))_0,200%_0,200%_100%,calc(100%_-_var(--cut))_100%)] gate:relative gate:inset-auto gate:[clip-path:none]"
                aria-hidden={hidden || undefined}
                style={{ "--i": index, zIndex: index } as CSSProperties}
              >
                <div className="absolute inset-0 [&_img]:scale-[calc(1.12_-_var(--e)*0.12)] gate:[&_img]:scale-none">
                  <Image
                    src={slide.image.src}
                    alt={slide.image.alt}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>
                <div
                  className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgb(17_17_17/0.9)_0%,rgb(17_17_17/0.68)_42%,rgb(17_17_17/0.4)_100%),linear-gradient(180deg,rgb(17_17_17/0.45),transparent_32%,transparent_68%,rgb(17_17_17/0.6))]"
                  aria-hidden
                />
                <div
                  className={`wrap relative z-[2] grid h-full grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] items-center gap-[clamp(2rem,6vw,5rem)] ${padding} max-[899px]:grid-cols-[minmax(0,1fr)] max-[899px]:items-start max-[899px]:gap-10 gate:h-auto gate:pt-14 gate:pb-14 gate:group-first/slide:pt-[calc(var(--seam)_+_3.5rem)] gate:group-last/slide:pb-[calc(var(--seam)_+_3.5rem)]`}
                >
                  <div className="[opacity:calc(var(--w)*var(--w)_-_var(--o)*1.6)] [translate:0_calc((1_-_var(--w)_-_var(--o))*28px)] gate:opacity-100 gate:[translate:none]">
                    <p className="inline-flex items-center gap-2.5 border border-brand/70 bg-ink/40 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-cloud uppercase">
                      <span aria-hidden className="size-1.5 rounded-full bg-brand" />
                      {badge}
                      <span className="text-cloud/60">
                        {pad(index + 1)} / {pad(count)}
                      </span>
                    </p>
                    <p className="mt-5 font-mono text-[11px] tracking-[0.16em] text-cloud/70 uppercase">
                      {slide.kicker}
                    </p>
                    {slide.copy}
                    <Button
                      href={slide.cta.href}
                      variant="onDark"
                      className="mt-8"
                      tabIndex={hidden ? -1 : undefined}
                    >
                      {slide.cta.label}
                    </Button>
                  </div>
                  <div className="[opacity:calc(var(--w)*var(--w)_-_var(--o)*1.6)] [translate:0_calc((1_-_var(--w)_-_var(--o))*48px)] gate:opacity-100 gate:[translate:none]">
                    <div className="corner-cut w-[min(100%,15rem)] rounded-lg bg-cloud px-[1.15rem] pt-[1.15rem] pb-4 text-ink">
                      <p className="font-display text-6xl leading-none tracking-tight text-brand">
                        {slide.card.figure}
                      </p>
                      <p className="mt-3 text-sm font-semibold">{slide.card.unit}</p>
                      <p className="mt-3 border-t border-dashed border-stone/50 pt-2 font-mono text-[10px] tracking-[0.16em] text-stone uppercase">
                        {slide.card.foot}
                      </p>
                    </div>
                    <p className="mt-4 max-w-[16rem] text-sm leading-6 text-cloud/85">{slide.note}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
