"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import {
  SectionHeading,
  sectionContainer,
} from "@/components/ui/SectionHeading";
import { usePrefersReducedMotion } from "@/lib/motion";
import { stories } from "@/content/site";

const storyAlt: Record<string, string> = {
  "northline-ledger-owner": "People in a meeting around a table",
  "harbor-metrics-warehouse": "A quiet modern office interior",
  "campo-health-release": "A laptop open on a desk",
  "keel-systems-paved-path": "A team working side by side",
};

export default function StoriesSection() {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const count = stories.length;
  const previous = () => setIndex((current) => (current - 1 + count) % count);
  const next = () => setIndex((current) => (current + 1) % count);

  return (
    <section
      className="seam-right relative z-10 bg-cloud-soft pt-24 pb-20 md:pt-28 md:pb-24"
      aria-labelledby="stories-heading"
    >
      <div className={sectionContainer}>
        <SectionHeading
          id="stories-heading"
          eyebrow="From hiring managers"
          title="Employer stories"
          lede="What the companies said after the engineer started."
        />
      </div>
      <div className="story-stack relative mt-10 h-[32rem] overflow-hidden sm:h-[36rem]">
        {stories.map((story, storyIndex) => {
          const offset = storyIndex - index;
          const active = storyIndex === index;
          return (
            <motion.article
              key={story.slug}
              className="absolute inset-0"
              data-motion="story"
              aria-hidden={!reduced && !active}
              animate={
                reduced
                  ? { y: "0%", scale: 1, opacity: 1 }
                  : {
                      y: active ? "0%" : offset > 0 ? "104%" : "-6%",
                      scale: offset < 0 ? 0.96 : 1,
                      opacity: active || offset === -1 ? 1 : 0,
                    }
              }
              transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ zIndex: active ? 3 : offset < 0 ? 2 : 1 }}
            >
              <Image
                src={story.image}
                alt={storyAlt[story.slug] ?? story.company}
                fill
                loading="lazy"
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25" />
              <div className={`${sectionContainer} relative flex h-full flex-col justify-end pb-8 text-cloud`}>
                <p className="font-mono text-xs tracking-[0.16em] text-brand uppercase">
                  {story.metric} · {story.company}
                </p>
                <h3 className="mt-3 max-w-3xl font-display text-3xl leading-tight text-cloud md:text-5xl">
                  {story.result}
                </h3>
                <blockquote className="mt-4 max-w-2xl text-base leading-7 text-cloud md:text-lg">
                  “{story.quote}”
                </blockquote>
                <p className="mt-3 text-sm text-cloud/85">{story.attribution}</p>
                <Link
                  href={`/stories/${story.slug}`}
                  className="mt-4 inline-block font-mono text-xs tracking-[0.16em] text-brand uppercase no-underline hover:text-cloud"
                >
                  Read the story
                </Link>
              </div>
            </motion.article>
          );
        })}
      </div>
      <div className={`${sectionContainer} mt-4 flex items-center justify-between gap-4`}>
        <button
          type="button"
          className="border border-ink px-4 py-2 text-sm text-ink"
          onClick={previous}
        >
          Previous
        </button>
        <p className="font-mono text-xs tracking-[0.16em] text-ink uppercase">
          {index + 1} / {count}
        </p>
        <button
          type="button"
          className="border border-ink bg-ink px-4 py-2 text-sm text-brand"
          onClick={next}
        >
          Next
        </button>
      </div>
    </section>
  );
}
