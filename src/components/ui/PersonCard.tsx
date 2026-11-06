"use client";

import Image from "next/image";
import Link from "next/link";
import type { PointerEvent } from "react";

const shell =
  "group/card corner-cut relative flex flex-1 flex-col overflow-hidden rounded-lg bg-cloud text-ink no-underline [transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d] [transition:transform_0.35s_ease,box-shadow_0.4s_ease] hover:shadow-[0_30px_60px_rgb(0_0_0/0.4)]";

function tilt(event: PointerEvent<HTMLElement>) {
  if (event.pointerType === "touch") return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty("--ry", `${x * 8}deg`);
  event.currentTarget.style.setProperty("--rx", `${-y * 8}deg`);
}

function settle(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--rx", "0deg");
  event.currentTarget.style.setProperty("--ry", "0deg");
}

/**
 * One person on a tile wall: portrait, name, a line under it, a focus
 * label, and a badge that sits in the corner on touch screens and appears
 * on hover elsewhere. Tilts towards the pointer. A link when `href` is set.
 */
export function PersonCard({
  name,
  line,
  focus,
  badge,
  image,
  alt = "",
  sizes,
  href,
}: {
  name: string;
  line: string;
  focus: string;
  badge: string;
  image: string;
  alt?: string;
  sizes: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="relative block aspect-[4/4.4] overflow-hidden bg-cloud-soft min-[900px]:motion-safe:max-h-[max(6rem,calc(100vh_-_36rem))]">
        <Image
          src={image}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover saturate-[.6] transition duration-700 group-hover/card:scale-105 group-hover/card:saturate-100"
        />
      </span>
      <span className="pointer-events-none absolute top-2.5 right-2.5 rotate-6 rounded-[3px] bg-brand px-2 py-1 font-mono text-[11px] tracking-[0.14em] text-cloud uppercase opacity-100 transition duration-300 [@media(hover:hover)]:scale-110 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:scale-100 [@media(hover:hover)]:group-hover/card:opacity-100">
        {badge}
      </span>
      <span className="grid flex-1 content-start gap-0.5 border-t-[1.5px] border-dashed border-cloud-soft px-3 py-3">
        <h3 className="m-0 font-display text-[15px] tracking-tight">{name}</h3>
        <span className="text-xs text-stone">{line}</span>
        <span className="mt-1 font-mono text-[11px] tracking-[0.12em] text-brand uppercase">{focus}</span>
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={shell} onPointerMove={tilt} onPointerLeave={settle}>
        {body}
      </Link>
    );
  }
  return (
    <article className={shell} onPointerMove={tilt} onPointerLeave={settle}>
      {body}
    </article>
  );
}
