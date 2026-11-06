import type { ReactNode } from "react";
import { ContentImage } from "@/components/pages/ContentImage";
import { HeroCopy } from "@/components/ui/HeroCopy";

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
        className={`wrap grid gap-10 py-16 md:py-24 ${
          image ? "md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-end" : ""
        }`}
      >
        <div>
          <HeroCopy eyebrow={eyebrow} title={title} lede={lede} meta={meta} actions={children} />
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
