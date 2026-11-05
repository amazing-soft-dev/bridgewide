"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { platforms } from "@/content/ai-training";
import { usePrefersReducedMotion } from "@/lib/motion";

function initials(name: string) {
  const parts = name.replace(/\./g, "").split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

function LogoCard({ name, href }: { name: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-3 rounded-lg border border-cloud-soft bg-cloud px-3 py-2.5 text-ink no-underline shadow-[0_10px_30px_rgb(17_17_17/0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgb(17_17_17/0.12)]"
    >
      <span className="grid size-10 place-items-center rounded-md bg-ink font-mono text-xs tracking-wide text-cloud">
        {initials(name)}
      </span>
      <span className="font-display text-base whitespace-nowrap">{name}</span>
    </Link>
  );
}

function Row({
  children,
  reverse,
}: {
  children: ReactNode;
  reverse?: boolean;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <div className="flex flex-wrap justify-center gap-3 px-4">{children}</div>;
  }

  return (
    <div className="group/row overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div
        data-motion="marquee"
        className="flex w-max gap-3.5 pr-3.5 [animation:platform-run_42s_linear_infinite] group-hover/row:[animation-play-state:paused]"
        style={{ animationDirection: reverse ? "reverse" : "normal" }}
      >
        <div className="flex shrink-0 items-center gap-3.5 pr-3.5">{children}</div>
        <div className="flex shrink-0 items-center gap-3.5 pr-3.5" aria-hidden inert>
          {children}
        </div>
      </div>
    </div>
  );
}

export function PlatformTape() {
  const midpoint = Math.ceil(platforms.length / 2);
  const rows = [platforms.slice(0, midpoint), platforms.slice(midpoint)];

  return (
    <div className="relative left-1/2 grid w-screen -translate-x-1/2 gap-3.5">
      {rows.map((row, index) => (
        <Row key={index} reverse={index === 1}>
          {row.map((platform) => (
            <LogoCard
              key={platform.slug}
              name={platform.name}
              href={`/ai-training/platforms/${platform.slug}`}
            />
          ))}
        </Row>
      ))}
    </div>
  );
}
