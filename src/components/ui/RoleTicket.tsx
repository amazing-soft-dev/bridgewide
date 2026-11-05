import Link from "next/link";
import type { ReactNode } from "react";

const shell =
  "group relative grid items-center gap-2.5 overflow-hidden rounded-lg border border-cloud-soft bg-white px-3.5 py-3.5 text-ink no-underline [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)] transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:translate-x-1 hover:border-[color-mix(in_srgb,var(--color-brand)_40%,var(--color-cloud-soft))] hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--color-ink)_10%,transparent)] focus-visible:translate-x-1 focus-visible:border-[color-mix(in_srgb,var(--color-brand)_40%,var(--color-cloud-soft))] focus-visible:shadow-[0_18px_40px_color-mix(in_srgb,var(--color-ink)_10%,transparent)]";

/**
 * Shared job row. Callers supply the trailing columns; the shell owns the
 * code, title, summary, clipped corner, and the hover bar, slide, and arrow.
 */
export function RoleTicket({
  href,
  code,
  title,
  summary,
  children,
  className,
  arrowAt = 900,
}: {
  href: string;
  code: string;
  title: string;
  summary: string;
  children?: ReactNode;
  className?: string;
  /** Width at which the arrow joins the row. */
  arrowAt?: 700 | 900;
}) {
  const arrowShown = arrowAt === 700 ? "min-[700px]:block" : "min-[900px]:block";

  return (
    <Link href={href} className={className ? `${shell} ${className}` : shell}>
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-0 bg-brand transition-transform duration-[400ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="grid place-items-center rounded-[3px] border border-[color-mix(in_srgb,var(--color-brand)_45%,transparent)] py-1.5 font-mono text-xs tracking-[0.12em] text-brand">
        {code}
      </span>
      <span className="grid min-w-0 gap-1">
        <b className="font-display text-lg leading-tight font-bold tracking-[-0.02em]">{title}</b>
        <span className="text-sm text-stone">{summary}</span>
      </span>
      {children}
      <span
        aria-hidden
        className={`hidden -translate-x-1.5 text-lg opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 ${arrowShown}`}
      >
        →
      </span>
    </Link>
  );
}
