"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HeroPhoto } from "@/components/home/HeroPhoto";
import { Button } from "@/components/ui/Button";
import { photoSecondaryClass } from "@/components/ui/SectionHeading";
import { SplitWords } from "@/components/ui/SplitWords";
import { usePrefersReducedMotion } from "@/lib/motion";
import { getRegion, hero, images, roles, stats } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const liveRoles = roles.slice(0, 5);
  const reduced = usePrefersReducedMotion();

  return (
    <section
      className="relative isolate z-0 overflow-hidden text-cloud"
      aria-labelledby="hero-heading"
    >
      <HeroPhoto src={images.hero} alt="Team working together around a laptop" />
      <div className="absolute inset-0 bg-ink/55" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40"
        aria-hidden
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col justify-end gap-12 px-4 pt-16 pb-24 md:min-h-[calc(100svh-7.5rem)] md:pt-20">
        <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
              <SplitWords text={hero.eyebrow} immediate />
            </p>
            <h1
              id="hero-heading"
              className="mt-4 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-cloud sm:text-5xl lg:text-6xl"
            >
              <SplitWords text={hero.headline} immediate delay={0.12} />
            </h1>
            <motion.p
              className="mt-5 max-w-xl text-lg leading-8 text-cloud"
              data-motion="reveal"
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.42, ease }}
            >
              {hero.subcopy}
            </motion.p>
            <motion.div
              className="mt-8 flex flex-wrap gap-3"
              data-motion="reveal"
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.52, ease }}
            >
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              <Button
                href={hero.secondaryCta.href}
                variant="secondary"
                className={photoSecondaryClass}
              >
                {hero.secondaryCta.label}
              </Button>
            </motion.div>
          </div>
          <motion.div
            className="border border-cloud/25 bg-ink/35 p-5 backdrop-blur-[2px]"
            data-motion="reveal"
            initial={reduced ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.62, ease }}
          >
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
              Live roles
            </p>
            <ul className="mt-2 divide-y divide-cloud/15">
              {liveRoles.map((role, index) => {
                const code = getRegion(role.region)?.code;
                return (
                  <motion.li
                    key={role.slug}
                    data-motion="reveal"
                    initial={reduced ? false : { opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : 0.7 + index * 0.05, ease }}
                  >
                    <Link
                      href={`/roles/${role.slug}`}
                      className="flex items-baseline justify-between gap-4 py-2.5 text-cloud no-underline hover:text-brand"
                    >
                      <span className="text-sm leading-6">{role.title}</span>
                      <span className="shrink-0 font-mono text-[11px] tracking-wide text-cloud/80 uppercase">
                        {role.city}
                        {code ? ` · ${code}` : ""}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <Link
              href="/roles"
              className="mt-3 inline-block font-mono text-xs tracking-[0.16em] text-brand uppercase no-underline hover:text-cloud"
            >
              All open roles
            </Link>
          </motion.div>
        </div>
        {stats.length > 0 ? (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-cloud/20 pt-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <dt className="order-2 mt-2 max-w-[14rem] text-sm leading-5 text-cloud">
                  {stat.label}
                </dt>
                <dd className="order-1 font-display text-4xl leading-none text-cloud">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </section>
  );
}
