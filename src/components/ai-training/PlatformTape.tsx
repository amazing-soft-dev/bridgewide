"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { platforms } from "@/content/ai-training";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import "./platform-tape.css";

function LogoCard({ name, href, logo }: { name: string; href: string; logo: string }) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-3 rounded-md border border-cloud/15 bg-ink/55 px-3 py-2.5 text-cloud no-underline backdrop-blur-md transition-[translate,border-color,background-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 hover:border-brand/70 hover:bg-ink/80 focus-visible:border-brand/70 focus-visible:bg-ink/80"
    >
      <span className="grid size-10 place-items-center overflow-hidden rounded-[5px] bg-cloud [clip-path:polygon(0_0,calc(100%_-_8px)_0,100%_8px,100%_100%,0_100%)]">
        {/* Brand marks are SVG or small PNG. next/image does not accept SVG without extra config. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt="" width={28} height={28} className="size-7 object-contain" />
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
              logo={platform.logo}
              href={`/ai-training/platforms/${platform.slug}`}
            />
          ))}
        </Row>
      ))}
    </div>
  );
}
