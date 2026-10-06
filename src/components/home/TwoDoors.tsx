"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { photoSecondaryClass } from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion";
import { hero, images } from "@/content/site";

const doors = [
  {
    href: hero.primaryCta.href,
    label: hero.primaryCta.label,
    eyebrow: "Employers",
    title: "Hire for the seat you actually have",
    copy: "Send the stack, the hiring manager, and what the first ninety days need to prove. We come back with people your engineering managers will interview.",
    image: images.employers,
    alt: "Hiring team in a working session",
    variant: "primary" as const,
    className: "",
  },
  {
    href: hero.secondaryCta.href,
    label: hero.secondaryCta.label,
    eyebrow: "Engineers",
    title: "A role with the band already named",
    copy: "Live seats in the USA, Canada, Latin America, and Europe. You do not pay a fee to be introduced, and your consultant shares the band before your name goes across.",
    image: images.engineers,
    alt: "Engineers working at a row of screens",
    variant: "secondary" as const,
    className: photoSecondaryClass,
  },
];

export function TwoDoors() {
  const [active, setActive] = useState<number | null>(null);
  const [wide, setWide] = useState(false);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <section className="seam-right relative z-10 bg-cloud" aria-labelledby="doors-heading">
      <h2 id="doors-heading" className="sr-only">
        Employers and engineers
      </h2>
      <div
        className="flex flex-col md:flex-row"
        onMouseLeave={() => setActive(null)}
      >
        {doors.map((door, index) => {
          const dimmed = active !== null && active !== index && !reduced;
          const grow =
            wide && !reduced && active !== null ? (active === index ? 1.12 : 0.9) : 1;
          const transition = { duration: reduced ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] as const };

          return (
            <motion.article
              key={door.href}
              className="relative min-h-[28rem] min-w-0 overflow-hidden bg-ink text-cloud md:min-h-[36rem] md:flex-1 md:basis-0"
              data-motion="door"
              animate={{ flexGrow: grow }}
              transition={transition}
              onMouseEnter={() => setActive(index)}
            >
              <Image
                src={door.image}
                alt={door.alt}
                fill
                loading="lazy"
                sizes="(min-width: 768px) 60vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-ink/60" aria-hidden />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25"
                aria-hidden
              />
              <div className="relative flex min-h-[28rem] flex-col justify-end px-6 pt-8 pb-24 md:min-h-[36rem] md:px-10 md:pb-28">
                <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
                  {door.eyebrow}
                </p>
                <h3 className="mt-3 max-w-md font-display text-4xl leading-[1.05] text-cloud">
                  {door.title}
                </h3>
                <p className="mt-4 max-w-md text-base leading-7 text-cloud">{door.copy}</p>
                <div className="mt-6">
                  <Button href={door.href} variant={door.variant} className={door.className}>
                    {door.label}
                  </Button>
                </div>
              </div>
              <motion.div
                className="pointer-events-none absolute inset-0 bg-ink"
                aria-hidden
                initial={false}
                animate={{ opacity: dimmed ? 0.45 : 0 }}
                transition={transition}
              />
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
