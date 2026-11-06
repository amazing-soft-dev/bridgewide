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

export function PageHero({
  eyebrow,
  title,
  lede,
  image,
  meta,
  crumbs,
  accent = false,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  image?: { src: string; alt: string };
  meta?: ReactNode;
  /** Route line above the eyebrow. Leave out on pages that do not show one. */
  crumbs?: readonly Crumb[];
  /** Brand block behind the title's last word. */
  accent?: boolean;
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
          {crumbs ? <Breadcrumb trail={crumbs} /> : null}
          <HeroCopy
            eyebrow={eyebrow}
            title={title}
            lede={lede}
            meta={meta}
            actions={children}
            accent={accent}
          />
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
