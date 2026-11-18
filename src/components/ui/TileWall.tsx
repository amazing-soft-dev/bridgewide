"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { ChipLabel } from "@/components/ui/EyebrowChip";
import { SplitWords } from "@/components/ui/SplitWords";
import { ramp, requestScrollFrame } from "@/hooks/scroll-frame";
import { useInView } from "@/hooks/use-in-view";
import { useTrackProgress } from "@/hooks/use-track-progress";

const COLS = 16;
const ROWS = 9;

/** Per-frame smoothing of the track progress, as on the reference. */
const LERP = 0.18;
/** Progress past which the copy and cards open. Below it on the way back up they close again. */
const OPEN_AT = 0.5;

function buildTiles(phrase: string, phraseRow: number, phraseCol: number) {
  return Array.from({ length: ROWS * COLS }, (_, index) => {
    const row = Math.floor(index / COLS);
    const col = index % COLS;
    const offset = col - phraseCol;
    const letter = row === phraseRow && offset >= 0 && offset < phrase.length ? phrase[offset] : "";
    return {
      // Diagonal index, 0 at the top-left tile and 1 at the bottom-right one.
      t: (row + col) / (ROWS + COLS - 2),
      letter: letter === " " ? "" : letter,
      marked: letter !== "" && letter !== " ",
    };
  });
}

