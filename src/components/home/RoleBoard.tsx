"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { formatCompactSalary } from "@/components/pages/format";
import { usePrefersReducedMotion } from "@/lib/motion";
import { placements, roles, type Role } from "@/content/site";

const VISIBLE = 6;
const SWAP_MS = 2000;
const FEED_MS = 4000;
const FLIP_MS = 300;
const TILES = 20;
/** Each tile starts its flip this much after the previous one, so the title flows across the row. */
const TILE_STEP_MS = 45;

function formatSfTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function toTiles(title: string) {
  return title.slice(0, TILES).toUpperCase().padEnd(TILES, " ");
}

/** Country name only. US roles show the state instead, for example "Texas, USA". */
function locationLabel(role: Role) {
  if (role.countryCode === "USA" && role.state) return `${role.state}, USA`;
  return role.country;
}

/**
 * Split-flap title. Always TILES tiles, padded with blanks, so every card keeps the same width.
 * Tiles flip one after another; each tile's character changes at the midpoint of its own flip.
 */
function FlapTitle({ title, reduced }: { title: string; reduced: boolean }) {
  const nextKey = toTiles(title);
  const [displayed, setDisplayed] = useState(nextKey);
  const [run, setRun] = useState(0);
  const [lastKey, setLastKey] = useState(nextKey);

  // A changed title starts a new run. Setting state while rendering is React's pattern for resetting on a prop change.
  if (nextKey !== lastKey) {
    setLastKey(nextKey);
    if (reduced) setDisplayed(nextKey);
    else setRun((value) => value + 1);
  }

  useEffect(() => {
    if (run === 0 || reduced) return;
    const timers = nextKey.split("").map((_, index) =>
      window.setTimeout(() => {
        setDisplayed(
          (previous) => previous.slice(0, index) + nextKey[index] + previous.slice(index + 1),
        );
      }, index * TILE_STEP_MS + FLIP_MS / 2),
    );
    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [run, nextKey, reduced]);

  return (
    <span
      aria-hidden
      className="flex w-max flex-none flex-nowrap gap-[1.5px] font-mono text-[12px] leading-none font-medium tracking-[0.02em] text-cloud"
    >
      {displayed.split("").map((character, index) => (
        <span
          key={`${index}-${run}`}
          data-motion="flap"
          style={run > 0 ? { animationDelay: `${index * TILE_STEP_MS}ms` } : undefined}
          className={`relative inline-grid h-[1.8em] w-[0.7em] flex-none place-items-center rounded-[2px] after:absolute after:inset-x-0 after:top-1/2 after:h-px after:bg-[#080c1c]/70 after:content-[''] ${
            character === " " ? "bg-white/3" : "bg-white/9"
          } ${run > 0 ? "motion-safe:animate-sth-flip" : ""}`}
        >
          {character}
        </span>
      ))}
    </span>
  );
}

const cell = "min-w-0 truncate font-mono text-[12px] motion-safe:animate-sth-swap";

function statusClass(status: string) {
  return `block w-[112px] shrink-0 truncate rounded-[3px] px-1.5 py-[5px] text-center font-mono text-[12px] tracking-[0.04em] uppercase motion-safe:animate-sth-swap ${
    status === "New" ? "bg-brand text-white" : "bg-white/10 text-cloud/80"
  }`;
}

function RoleRow({
  role,
  index,
  reduced,
  onHover,
}: {
  role: Role;
  index: number;
  reduced: boolean;
  onHover: (row: number | null) => void;
}) {
  const status = role.tags?.[0];

  return (
    <li
      data-motion="enter"
      className="motion-safe:animate-hero-row-in"
      style={{ animationDelay: `${0.5 + index * 0.09}s` }}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        onHover(index);
      }}
      onPointerLeave={() => onHover(null)}
    >
      <Link
        href={`/roles/${role.slug}`}
        className={`group relative grid min-h-[50px] grid-cols-[38px_minmax(0,1fr)_18px] items-center gap-x-2 gap-y-1.5 overflow-hidden rounded-md bg-white/4 py-2.5 pr-3 pl-3.5 text-cloud no-underline transition-[background-color,translate] duration-500 ease-[cubic-bezier(0.2,0.9,0.2,1)] hover:translate-x-1 hover:bg-white/9 focus-visible:bg-white/9 @[600px]:h-[50px] @[600px]:grid-cols-[38px_minmax(0,1fr)_112px_62px_112px_18px] @[600px]:gap-y-0 @[600px]:py-0`}
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-0 bg-brand transition-transform duration-[450ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
        />

        <span className="w-[38px] rounded-[3px] border border-[color-mix(in_srgb,var(--color-brand)_45%,transparent)] py-[5px] text-center font-mono text-[12px] tracking-[0.12em] text-[color-mix(in_srgb,var(--color-brand)_40%,white)]">
          {role.boardCode}
        </span>

        <span className="relative flex min-w-0 overflow-hidden">
          <FlapTitle title={role.boardTitle} reduced={reduced} />
        </span>

        {/* Below the one-line width this wrapper stays a flex row on the second line. Above it, its children sit in the row grid. */}
        <span
          className={`col-span-2 col-start-2 row-start-2 flex min-w-0 items-center gap-2 @[600px]:contents`}
        >
          <span
            key={`location-${role.slug}`}
            className={`${cell} flex-1 text-cloud/80 @[600px]:w-[112px] @[600px]:flex-none`}
          >
            {locationLabel(role)}
          </span>
          <span
            key={`pay-${role.slug}`}
            className={`${cell} shrink-0 text-cloud tabular-nums @[600px]:w-[62px]`}
          >
            {formatCompactSalary(role.salaryMin, role.salaryUnit)}
          </span>
          {status ? (
            <span key={`status-${role.slug}`} className={statusClass(status)}>
              {status}
            </span>
          ) : (
            <span className="block w-[112px] shrink-0" />
          )}
        </span>

        <span
          aria-hidden
          className={`col-start-3 row-start-1 w-[18px] -translate-x-2 text-cloud opacity-0 transition-[opacity,translate] duration-[450ms] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 @[600px]:col-start-auto @[600px]:row-start-auto`}
        >
          →
        </span>
      </Link>
    </li>
  );
}

