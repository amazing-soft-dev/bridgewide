import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ContentImage } from "@/components/pages/ContentImage";
import { textLink } from "@/components/pages/format";
import { HoverLift } from "@/components/ui/HoverLift";

type Props = {
  href: string;
  name: string;
  summary: string;
  image: string;
  alt: string;
  /** The region code shown as the eyebrow (card and panel). */
  code?: string;
  /** The small mono line at the end (card and panel). */
  meta?: ReactNode;
  sizes: string;
  /** Aspect ratio of the photo tile. */
  aspectClassName?: string;
};

/**
 * One region, in one of three shapes:
 * - card: light, photo above the copy, the name is the link (region list page);
 * - panel: dark block, the whole tile is the link (home);
 * - photo: full-bleed photo with the copy over it (AI training).
 */
export function RegionTile({ variant, ...props }: Props & { variant: "card" | "panel" | "photo" }) {
  if (variant === "card") return <CardTile {...props} />;
  if (variant === "panel") return <PanelTile {...props} />;
  return <PhotoTile {...props} />;
}

function CardTile({ href, name, summary, image, alt, code, meta, sizes }: Props) {
  return (
    <HoverLift>
      <article className="grid content-start gap-4">
        <ContentImage src={image} alt={alt} sizes={sizes} className="aspect-[4/3] transform-gpu" />
        {code ? <p className="eyebrow">{code}</p> : null}
        <h3 className="font-display text-3xl text-ink">
          <Link href={href} className={textLink}>
            {name}
          </Link>
        </h3>
        <p className="leading-7 text-ink-soft">{summary}</p>
        {meta ? <p className="eyebrow-muted">{meta}</p> : null}
      </article>
    </HoverLift>
  );
}

function PanelTile({ href, name, summary, image, alt, code, meta, sizes }: Props) {
  return (
    <HoverLift className="h-full">
      <Link href={href} className="group flex h-full flex-col bg-ink text-cloud no-underline">
        <div className="relative aspect-[4/5] transform-gpu overflow-hidden bg-ink">
          <Image
            src={image}
            alt={alt}
            fill
            sizes={sizes}
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 -bottom-px bg-gradient-to-t from-ink via-ink/20 to-transparent" />
          {code ? (
            <p className="absolute bottom-3 left-4 font-mono text-xs tracking-[0.16em] text-brand uppercase">
              {code}
            </p>
          ) : null}
        </div>
        <div className="relative -mt-px flex flex-1 flex-col gap-3 bg-ink p-4">
          <h3 className="font-display text-2xl leading-tight text-cloud">{name}</h3>
          <p className="text-sm leading-6 text-cloud/85">{summary}</p>
          {meta ? (
            <p className="mt-auto font-mono text-xs tracking-[0.14em] text-brand uppercase">{meta}</p>
          ) : null}
        </div>
      </Link>
    </HoverLift>
  );
}

function PhotoTile({ href, name, summary, image, alt, sizes, aspectClassName = "aspect-[16/11]" }: Props) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden text-cloud no-underline ${aspectClassName}`}
    >
      <Image
        src={image}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
      <span className="absolute inset-x-0 bottom-0 grid gap-2 p-5">
        <span className="font-display text-3xl leading-none">{name}</span>
        <span className="text-sm leading-6 text-cloud/90">{summary}</span>
      </span>
    </Link>
  );
}
