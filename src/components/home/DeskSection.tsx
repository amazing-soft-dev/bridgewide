"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type CSSProperties, type PointerEvent } from "react";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { images, people, sampleFiguresNote } from "@/content/site";

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
    <section className="relative z-10 text-cloud" aria-labelledby="desk-heading">
      <div ref={trackRef} className="desk-track">
        <div ref={stageRef} className="desk-stage" style={{ "--u": 0 } as CSSProperties}>
          <div className="desk-bg" aria-hidden>
            <Image
              src={images.desk}
              alt=""
              fill
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
          </div>
          <div className="desk-veil" aria-hidden />
          <div className={`desk-in ${sectionContainer}`}>
            <div className="max-w-xl">
              <SectionHeading
                id="desk-heading"
                tone="dark"
                eyebrow="The desk"
                title="Recruiters who did the job first."
                lede="Former engineers and managers. Each consultant keeps a region or a discipline, and stays on the search until someone starts."
              />
              <Link
                href="/about"
                className="mt-6 inline-flex items-center gap-3 border border-cloud/40 bg-cloud/10 px-4 py-3 text-sm font-semibold text-cloud no-underline backdrop-blur-md"
              >
                Meet the team
                <span aria-hidden className="grid size-8 place-items-center bg-cloud text-ink">
                  →
                </span>
              </Link>
            </div>
            <ul className="desk-team">
              {people.map((person) => (
                <li key={person.id}>
                  <Link
                    href={`/about#${person.id}`}
                    className="desk-card"
                    onPointerMove={tilt}
                    onPointerLeave={(event) => {
                      event.currentTarget.style.setProperty("--rx", "0deg");
                      event.currentTarget.style.setProperty("--ry", "0deg");
                    }}
                  >
                    <span className="desk-photo">
                      <Image
                        src={person.image}
                        alt={person.name}
                        width={640}
                        height={704}
                        sizes="(max-width: 899px) 68vw, 18vw"
                        className="!h-full !w-full object-cover"
                      />
                    </span>
                    <span className="grid flex-1 content-start gap-0.5 border-t border-dashed border-stone/50 px-3 py-3">
                      <b className="font-display text-[15px] tracking-tight">{person.name}</b>
                      <span className="text-[11.5px] text-ink-soft">{person.role}</span>
                      <em className="mt-1 font-mono text-[9px] tracking-[0.12em] text-brand not-italic uppercase">
                        {person.focus}
                      </em>
                    </span>
                    <span className="desk-stamp font-mono">
                      {sampleFiguresNote}: {person.placementCount}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="desk-wall" aria-hidden>
            {tiles.map((tile, index) => (
              <span
                key={index}
                className={`desk-tile${tile.letter && !tile.space ? " has-ch" : ""}${tile.space ? " is-sp" : ""}`}
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
