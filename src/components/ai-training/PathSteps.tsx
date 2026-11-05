"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { trainingSteps } from "@/content/ai-training";

const stepImages = [
  "/images/training-path-1.webp",
  "/images/training-path-2.webp",
  "/images/training-path-3.webp",
  "/images/training-path-4.webp",
] as const;
const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";

export function PathSteps() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;

    const gate = window.matchMedia(motionGate);
    let frame = 0;

    const apply = () => {
      frame = 0;
      if (gate.matches) return;

      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), Math.max(scrollable, 0));
      const progress = scrollable > 0 ? passed / scrollable : 0;
      const reveal = Math.min(1, Math.max(0, (progress - 0.04) / 0.92));
      stage.style.setProperty("--u", reveal.toFixed(4));

      const next = Math.min(trainingSteps.length - 1, Math.floor(reveal * trainingSteps.length));
      if (activeRef.current !== next) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const syncListener = () => {
      if (gate.matches) {
        window.removeEventListener("scroll", request);
        return;
      }
      window.addEventListener("scroll", request, { passive: true });
      request();
    };

    syncListener();
    window.addEventListener("resize", request);
    gate.addEventListener("change", syncListener);

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      gate.removeEventListener("change", syncListener);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="path" aria-labelledby="path-heading" className="scroll-mt-24 bg-ink text-cloud">
      <div ref={trackRef} className="h-[440vh] gate:h-auto">
        <div
          ref={stageRef}
          className="sticky top-0 h-svh overflow-hidden bg-[#0a0a0a] gate:relative gate:h-auto gate:overflow-visible gate:bg-transparent"
          style={{ "--u": 0 } as CSSProperties}
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden gate:hidden" aria-hidden>
            {stepImages.map((src, index) => (
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
          <div className={`relative z-[2] flex h-full flex-col pt-24 pb-9 gate:block gate:h-auto gate:py-16 ${sectionContainer}`}>
            <SectionHeading
              id="path-heading"
              tone="dark"
              eyebrow="The path"
              title="Apply, match, brief, start."
              lede="The desk aims to review an application within three business days."
            />
            <div className="mt-auto pt-5 gate:mt-11 gate:pt-0">
              <div className="relative">
                <div className="pointer-events-none absolute top-0 right-0 left-0 h-0.5 bg-[rgb(243_1_0/0.28)] gate:hidden" aria-hidden />
                <div className="absolute top-0 right-0 left-0 z-[1] h-0.5 origin-left bg-brand [transform:scaleX(var(--u))] gate:hidden" aria-hidden />
                <ol className="m-0 grid list-none grid-cols-4 gap-4 p-0 gate:ml-[0.35rem] gate:flex gate:flex-col gate:gap-7 gate:border-l gate:border-brand gate:pl-[1.35rem]">
                  {trainingSteps.map((step, index) => (
                    <li
                      key={step.title}
                      className="relative flex min-w-0 flex-col pt-[3.15rem] [--start:calc(var(--i)/4)] [--reveal:clamp(0,(var(--u)_-_var(--start))/0.2,1)] before:absolute before:top-0 before:left-2 before:h-[2.7rem] before:w-0.5 before:bg-[rgb(244_240_232/0.32)] before:content-[''] before:[opacity:var(--reveal)] gate:pt-0 gate:before:hidden"
                      style={{ "--i": index } as CSSProperties}
                    >
                      <span
                        className="absolute -top-[7px] left-0 z-[2] size-[18px] rounded-full border-2 border-[rgb(244_240_232/0.35)] bg-[#0a0a0a] after:absolute after:top-[3px] after:left-[3px] after:size-2 after:rounded-full after:bg-brand after:content-[''] after:[transform:scale(var(--reveal))] gate:top-[0.35rem] gate:left-[calc(-1.35rem_-_9px)] gate:border-brand gate:after:[transform:scale(1)]"
                        aria-hidden
                      />
                      <article className="flex-1 rounded-b-lg border border-cloud/12 border-t-[3px] border-t-brand bg-ink/66 px-3.5 pt-4 pb-4 backdrop-blur-[14px] [opacity:var(--reveal)] [transform:translateY(calc((1_-_var(--reveal))*-22px))] gate:border-t-0 gate:bg-transparent gate:p-0 gate:opacity-100 gate:backdrop-blur-none gate:[transform:none]">
                        <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">0{index + 1}</p>
                        <h3 className="mt-2 font-display text-2xl leading-tight text-cloud">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-cloud/85">{step.copy}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
