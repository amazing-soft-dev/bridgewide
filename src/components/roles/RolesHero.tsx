"use client";

import Link from "next/link";
import { useState } from "react";
import { AccentLine } from "@/components/roles/AccentLine";
import { deskWrap } from "@/components/roles/desk";
import { useEntered } from "@/hooks/use-entered";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useScrollFrame } from "@/hooks/scroll-frame";

const chips = ["Salary on every role", "Named consultant", "Five regions"] as const;

export function RolesHero() {
  const on = useEntered();
  const reduced = usePrefersReducedMotion();
  const wide = useMediaQuery("(min-width: 900px)");
  const [shift, setShift] = useState(0);

  useScrollFrame(() => {
    const next = Math.min(1, window.scrollY / 700) * -40;
    return () => setShift(next);
  }, !reduced && wide);
  const lift = !reduced && wide ? shift : 0;

  return (
    <header className="overflow-hidden bg-cloud text-ink">
      <div className={`${deskWrap} pt-8 pb-8 md:pt-14 md:pb-10`}>
        <div data-motion="reveal" style={{ translate: `0 ${lift}px` }}>
          <nav aria-label="Breadcrumb" className="font-mono text-xs tracking-[0.16em] text-stone uppercase">
            <ol className="m-0 flex list-none flex-wrap items-center gap-2.5 p-0">
              <li
                data-motion="reveal"
                className={`transition duration-700 ${on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
              >
                <Link href="/" className="text-inherit no-underline hover:text-ink">
                  Home
                </Link>
              </li>
              <li
                data-motion="reveal"
                className={`inline-flex items-center gap-2.5 transition duration-700 delay-75 ${
                  on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                }`}
              >
                <i aria-hidden className="relative block h-px w-7 bg-current opacity-60 before:absolute before:top-[-3px] before:right-[-1px] before:h-1.5 before:w-1.5 before:rotate-45 before:border-t before:border-r before:border-current before:content-['']" />
                <span className="text-brand" aria-current="page">
                  Roles
                </span>
              </li>
            </ol>
          </nav>
          <h1
            className="font-display mt-5 max-w-[18ch] text-[clamp(44px,5.6vw,92px)] leading-[0.98] tracking-[-0.04em] text-ink"
            aria-label="Seats that are live this season."
          >
            <AccentLine text="Seats that are live this season." on={on} />
          </h1>
          <p
            data-motion="reveal"
            className={`mt-5 max-w-[560px] text-[17px] leading-[1.6] text-ink-soft transition duration-700 delay-300 ${
              on ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
            }`}
          >
            Engineering seats across the USA, Canada, Latin America, and Europe. Salary on every
            role, and a named consultant behind each one.
          </p>
          <ul className="mt-5 flex list-none flex-wrap gap-2 p-0 font-mono text-xs tracking-[0.12em] text-ink uppercase">
            {chips.map((chip, index) => (
              <li
                key={chip}
                data-motion="reveal"
                className={`inline-flex items-center gap-2 rounded border border-cloud-soft bg-white px-3 py-2 transition duration-700 ${
                  on ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
                }`}
                style={{ transitionDelay: `${520 + index * 70}ms` }}
              >
                <i
                  aria-hidden
                  className="block h-[7px] w-[7px] bg-brand [clip-path:polygon(0_0,70%_0,100%_30%,100%_100%,0_100%)]"
                />
                {chip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}
