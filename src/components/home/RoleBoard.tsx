"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type CSSProperties } from "react";
import { Marquee } from "@/components/ui/Marquee";
import { usePrefersReducedMotion } from "@/lib/motion";
import { getRegion, placements, roles, type Role } from "@/content/site";

function formatSfTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Los_Angeles",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function useWideScreen() {
  return useSyncExternalStore(
    (onStoreChange) => {
      const query = window.matchMedia("(min-width: 1024px)");
      query.addEventListener("change", onStoreChange);
      return () => query.removeEventListener("change", onStoreChange);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

function FlapTitle({ title }: { title: string }) {
  return (
    <span className="flex min-w-0 flex-wrap gap-0.5">
      {title.toUpperCase().split("").map((character, index) => (
        <span
          key={`${character}-${index}`}
          className="inline-grid h-5 min-w-[0.7rem] place-items-center bg-cloud/10 px-0.5 font-mono text-[10px] leading-none tracking-wide text-cloud"
        >
          {character === " " ? "\u00a0" : character}
        </span>
      ))}
    </span>
  );
}

function RoleRow({ role, wide }: { role: Role; wide: boolean }) {
  const code = getRegion(role.region)?.code ?? "";
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);

  return (
    <li>
      <Link
        href={`/roles/${role.slug}`}
        className="group relative flex items-center gap-3 border-t border-cloud/10 px-3 py-2.5 text-cloud no-underline hover:bg-cloud/5 focus-visible:bg-cloud/5"
        onPointerMove={(event) => {
          if (!wide || event.pointerType === "touch") return;
          const rect = event.currentTarget.getBoundingClientRect();
          setPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
        }}
        onPointerLeave={() => setPoint(null)}
      >
        <span
          aria-hidden
          className="absolute inset-y-1 left-0 w-0.5 bg-brand opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        />
        <span className="w-10 shrink-0 font-mono text-[10px] tracking-[0.14em] text-cloud/70">
          {code}
        </span>
        <FlapTitle title={role.title} />
        <span className="ml-auto shrink-0 font-mono text-[11px] text-cloud/75">{role.city}</span>
        <span className="w-28 shrink-0 text-right font-mono text-[11px] text-cloud">{role.salary}</span>
        {role.tags?.[0] ? (
          <span className="shrink-0 bg-brand px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-white">
            {role.tags[0]}
          </span>
        ) : (
          <span className="w-10 shrink-0" />
        )}
        <span
          aria-hidden
          className="w-4 shrink-0 text-cloud opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          →
        </span>
        <span
          aria-hidden
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full bg-cloud px-2 py-1 font-mono text-[10px] tracking-[0.14em] text-ink opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={
            wide && point
              ? ({ left: point.x, top: point.y } satisfies CSSProperties)
              : { left: "50%", top: 0 }
          }
        >
          Apply
        </span>
      </Link>
    </li>
  );
}

export function RoleBoard() {
  const reduced = usePrefersReducedMotion();
  const wide = useWideScreen();
  const shown = roles.slice(0, 6);
  const [clock, setClock] = useState(() => formatSfTime(new Date()));

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setClock(formatSfTime(new Date())), 1000);
    return () => window.clearInterval(id);
  }, [reduced]);

  const ticker = reduced ? placements.slice(0, 1) : placements;

  return (
    <div className="bg-[#14161c]/90 text-cloud shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-3 py-3">
        <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase">
          <span aria-hidden className="size-1.5 rounded-full bg-brand" />
          Open roles
          <span className="bg-brand px-1.5 py-0.5 text-[10px] text-white">{roles.length}</span>
        </p>
        <p className="font-mono text-[11px] tracking-[0.14em] text-cloud/80 uppercase">
          <span aria-hidden className="mr-2 inline-block size-1.5 rounded-full bg-brand" />
          Live SF {clock}
        </p>
      </div>
      <ul>
        {shown.map((role) => (
          <RoleRow key={role.slug} role={role} wide={wide} />
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