export function RoleBoard() {
  const reduced = usePrefersReducedMotion();
  const hoveredRef = useRef<number | null>(null);
  const [slots, setSlots] = useState(() => roles.slice(0, VISIBLE).map((_, index) => index));
  const [clock, setClock] = useState<string | null>(null);
  const [feedIndex, setFeedIndex] = useState(0);

  const onHover = (row: number | null) => {
    hoveredRef.current = row;
  };

  useEffect(() => {
    const tick = () => setClock(formatSfTime(new Date()));
    tick();
    if (reduced) return;
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    let step = 0;
    const id = window.setInterval(() => {
      const row = step;
      step = (step + 1) % VISIBLE;
      if (hoveredRef.current === row) return;
      setSlots((prev) => {
        const next = prev.slice();
        next[row] = (prev[row] + VISIBLE) % roles.length;
        return next;
      });
    }, SWAP_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  // One placement at a time, swapped in place (matches the reference footer).
  useEffect(() => {
    if (reduced || placements.length < 2) return;
    const id = window.setInterval(
      () => setFeedIndex((index) => (index + 1) % placements.length),
      FEED_MS,
    );
    return () => window.clearInterval(id);
  }, [reduced]);

  const placement = placements[feedIndex];

  return (
    <div className="@container relative rounded-xl border border-white/12 bg-[#080c1c]/74 p-1.5 text-cloud shadow-[0_40px_100px_rgba(8,12,28,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-[18px] [clip-path:polygon(0_0,calc(100%_-_26px)_0,100%_26px,100%_100%,0_100%)] motion-safe:animate-sth-board-in lg:mt-8 [&_*]:box-border [&_*]:min-w-0">
      <div className="flex items-center justify-between gap-3 px-3.5 pt-3 pb-2.5">
        <p className="flex items-center gap-2.5 font-mono text-[12px] tracking-[0.16em] text-cloud/80 uppercase">
          <span
            aria-hidden
            className="relative size-[7px] rounded-full bg-brand shadow-[0_0_12px_var(--color-brand)] after:absolute after:-inset-[5px] after:rounded-full after:border after:border-brand after:opacity-0 after:content-[''] motion-safe:after:animate-sth-pulse"
          />
          Open roles
          <span className="rounded-[3px] bg-brand px-[7px] py-[3px] tracking-[0.06em] text-white">
            {roles.length}
          </span>
        </p>
        <p className="flex items-center gap-3 font-mono text-[12px] tracking-[0.12em] text-cloud/80 uppercase tabular-nums">
          <span className="relative pl-3 text-[color-mix(in_srgb,var(--color-brand)_40%,white)] before:absolute before:top-1/2 before:left-0 before:size-1.5 before:-translate-y-1/2 before:rounded-full before:bg-brand before:content-[''] motion-safe:before:animate-sth-blink">
            Live
          </span>
          SF {clock ?? "--:--:--"}
        </p>
      </div>

      <ul className="flex flex-col gap-[3px]">
        {slots.map((roleIndex, row) => (
          <RoleRow
            key={row}
            role={roles[roleIndex]}
            index={row}
            reduced={reduced}
            onHover={onHover}
          />
        ))}
      </ul>

      {placement ? (
        <div className="flex items-start gap-3 overflow-hidden border-t border-white/8 px-3.5 pt-3 pb-2.5">
          <span className="shrink-0 rounded-[3px] bg-white/10 px-[7px] py-[3px] font-mono text-[12px] tracking-[0.14em] text-cloud uppercase">
            Just placed
          </span>
          <p
            key={feedIndex}
            className="min-w-0 font-mono text-[12px] text-cloud/85 motion-safe:animate-sth-swap"
          >
            {placement.title} → {placement.company} · placed in {placement.days} days
          </p>
        </div>
      ) : null}
    </div>
  );
}
