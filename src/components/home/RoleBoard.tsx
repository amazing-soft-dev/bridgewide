"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Marquee } from "@/components/ui/Marquee";
import { usePrefersReducedMotion } from "@/lib/motion";
import { getRegion, placements, roles, type Role } from "@/content/site";

const VISIBLE = 6;
const SWAP_MS = 1500;
const FLIP_MS = 130;
const FADE_MS = 280;

function formatSfTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function FlapTitle({ title }: { title: string }) {
  const characters = title.toUpperCase().split("");
  const trackRef = useRef<HTMLSpanElement>(null);
  const [flipping, setFlipping] = useState(false);
  const [scale, setScale] = useState(1);
  const previous = useRef(title);

  useEffect(() => {
    if (previous.current === title) return;
    previous.current = title;
    setFlipping(true);
    const id = window.setTimeout(() => setFlipping(false), FLIP_MS);
    return () => window.clearTimeout(id);
  }, [title]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const box = track?.closest(".hero-title-slot");
    if (!track || !(box instanceof HTMLElement)) return;

    const fit = () => {
      const available = box.clientWidth;
      const needed = track.scrollWidth;
      const next = available > 0 && needed > available ? available / needed : 1;
      setScale((current) => (Math.abs(current - next) < 0.01 ? current : next));
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(box);
    return () => observer.disconnect();
  }, [title]);

  return (
    <span ref={trackRef} className="hero-flap-track" style={{ scale }}>
      {characters.map((character, index) => (
        <span key={index} data-motion="flap" className={`hero-flap${flipping ? " is-flip" : ""}`}>
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </span>
  );
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
  const [shown, setShown] = useState(role);
  const [phase, setPhase] = useState<"idle" | "out">("idle");
  const code = getRegion(shown.region)?.code ?? "";

  useEffect(() => {
    if (role.slug === shown.slug) return;
    if (reduced) {
      setShown(role);
      return;
    }
    setPhase("out");
    const id = window.setTimeout(() => {
      setShown(role);
      setPhase("idle");
    }, FADE_MS);
    return () => window.clearTimeout(id);
  }, [reduced, role, shown.slug]);

  return (
    <li
      data-motion="enter"
      className="hero-row"
      style={{ animationDelay: `${0.5 + index * 0.09}s` }}
      onPointerEnter={(event) => {
        if (event.pointerType === "touch") return;
        onHover(index);
      }}
      onPointerLeave={() => onHover(null)}
    >
      <Link
        href={`/roles/${shown.slug}`}
        className="group relative flex h-12 items-center gap-2 border-t border-cloud/10 px-3 text-cloud no-underline hover:bg-cloud/5 focus-visible:bg-cloud/5"
      >
        <span
          aria-hidden
          className="absolute inset-y-1 left-0 w-0.5 bg-brand opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="w-10 shrink-0 font-mono text-[10px] tracking-[0.14em] text-cloud/70">
          {code}
        </span>
        <span className="hero-title-slot relative flex h-4 min-w-0 flex-1 items-center overflow-hidden">
          <span
            data-motion="swap"
            className={`min-w-0 transition-opacity duration-300 ${phase === "out" ? "opacity-0" : "opacity-100"}`}
          >
            <FlapTitle title={shown.title} />
          </span>
          <span aria-hidden className={`hero-row-bar${phase === "out" ? " is-on" : ""}`} />
        </span>
        <span
          data-motion="swap"
          className={`w-[6.5rem] shrink-0 truncate font-mono text-[11px] text-cloud/75 transition-opacity duration-300 ${phase === "out" ? "opacity-0" : "opacity-100"}`}
        >
          {shown.city}
        </span>
        <span
          data-motion="swap"
          className={`w-[7.25rem] shrink-0 text-right font-mono text-[11px] text-cloud transition-opacity duration-300 ${phase === "out" ? "opacity-0" : "opacity-100"}`}
        >
          {shown.salary}
        </span>
        {shown.tags?.[0] ? (
          <span
            data-motion="swap"
            className={`shrink-0 bg-brand px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-white transition-opacity duration-300 ${phase === "out" ? "opacity-0" : "opacity-100"}`}
          >
            {shown.tags[0]}
          </span>
        ) : (
          <span className="w-8 shrink-0" />
        )}
        <span
          aria-hidden
          className="w-4 shrink-0 text-cloud opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
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

  const ticker = reduced ? placements.slice(0, 1) : placements;

  return (
    <div className="bg-[#14161c]/74 text-cloud shadow-2xl backdrop-blur-[18px] lg:mt-8">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-brand" />
          Open roles
          <span className="bg-brand px-1.5 py-0.5 text-[10px] text-white">{roles.length}</span>
        </p>
        <p className="font-mono text-[11px] tracking-[0.14em] text-cloud/80 uppercase">
          <span aria-hidden className="mr-2 inline-block size-1.5 rounded-full bg-brand" />
          Live SF {clock ?? "--:--:--"}
        </p>
      </div>
      <ul>
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
      <div className="flex min-w-0 items-center gap-3 border-t border-cloud/10 px-3 py-2">
        <p className="shrink-0 font-mono text-[10px] tracking-[0.16em] text-cloud/70 uppercase">
          Just placed
        </p>
        <Marquee>
          {ticker.map((placement) => (
            <p
              key={`${placement.company}-${placement.title}`}
              className="font-mono text-[11px] whitespace-nowrap text-cloud/85"
            >
              {placement.title} → {placement.company} · placed in {placement.days} days
            </p>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
