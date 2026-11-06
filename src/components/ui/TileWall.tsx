"use client";

import Image from "next/image";
import { useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ramp } from "@/hooks/scroll-frame";
import { useTrackProgress } from "@/hooks/use-track-progress";

const COLS = 16;
const ROWS = 9;

function buildTiles(phrase: string, phraseRow: number, phraseCol: number) {
  return Array.from({ length: ROWS * COLS }, (_, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    const offset = col - phraseCol;
    const letter = row === phraseRow && offset >= 0 && offset < phrase.length ? phrase[offset] : "";
    return {
      t: (row + col) / (ROWS + COLS - 2),
      letter: letter === " " ? "" : letter,
      marked: letter !== "" && letter !== " ",
    };
  });
}

/**
 * A pinned stage behind a wall of letter tiles. The tiles spell a phrase,
 * then flip away one diagonal at a time as the visitor scrolls, uncovering
 * the photo, the heading, and a row of person cards. On narrow viewports
 * and under reduced motion the wall is skipped and the cards scroll
 * sideways.
 */
export function TileWall({
  id,
  headingId,
  eyebrow,
  title,
  accent = false,
  lede,
  cta,
  phrase,
  phraseRow = 4,
  phraseCol,
  image,
  imagePosition = "center 35%",
  trackHeight = "h-[300vh]",
  columns,
  clearance,
  children,
}: {
  id?: string;
  headingId: string;
  eyebrow: string;
  title: string;
  /** Brand block behind the title's last word. */
  accent?: boolean;
  lede: string;
  cta?: { href: string; label: string };
  /** Upper-case words the tiles spell, up to 16 characters. */
  phrase: string;
  phraseRow?: number;
  /** Column the phrase starts in; centre it by hand so a space falls between words. */
  phraseCol: number;
  image: string;
  imagePosition?: string;
  trackHeight?: string;
  /** Cards per row on wide viewports. */
  columns: number;
  /** "bottom" leaves room for the next section's seam. */
  clearance?: "bottom";
  /** The person cards, one <li> each. */
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiles = buildTiles(phrase, phraseRow, phraseCol);

  useTrackProgress(
    trackRef,
    (progress) => {
      const u = ramp(progress, 0.02, 0.6);
      return () => stageRef.current?.style.setProperty("--u", u.toFixed(4));
    },
    () => stageRef.current?.style.setProperty("--u", "1"),
  );

  const padBottom =
    clearance === "bottom"
      ? "pb-[calc(var(--seam)_+_clamp(1.5rem,4vh,2.75rem))] gate:pb-[calc(var(--seam)_+_2.5rem)]"
      : "pb-[clamp(1.5rem,4vh,2.75rem)] gate:pb-16";

  return (
    <section
      id={id}
      data-header-tone="dark"
      className="relative z-10 scroll-mt-24 bg-[#0a0a0a] text-cloud"
      aria-labelledby={headingId}
    >
      <div ref={trackRef} className={`${trackHeight} gate:h-auto`}>
        <div
          ref={stageRef}
          className="sticky top-0 h-svh overflow-hidden bg-[#0a0a0a] gate:relative gate:h-auto gate:overflow-visible"
          style={{ "--u": 0 } as CSSProperties}
        >
          <div className="absolute inset-0 [&_img]:scale-[calc(1.14_-_var(--u)*0.14)] gate:[&_img]:scale-none" aria-hidden>
            <Image src={image} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: imagePosition }} />
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_10/0.72),rgb(10_10_10/0.28)_42%,rgb(10_10_10/0.88))]"
            aria-hidden
          />
          <div
            className={`wrap relative z-[2] grid h-full grid-rows-[1fr_auto] gap-y-6 pt-[clamp(4.5rem,10vh,6.5rem)] ${padBottom} gate:block gate:h-auto gate:pt-[6.5rem]`}
          >
            <div className="max-w-xl">
              <SectionHeading id={headingId} tone="dark" eyebrow={eyebrow} title={title} accent={accent} lede={lede} />
              {cta ? (
                <Button href={cta.href} variant="onDark" className="mt-6">
                  {cta.label}
                </Button>
              ) : null}
            </div>
            <ul
              className="m-0 grid list-none grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-3 p-0 [perspective:900px] [&>li]:flex gate:flex gate:-mx-4 gate:snap-x gate:snap-mandatory gate:overflow-x-auto gate:px-4 gate:pt-8 gate:pb-2 gate:[&>li]:snap-start gate:[&>li]:[flex:0_0_min(68vw,17rem)]"
              style={{ "--cols": columns } as CSSProperties}
            >
              {children}
            </ul>
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[4] grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(9,1fr)] gap-[3px] p-[3px] [perspective:1400px] gate:hidden"
            aria-hidden
          >
            {tiles.map((tile, index) => (
              <span
                key={index}
                className={`relative grid origin-[50%_0] place-items-center rounded-[3px] font-mono text-[clamp(1.1rem,2.4vw,2.4rem)] font-semibold text-cloud [backface-visibility:hidden] [--f:clamp(0,(var(--u)_-_var(--t)*0.78)/0.16,1)] [opacity:clamp(0,calc((1_-_var(--f))*8),1)] [transform:rotateX(calc(var(--f)*-92deg))] after:absolute after:top-1/2 after:right-0 after:left-0 after:h-px after:bg-black/45 after:content-[''] ${
                  tile.marked ? "bg-brand" : "bg-[#14181f]"
                }`}
                style={{ "--t": tile.t.toFixed(3) } as CSSProperties}
              >
                {tile.letter}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