/** Fade and rise, played once `on` is true and reversed when it is false again. */
function rise(on: boolean, delay: number, distance = 22): CSSProperties {
  return {
    opacity: on ? 1 : 0,
    translate: on ? "0 0" : `0 ${distance}px`,
    transition: `opacity 0.9s ease ${delay}ms, translate 1s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
  };
}

/**
 * A pinned stage behind a wall of letter tiles. The tiles spell a phrase,
 * then flip away one diagonal at a time as the visitor scrolls, uncovering
 * the photo, the heading, and a row of person cards. The copy and the cards
 * open once the wall is mostly gone. On narrow viewports and under reduced
 * motion the wall is skipped and the cards lay out flat.
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
  cardClassName = "",
  clearance,
  cards,
}: {
  id?: string;
  headingId: string;
  eyebrow: string;
  title: string;
  /** Brand block behind the title's last word. */
  accent?: boolean;
  lede: string;
  cta?: { href: string; label: string };
  /** Upper-case words the tiles spell, up to 14 characters. */
  phrase: string;
  phraseRow?: number;
  /** Column the phrase starts in. Centred when left out. */
  phraseCol?: number;
  image: string;
  imagePosition?: string;
  trackHeight?: string;
  /** Cards per row on wide viewports. */
  columns: number;
  /** Extra classes on every card's <li>. */
  cardClassName?: string;
  /** "bottom" leaves room for the next section's seam. */
  clearance?: "bottom";
  /** The person cards. Each is wrapped in an <li> that reveals in turn. */
  cards: { id: string; node: ReactNode }[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const smooth = useRef(-1);
  const [open, setOpen] = useState(false);

  const word = phrase.toUpperCase().slice(0, 14);
  const startCol = phraseCol ?? Math.max(0, Math.floor((COLS - word.length) / 2));
  const tiles = buildTiles(word, phraseRow, startCol);

  const gated = useTrackProgress(
    trackRef,
    (progress) => () => {
      const stage = stageRef.current;
      if (!stage) return;
      const last = smooth.current;
      let next = last < 0 ? progress : last + (progress - last) * LERP;
      if (Math.abs(progress - next) < 0.0005) next = progress;
      smooth.current = next;
      const u = ramp(next, 0.02, 0.6);
      stage.style.setProperty("--u", u.toFixed(4));
      stage.style.setProperty("--w", ramp(u, 0.04, 0.9).toFixed(4));
      setOpen(next > OPEN_AT);
      // Keep stepping until the smoothed value has caught up with the scroll position.
      if (next !== progress) requestScrollFrame();
    },
    () => {
      stageRef.current?.style.setProperty("--u", "1");
      stageRef.current?.style.setProperty("--w", "1");
    },
  );

  // Under the gate there is no wall to wait for: open once the section is on screen.
  const inView = useInView(sectionRef, { threshold: 0.05, rootMargin: "0px 0px -6% 0px", once: true });
  const shown = gated ? inView : open;

  // Keyboard focus lands behind the wall otherwise: jump the track to where the cards are uncovered.
  function uncoverOnFocus() {
    const track = trackRef.current;
    if (gated || !track) return;
    const rect = track.getBoundingClientRect();
    const viewport = window.innerHeight;
    if (rect.height <= viewport * 1.05) return;
    const target = rect.top + window.scrollY + (rect.height - viewport) * 0.9;
    if (Math.abs(window.scrollY - target) < 8) return;
    window.scrollTo({ top: target, behavior: "instant" });
  }

  const padBottom =
    clearance === "bottom"
      ? "pb-[calc(var(--seam)_+_clamp(1.75rem,4vh,3rem))] max-[899px]:pb-[calc(var(--seam)_+_3.5rem)]"
      : "pb-[clamp(1.75rem,4vh,3rem)] max-[899px]:pb-14";

  return (
    <section
      ref={sectionRef}
      id={id}
      data-header-tone="dark"
      className="relative z-10 scroll-mt-24 bg-[#0a0a0a] text-cloud"
      aria-labelledby={headingId}
      onFocusCapture={uncoverOnFocus}
    >
      <div ref={trackRef} className={`${trackHeight} gate:h-auto`}>
        <div
          ref={stageRef}
          className="sticky top-0 h-svh overflow-hidden bg-[#0a0a0a] gate:relative gate:h-auto gate:overflow-visible"
          style={{ "--u": 0, "--w": 0 } as CSSProperties}
        >
          <div
            className="absolute inset-0 [&_img]:scale-[calc(1.14_-_var(--u)*0.14)] gate:[&_img]:scale-none"
            aria-hidden
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              className="object-cover [filter:saturate(0.75)_brightness(0.7)]"
              style={{ objectPosition: imagePosition }}
            />
          </div>
          <div
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_10_10/0.7),rgb(10_10_10/0.3)_40%,rgb(10_10_10/0.92))]"
            aria-hidden
          />
          <div
            className={`wrap relative z-[2] grid h-full grid-rows-[1fr_auto] gap-y-6 pt-[clamp(4.5rem,10vh,6.875rem)] ${padBottom} gate:block gate:h-auto gate:pt-[6.5rem]`}
          >
            <div className="grid max-w-[45rem] content-start gap-5 max-[899px]:mb-9">
              <p className="m-0 w-max max-w-full" style={rise(shown, 0, 12)} data-motion="reveal">
                <ChipLabel tone="dark">{eyebrow}</ChipLabel>
              </p>
              <h2
                id={headingId}
                className="m-0 font-display text-[clamp(34px,4.3vw,64px)] leading-[1.02] tracking-[-0.04em] text-balance text-cloud"
              >
                <SplitWords text={title} shown={shown} masked accent={accent} accentTone="dark" delay={0.08} />
              </h2>
              <p
                className="m-0 max-w-[32.5rem] text-[16.5px] leading-[1.6] text-cloud/80"
                style={rise(shown, 320)}
                data-motion="reveal"
              >
                {lede}
              </p>
              {cta ? (
                <div style={rise(shown, 440)} data-motion="reveal">
                  <Button href={cta.href} variant="onDark">
                    {cta.label}
                  </Button>
                </div>
              ) : null}
            </div>
            <ul
              className="m-0 grid list-none grid-cols-[repeat(var(--cols),minmax(0,1fr))] gap-3 p-0 [perspective:900px] max-[1099px]:gap-2 [&>li]:flex max-[899px]:-mx-4 max-[899px]:flex max-[899px]:gap-2.5 max-[899px]:snap-x max-[899px]:snap-mandatory max-[899px]:overflow-x-auto max-[899px]:px-4 max-[899px]:pb-2 max-[899px]:[scrollbar-width:none] max-[899px]:[&>li]:snap-start max-[899px]:[&>li]:[flex:0_0_58vw] max-[699px]:mx-0 max-[699px]:grid max-[699px]:grid-cols-2 max-[699px]:gap-2.5 max-[699px]:overflow-visible max-[699px]:px-0 max-[699px]:[&>li]:flex-none"
              style={{ "--cols": columns } as CSSProperties}
            >
              {cards.map((card, index) => (
                <li
                  key={card.id}
                  className={cardClassName}
                  style={rise(shown, 500 + index * 100, 30)}
                  data-motion="reveal"
                >
                  {card.node}
                </li>
              ))}
            </ul>
          </div>
          <div
            // The dark backing fades with the wave, so the 3px gaps stay dark until the tiles around them have flipped.
            className="pointer-events-none absolute inset-0 z-[4] grid grid-cols-[repeat(16,1fr)] grid-rows-[repeat(9,1fr)] gap-[3px] p-[3px] [perspective:1400px] [transform-style:preserve-3d] before:absolute before:inset-0 before:-z-1 before:bg-[#0a0a0a] before:[opacity:calc(1_-_var(--w))] before:content-[''] gate:hidden"
            aria-hidden
          >
            {tiles.map((tile, index) => (
              <span
                key={index}
                className={`relative grid origin-[50%_0] place-items-center rounded-[3px] font-mono text-[clamp(20px,3.2vw,46px)] font-normal text-cloud [backface-visibility:hidden] [--f:clamp(0,(var(--u)_-_var(--t)*0.78)/0.16,1)] [opacity:clamp(0,calc((1_-_var(--f))*8),1)] [transform:rotateX(calc(var(--f)*-92deg))] after:absolute after:top-1/2 after:right-0 after:left-0 after:h-px after:bg-[rgb(10_10_10/0.8)] after:content-[''] ${
                  tile.marked ? "bg-brand" : "bg-[#0c1017]"
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
