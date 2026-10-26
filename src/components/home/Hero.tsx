"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { HeroCursor } from "@/components/home/HeroCursor";
import { HeroPhoto } from "@/components/home/HeroPhoto";
import { RoleBoard } from "@/components/home/RoleBoard";
import { Button } from "@/components/ui/Button";
import { SplitWords } from "@/components/ui/SplitWords";
import { usePrefersReducedMotion } from "@/lib/motion";
import { hero, images, stats } from "@/content/site";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduced = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section data-header-tone="dark"
      ref={sectionRef}
      className="hero-stage relative isolate z-0 overflow-hidden text-cloud lg:h-[calc(100svh-var(--hero-offset))]"
      aria-labelledby="hero-heading"
    >
      <HeroPhoto src={images.hero} alt="Team working together around a laptop" />
      <div className="hero-veil absolute inset-0" aria-hidden />
      <HeroCursor sectionRef={sectionRef} />
      <div className="relative flex h-full w-full flex-col justify-center px-4 py-16 sm:px-6 lg:px-[8vw] lg:py-8 xl:justify-start xl:pt-14 xl:pl-14 2xl:justify-center 2xl:px-[8vw] 2xl:py-8">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:gap-8">
          <div>
            <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
              <SplitWords text={hero.eyebrow} immediate />
            </p>
            <h1
              id="hero-heading"
              className="hero-title mt-4 max-w-4xl font-display text-[clamp(2.75rem,5.2vw,6rem)] leading-[1.02] tracking-tight text-cloud"
            >
              <SplitWords text={hero.headline} immediate delay={0.12} />
            </h1>
            <motion.p
              className="hero-sub mt-5 max-w-xl text-lg leading-8 text-cloud"
              data-motion="reveal"
              initial={reduced ? false : { opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduced ? 0 : 0.6, delay: reduced ? 0 : 0.42, ease }}
            >
              {hero.subcopy}
            </motion.p>
            <motion.div
              className="hero-actions mt-8 flex flex-wrap gap-3"
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
            {stats.length > 0 ? (
              <dl className="hero-stats mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-cloud/20 pt-5">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <dt className="order-2 mt-1 max-w-[12rem] text-sm leading-5 text-cloud">
                      {stat.label}
                    </dt>
                    <dd className="order-1 font-display text-3xl leading-none text-cloud">
                      {stat.value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : null}
          </div>
          <RoleBoard />
        </div>
      </div>
    </section>
  );
}
