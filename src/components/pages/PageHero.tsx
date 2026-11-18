import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentImage } from "@/components/pages/ContentImage";
import { HeroCopy } from "@/components/ui/HeroCopy";
import { Reveal } from "@/components/ui/Reveal";

export type Crumb = { label: string; href?: string };

/** The mono route line above the hero copy: "Home ⟶ Contact". The last crumb is the page. */
function Breadcrumb({ trail }: { trail: readonly Crumb[] }) {
  return (
    <Reveal immediate>
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="m-0 flex flex-wrap items-center gap-2.5 p-0 font-mono text-xs tracking-[0.16em] text-stone uppercase">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb.label} className="flex items-center gap-2.5">
                {crumb.href && !last ? (
                  <Link
                    href={crumb.href}
                    className="text-inherit no-underline transition-colors duration-300 hover:text-ink"
                  >
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined} className={last ? "text-brand" : ""}>
                    {crumb.label}
                  </span>
                )}
                {last ? null : (
                  <svg width="26" height="8" viewBox="0 0 26 8" fill="none" aria-hidden>
                    <path
                      d="M0 4h24m0 0-3.5-3.5M24 4l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </Reveal>
  );
}

export type HeroFrame = {
  /** The rotated label pinned over the photo's top right corner: "Brief to shortlist · 9 days". */
  ribbon: string;
  /** The card under the photo: a mono label and one display line. */
  caption: { label: string; value: string };
};

/**
 * The photo as a white card: the picture with a ribbon over its corner,
 * and a caption strip underneath. Loads eagerly, since it is often the
 * page's largest paint.
 */
function FramedPhoto({ image, frame }: { image: { src: string; alt: string }; frame: HeroFrame }) {
  return (
    <Reveal immediate delay={0.2}>
      <figure className="corner-cut-lg m-0 overflow-hidden rounded-lg border border-cloud-soft bg-white shadow-[0_28px_60px_rgb(17_17_17/0.12)]">
        <div className="relative aspect-[4/3] overflow-hidden bg-ink-soft">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            sizes="(min-width: 768px) 44vw, 100vw"
            className="object-cover"
          />
          <span className="absolute top-5 -right-3 rotate-[-6deg] rounded-[3px] bg-brand px-4 py-2 font-mono text-[11px] tracking-[0.16em] whitespace-nowrap text-white uppercase shadow-[0_10px_24px_rgb(17_17_17/0.25)]">
            {frame.ribbon}
          </span>
        </div>
        <figcaption className="px-5 py-4">
          <p className="m-0 font-mono text-[11px] tracking-[0.16em] text-brand uppercase">{frame.caption.label}</p>
          <p className="m-0 mt-1 font-display text-xl leading-tight tracking-tight text-ink">{frame.caption.value}</p>
        </figcaption>
      </figure>
    </Reveal>
  );
}

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  frame,
  chips,
  meta,
  crumbs,
  accent = false,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image?: { src: string; alt: string };
  /** With `image`: the photo becomes a card with a ribbon and a caption, and the eyebrow a chip. */
  frame?: HeroFrame;
  /** Short facts under the lede, each as a bordered chip. */
  chips?: readonly string[];
  meta?: ReactNode;
  /** Route line above the eyebrow. Leave out on pages that do not show one. */
  crumbs?: readonly Crumb[];
  /** Brand block behind the title's last word. */
  accent?: boolean;
  children?: ReactNode;
}) {
  const framed = Boolean(image && frame);

  return (
    <header className="bg-cloud">
      <div
        className={`wrap grid gap-10 py-16 md:py-24 ${
          framed
            ? "md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-14"
            : image
              ? "md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-end"
              : ""
        }`}
      >
        <div>
          {crumbs ? <Breadcrumb trail={crumbs} /> : null}
          <HeroCopy
            eyebrow={eyebrow}
            title={title}
            lede={lede}
            meta={meta}
            actions={children}
            accent={accent}
            eyebrowChip={framed}
            chips={chips}
          />
        </div>
        {image && frame ? (
          <FramedPhoto image={image} frame={frame} />
        ) : image ? (
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
