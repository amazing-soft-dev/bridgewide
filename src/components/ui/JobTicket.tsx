import Link from "next/link";

const shell =
  "group corner-cut relative grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-2.5 overflow-hidden rounded-lg border border-cloud-soft bg-white px-3.5 py-3.5 text-ink no-underline transition-[translate,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:translate-x-1 hover:border-[color-mix(in_srgb,var(--color-brand)_40%,var(--color-cloud-soft))] hover:shadow-[0_18px_40px_color-mix(in_srgb,var(--color-ink)_10%,transparent)] focus-visible:translate-x-1 focus-visible:border-[color-mix(in_srgb,var(--color-brand)_40%,var(--color-cloud-soft))] focus-visible:shadow-[0_18px_40px_color-mix(in_srgb,var(--color-ink)_10%,transparent)] min-[900px]:grid-cols-[44px_minmax(0,1fr)_130px_90px_20px] min-[900px]:gap-3.5 min-[900px]:px-[18px] min-[1200px]:grid-cols-[48px_minmax(0,1fr)_130px_92px_120px_120px_70px_20px]";

const mono = "font-mono text-xs tracking-[0.04em] text-stone";

/**
 * One job as a ticket row, the same columns for every kind of listing:
 * code, title and summary, place, kind, pay, tag, age, arrow. Narrow
 * viewports keep code, title, and pay; place joins at 900px; kind, tag, and
 * age at 1200px.
 */
export function JobTicket({
  href,
  code,
  title,
  summary,
  place,
  kind,
  pay,
  tag,
  tagTone = "quiet",
  age,
  heading = "b",
}: {
  href: string;
  /** Three-letter sector or work-type code. */
  code: string;
  title: string;
  summary: string;
  /** City and work mode, or the region. */
  place: string;
  /** Engagement type or kind of work. */
  kind: string;
  pay: string;
  tag?: string;
  tagTone?: "brand" | "quiet";
  /** "19 days", shown on the widest layout. */
  age?: string;
  /** Element for the title: a heading when the row is a list entry of its own. */
  heading?: "b" | "h2" | "h3";
}) {
  const Title = heading;

  return (
    <Link href={href} className={shell}>
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-[3px] origin-bottom scale-y-0 bg-brand transition-transform duration-[400ms] ease-[cubic-bezier(0.2,0.9,0.2,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
      />
      <span className="grid place-items-center rounded-[3px] border border-[color-mix(in_srgb,var(--color-brand)_45%,transparent)] py-1.5 font-mono text-xs tracking-[0.12em] text-brand">
        {code}
      </span>
      <span className="grid min-w-0 gap-1">
        <Title className="m-0 font-display text-lg leading-tight font-bold tracking-[-0.02em]">{title}</Title>
        <span className="text-sm text-stone">{summary}</span>
      </span>
      <span className={`hidden ${mono} min-[900px]:block`}>{place}</span>
      <span className={`hidden ${mono} min-[1200px]:block`}>{kind}</span>
      <span className="text-[15px] font-bold tracking-[-0.02em] min-[900px]:text-[17px]">{pay}</span>
      {tag ? (
        <span
          className={`hidden max-w-full justify-self-start rounded-[3px] px-1.5 py-1 font-mono text-xs tracking-[0.12em] uppercase min-[1200px]:inline-block ${
            tagTone === "brand" ? "bg-brand text-white" : "bg-cloud text-stone"
          }`}
        >
          {tag}
        </span>
      ) : (
        <span className="hidden min-[1200px]:block" />
      )}
      <span className={`hidden ${mono} uppercase min-[1200px]:block`}>{age}</span>
      <span
        aria-hidden
        className="hidden -translate-x-1.5 text-lg opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 min-[900px]:block"
      >
        →
      </span>
    </Link>
  );
}
