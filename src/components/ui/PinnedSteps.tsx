"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ramp } from "@/hooks/scroll-frame";
import { useTrackProgress } from "@/hooks/use-track-progress";

export type PinnedStep = {
  key: string;
  /** The mono label above the step title: a weekday, or "01". */
  label: string;
  title: string;
  copy: string;
};

/**
 * A pinned stage with a timeline of steps that light up as the visitor
 * scrolls, and a background photo per step. On narrow viewports and under
 * reduced motion it lays out as a plain vertical list.
 *
 * `--n` is the step count and `--k` the share of the scroll each step takes
 * to reveal; both drive the per-step CSS without a class per count.
 */
export function PinnedSteps({
  id,
  headingId,
  eyebrow,
  title,
  lede,
  steps,
  images,
  stamp,
  seam,
  trackHeight,
  revealSpan = 0.16,
}: {
  id?: string;
  headingId: string;
  eyebrow: string;
  title: string;
  lede: string;
  steps: readonly PinnedStep[];
  /** One photo per step, shown behind the stage while that step is active. */
  images: readonly string[];
  /** A word stamped over the stage once every step has revealed. */
  stamp?: string;
  seam?: "left" | "right";
  /** Height of the scroll track, such as "h-[560vh]". */
  trackHeight: string;
  revealSpan?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useTrackProgress(trackRef, (progress) => {
    const u = ramp(progress, 0.04, 0.92);
    const stamped = u >= 0.98 ? "true" : "false";
    const next = Math.min(steps.length - 1, Math.floor(u * steps.length));
    return () => {
      const stage = stageRef.current;
      if (!stage) return;
      stage.style.setProperty("--u", u.toFixed(4));
      if (stage.dataset.stamped !== stamped) stage.dataset.stamped = stamped;
      if (activeRef.current !== next) {
        activeRef.current = next;
        setActive(next);
      }
    };
  });

  const seamClass = seam === "left" ? "seam-left" : seam === "right" ? "seam-right" : "";

  return (
    <section
      id={id}
      data-header-tone="dark"
      className={`relative z-10 scroll-mt-24 bg-ink text-cloud ${seamClass}`}
      aria-labelledby={headingId}
    >
      <div ref={trackRef} className={`${trackHeight} gate:h-auto`}>
        <div
          ref={stageRef}
          className="group/stage sticky top-0 h-svh overflow-hidden bg-[#0a0a0a] gate:relative gate:top-auto gate:h-auto gate:overflow-visible gate:bg-transparent"
          data-stamped="false"
          style={{ "--u": 0, "--n": steps.length, "--k": revealSpan } as CSSProperties}
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden gate:hidden" aria-hidden>
            {images.map((src, index) => (
              <div
                key={src}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: index === active ? 1 : 0, zIndex: index === active ? 1 : 0 }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover transition-transform duration-1000"
                  style={{ transform: index === active ? "scale(1.06)" : "scale(1)" }}
                />
              </div>
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgb(10_10_10/0.84)_0%,rgb(10_10_10/0.42)_46%,rgb(10_10_10/0.9)_100%)] gate:hidden"
            aria-hidden
          />
          <div className="wrap relative z-[2] flex h-full flex-col pt-24 pb-9 gate:block gate:h-auto gate:pt-24 gate:pb-16">
            <SectionHeading id={headingId} tone="dark" eyebrow={eyebrow} title={title} lede={lede} />
            <div className="mt-auto pt-5 gate:mt-11 gate:pt-0">
              <div className="relative">
                <div className="pointer-events-none absolute top-0 right-0 left-0 h-0.5 bg-[rgb(243_1_0/0.28)] gate:hidden" aria-hidden />
                <div className="absolute top-0 right-0 left-0 z-[1] h-0.5 origin-left bg-brand [transform:scaleX(var(--u))] gate:hidden" aria-hidden />
                <ol className="m-0 grid list-none grid-cols-[repeat(var(--n),minmax(0,1fr))] gap-4 p-0 gate:ml-[0.35rem] gate:flex gate:flex-col gate:gap-7 gate:border-l gate:border-brand gate:pl-[1.35rem]">
                  {steps.map((step, index) => (
                    <li
                      key={step.key}
                      className="relative flex min-w-0 flex-col pt-[3.15rem] [--start:calc(var(--i)/var(--n))] [--reveal:clamp(0,(var(--u)_-_var(--start))/var(--k),1)] before:absolute before:top-0 before:left-2 before:h-[2.7rem] before:w-0.5 before:bg-[rgb(244_240_232/0.32)] before:content-[''] before:[opacity:var(--reveal)] gate:pt-0 gate:before:hidden"
                      style={{ "--i": index } as CSSProperties}
                    >
                      <span
                        className="absolute -top-[7px] left-0 z-[2] size-[18px] rounded-full border-2 border-[rgb(244_240_232/0.35)] bg-[#0a0a0a] after:absolute after:top-[3px] after:left-[3px] after:size-2 after:rounded-full after:bg-brand after:content-[''] after:[transform:scale(var(--reveal))] gate:top-[0.35rem] gate:left-[calc(-1.35rem_-_9px)] gate:border-brand gate:after:[transform:scale(1)]"
                        aria-hidden
                      />
                      <article className="flex-1 rounded-b-lg border border-cloud/12 border-t-[3px] border-t-brand bg-ink/66 px-3.5 pt-4 pb-4 backdrop-blur-[14px] [opacity:var(--reveal)] [transform:translateY(calc((1_-_var(--reveal))*-22px))] gate:border-t-0 gate:bg-transparent gate:p-0 gate:opacity-100 gate:backdrop-blur-none gate:[transform:none]">
                        <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">{step.label}</p>
                        <h3 className="mt-2 font-display text-2xl leading-tight text-cloud">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-cloud/85">{step.copy}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            {stamp ? (
              <p
                className="pointer-events-none absolute top-[6.75rem] right-0 z-[3] m-0 origin-center rounded-md border-2 border-brand px-[1.1rem] py-[0.45rem] font-display text-[clamp(1.75rem,3vw,2.6rem)] leading-none tracking-[0.08em] whitespace-nowrap text-brand uppercase opacity-0 [transform:rotate(-16deg)_scale(0.86)] [transition:opacity_0.45s_ease,transform_0.5s_cubic-bezier(0.22,1,0.36,1)] group-data-[stamped=true]/stage:opacity-100 group-data-[stamped=true]/stage:[transform:rotate(-12deg)_scale(1)] gate:static gate:mt-10 gate:inline-block gate:opacity-100 gate:[transform:none] gate:[transition:none] gate:group-data-[stamped=true]/stage:[transform:none]"
                aria-hidden="true"
              >
                {stamp}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
