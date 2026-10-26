"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { images, week } from "@/content/site";

const weekImages = [
  images.hero,
  images.employers,
  images.engineers,
  images.desk,
  images.close,
] as const;

const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";

export default function WeekSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const stamp = week[week.length - 1]?.title ?? "";

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
      const pp = scrollable > 0 ? passed / scrollable : 0;
      const u = Math.min(1, Math.max(0, (pp - 0.04) / 0.92));

      stage.style.setProperty("--pp", pp.toFixed(4));
      stage.style.setProperty("--u", u.toFixed(4));

      const stamped = u >= 0.98 ? "true" : "false";
      if (stage.dataset.stamped !== stamped) stage.dataset.stamped = stamped;

      const next = Math.min(week.length - 1, Math.floor(u * week.length));
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
    <section
      data-header-tone="dark"
      className="relative z-10 mt-[calc(var(--seam)*-1)] bg-ink text-cloud [clip-path:polygon(0_0,100%_var(--seam),100%_100%,0_100%)]"
      aria-labelledby="week-heading"
    >
      <div ref={trackRef} className="h-[560vh] gate:h-auto">
        <div
          ref={stageRef}
          className="group/stage sticky top-0 h-[100vh] overflow-hidden bg-[#0a0a0a] gate:relative gate:top-auto gate:h-auto gate:overflow-visible gate:bg-transparent"
          data-stamped="false"
          style={{ "--pp": 0, "--u": 0 } as CSSProperties}
        >
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden gate:hidden" aria-hidden>
            {weekImages.map((src, index) => (
              <div
                key={src}
                className="absolute inset-0"
                style={{
                  opacity: index === active ? 1 : 0,
                  zIndex: index === active ? 1 : 0,
                  transition: "opacity 1.1s ease",
                }}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover"
                  style={{
                    transform: index === active ? "scale(1.06)" : "scale(1)",
                    transition: "transform 1.1s ease",
                  }}
                />
              </div>
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgb(10_10_10/0.84)_0%,rgb(10_10_10/0.42)_46%,rgb(10_10_10/0.9)_100%)] gate:hidden"
            aria-hidden
          />
          <div className={`relative z-[2] flex h-full flex-col pt-28 pb-9 gate:block gate:h-auto gate:pt-26 gate:pb-18 ${sectionContainer}`}>
            <SectionHeading
              id="week-heading"
              tone="dark"
              eyebrow="How a search runs"
              title="The week"
              lede="Monday we take the brief. Friday the offer is on its way, with the desk still on the thread."
            />
            <div className="mt-auto pt-5 gate:mt-11 gate:pt-0">
              <div className="relative">
                <div className="pointer-events-none absolute top-0 right-0 left-0 h-0.5 bg-[rgb(243_1_0/0.28)] gate:hidden" aria-hidden />
                <div className="absolute top-0 right-0 left-0 z-[1] h-0.5 origin-left bg-brand [transform:scaleX(var(--u))] gate:hidden" aria-hidden />
                <ol className="m-0 grid list-none grid-cols-5 gap-[1.15rem] p-0 gate:flex gate:ml-[0.35rem] gate:flex-col gate:gap-7 gate:border-l gate:border-[#f30100] gate:pl-[1.35rem]">
                  {week.map((step, index) => (
                    <li
                      key={step.id}
                      className="relative flex min-w-0 flex-col pt-[3.15rem] [--start:calc(var(--i)/5)] [--reveal:clamp(0,(var(--u)_-_var(--start))/0.16,1)] before:absolute before:top-0 before:left-2 before:h-[2.7rem] before:w-0.5 before:bg-[rgb(244_240_232/0.32)] before:content-[''] before:[opacity:var(--reveal)] gate:pt-0 gate:before:hidden"
                      style={{ "--i": index } as CSSProperties}
                    >
                      <span
                        className="absolute -top-[7px] left-0 z-[2] size-[18px] rounded-full border-2 border-[rgb(244_240_232/0.35)] bg-[#0a0a0a] after:absolute after:top-[3px] after:left-[3px] after:size-2 after:rounded-full after:bg-brand after:content-[''] after:[transform:scale(var(--reveal))] gate:top-[0.35rem] gate:left-[calc(-1.35rem_-_9px)] gate:border-brand gate:after:[transform:scale(1)]"
                        aria-hidden
                      />
                      <article className="flex-1 rounded-b-lg border border-cloud/12 border-t-[3px] border-t-brand bg-ink/66 px-[0.85rem] pt-4 pb-[1.1rem] backdrop-blur-[14px] [opacity:var(--reveal)] [transform:translateY(calc((1_-_var(--reveal))*-22px))] gate:border-t-0 gate:bg-transparent gate:p-0 gate:backdrop-blur-none gate:opacity-100 gate:[transform:none]">
                        <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">
                          {step.day}
                        </p>
                        <h3 className="mt-2 font-display text-2xl leading-tight text-cloud">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-cloud/85">{step.copy}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <p
              className="absolute top-[6.75rem] right-0 z-[3] m-0 rounded-md border-2 border-brand px-[1.1rem] py-[0.45rem] font-display text-[clamp(1.75rem,3vw,2.6rem)] tracking-[0.08em] whitespace-nowrap text-brand uppercase opacity-0 pointer-events-none leading-none origin-center [transform:rotate(-16deg)_scale(0.86)] [transition:opacity_0.45s_ease,transform_0.5s_cubic-bezier(0.22,1,0.36,1)] group-data-[stamped=true]/stage:opacity-100 group-data-[stamped=true]/stage:[transform:rotate(-12deg)_scale(1)] gate:static gate:mt-10 gate:inline-block gate:opacity-100 gate:[transform:none] gate:[transition:none] gate:group-data-[stamped=true]/stage:[transform:none]"
              aria-hidden="true"
            >
              {stamp}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
