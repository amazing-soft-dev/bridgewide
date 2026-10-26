"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { images, people } from "@/content/site";

const COLS = 16;
const ROWS = 9;
const PHRASE = "MEET THE DESK";
const PHRASE_ROW = 4;
const PHRASE_COL = 1;

const tiles = Array.from({ length: ROWS * COLS }, (_, index) => {
  const row = Math.floor(index / COLS);
  const col = index % COLS;
  const offset = col - PHRASE_COL;
  const letter =
    row === PHRASE_ROW && offset >= 0 && offset < PHRASE.length
      ? PHRASE[offset]
      : "";
  return {
    t: (row + col) / (ROWS + COLS - 2),
    letter,
    space: letter === " ",
  };
});

const motionGate = "(max-width: 899px), (prefers-reduced-motion: reduce)";

function tilt(event: PointerEvent<HTMLAnchorElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty("--ry", `${x * 8}deg`);
  event.currentTarget.style.setProperty("--rx", `${-y * 8}deg`);
}

export default function DeskSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

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
      const u = Math.min(1, Math.max(0, (pp - 0.02) / 0.6));
      stage.style.setProperty("--u", u.toFixed(4));
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
    <section data-header-tone="dark" className="relative z-10 text-cloud" aria-labelledby="desk-heading">
      <div ref={trackRef} className="h-[300vh] gate:h-auto">
        <div
          ref={stageRef}
          className="sticky top-0 h-[100vh] overflow-hidden bg-[#0a0a0a] gate:relative gate:h-auto gate:overflow-visible"
          style={{ "--u": 0 } as CSSProperties}
        >
          <div className="absolute inset-0 [&_img]:scale-[calc(1.14_-_var(--u)*0.14)] gate:[&_img]:scale-none" aria-hidden>
            <Image
              src={images.desk}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_10/0.72),rgb(10_10_10/0.28)_42%,rgb(10_10_10/0.88))]"
            aria-hidden
          />
          <div
            className={`relative z-[2] grid h-full grid-rows-[1fr_auto] gap-y-6 pt-[clamp(4.5rem,10vh,6.5rem)] pb-[calc(var(--seam)_+_clamp(1.5rem,4vh,2.75rem))] gate:block gate:h-auto gate:pt-[6.5rem] gate:pb-[calc(var(--seam)_+_2.5rem)] ${sectionContainer}`}
          >
            <div className="max-w-xl">
              <SectionHeading
                id="desk-heading"
                tone="dark"
                eyebrow="The desk"
                title="Recruiters who did the job first."
                lede="Former engineers and managers. Each consultant keeps a region or a discipline, and stays on the search until someone starts."
              />
              <Button href="/about" variant="onDark" className="mt-6">
                Meet the team
              </Button>
            </div>
            <ul className="m-0 grid list-none grid-cols-5 gap-3 p-0 [perspective:900px] [&>li]:flex gate:flex gate:-mx-5 gate:snap-x gate:snap-mandatory gate:overflow-x-auto gate:px-5 gate:pt-8 gate:pb-2 gate:[&>li]:snap-start gate:[&>li]:[flex:0_0_min(68vw,17rem)]">
              {people.map((person) => (
                <li key={person.id}>
                  <Link
                    href={`/about#${person.id}`}
                    className="group/desk relative flex flex-1 flex-col overflow-hidden rounded-lg bg-cloud text-[#14120e] no-underline [clip-path:polygon(0_0,calc(100%_-_12px)_0,100%_12px,100%_100%,0_100%)] [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d] [transition:transform_0.35s_ease,box-shadow_0.4s_ease] hover:shadow-[0_30px_60px_rgb(0_0_0/0.4)]"
                    onPointerMove={tilt}
                    onPointerLeave={(event) => {
                      event.currentTarget.style.setProperty("--rx", "0deg");
                      event.currentTarget.style.setProperty("--ry", "0deg");
                    }}
                  >
                    <span className="block aspect-[4/4.4] overflow-hidden bg-[#d9d3c7] min-[900px]:motion-safe:max-h-[max(6rem,calc(100vh_-_36rem))]">
                      <Image
                        src={person.image}
                        alt={person.name}
                        width={640}
                        height={704}
                        sizes="(max-width: 899px) 68vw, 18vw"
                        className="!h-full !w-full object-cover [filter:saturate(0.6)] [transition:filter_0.6s_ease,scale_1s_cubic-bezier(0.2,0.8,0.2,1)] group-hover/desk:[filter:saturate(1)] group-hover/desk:scale-[1.05]"
                      />
                    </span>
                    <span className="grid flex-1 content-start gap-0.5 border-t border-dashed border-stone/50 px-3 py-3">
                      <b className="font-display text-[15px] tracking-tight">{person.name}</b>
                      <span className="text-[11.5px] text-ink-soft">{person.role}</span>
                      <em className="mt-1 font-mono text-[9px] tracking-[0.12em] text-brand not-italic uppercase">
                        {person.focus}
                      </em>
                    </span>
                    <span className="absolute top-2.5 right-2.5 rotate-6 rounded-[3px] bg-brand px-2 py-[5px] font-mono text-[9px] tracking-[0.14em] text-cloud uppercase opacity-0 [scale:1.4] [transition:opacity_0.3s_ease,scale_0.4s_cubic-bezier(0.2,1.5,0.3,1)] group-hover/desk:opacity-100 group-hover/desk:[scale:1]">
                      {person.placementCount} placements
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="pointer-events-none absolute inset-0 z-[4] grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(9,1fr)] gap-[3px] p-[3px] [perspective:1400px] gate:hidden" aria-hidden>
            {tiles.map((tile, index) => (
              <span
                key={index}
                className={`relative grid place-items-center rounded-[3px] font-mono text-[clamp(1.1rem,2.4vw,2.4rem)] font-semibold text-cloud origin-[50%_0] [backface-visibility:hidden] [--f:clamp(0,(var(--u)_-_var(--t)*0.78)/0.16,1)] [opacity:calc(1-var(--f))] [transform:rotateX(calc(var(--f)*-92deg))] after:absolute after:top-1/2 after:right-0 after:left-0 after:h-px after:bg-black/45 after:content-[''] ${
                  tile.letter && !tile.space ? "bg-brand" : "bg-[#14181f]"
                }`}
                style={{ "--t": tile.t.toFixed(3) } as CSSProperties}
              >
                {tile.space ? "" : tile.letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
