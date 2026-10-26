"use client";

import { motion } from "motion/react";
import { HeroPhoto } from "@/components/home/HeroPhoto";
import { RoleBoard } from "@/components/home/RoleBoard";
import { Button } from "@/components/ui/Button";
import { SplitWords } from "@/components/ui/SplitWords";
import { usePrefersReducedMotion } from "@/lib/motion";
import { hero, images, stats } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
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
              <Button href={hero.secondaryCta.href} variant="onDark">
                {hero.secondaryCta.label}
              </Button>
            </motion.div>
          </div>
          <RoleBoard />
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
