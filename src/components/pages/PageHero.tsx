import type { ReactNode } from "react";
import { ContentImage } from "@/components/pages/ContentImage";
import { pageWrap } from "@/components/pages/format";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image?: { src: string; alt: string };
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="bg-cloud">
      <div
        className={`${pageWrap} grid gap-10 py-16 md:py-24 ${
          image ? "md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-end" : ""
        }`}
      >
        <div>
          <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
            <SplitWords text={eyebrow} immediate />
          </p>
          <h1 className="font-display mt-4 text-4xl leading-[1.05] text-ink md:text-6xl">
            <SplitWords text={title} immediate delay={0.08} />
          </h1>
          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-8 text-ink-soft">{lede}</p>
          </Reveal>
          {meta ? <div className="mt-6 text-sm text-stone">{meta}</div> : null}
          {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
        </div>
        {image ? (
          <ContentImage
            src={image.src}
            alt={image.alt}
            sizes="(min-width: 768px) 38vw, 100vw"
            className="aspect-[4/3]"
          />
        ) : null}
      </div>
    </header>
  );
}
