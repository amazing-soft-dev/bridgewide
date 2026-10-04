import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { insights } from "@/content/site";

export const metadata = pageMetadata({
  title: "Insights · BridgeWide",
  description:
    "Notes for hiring managers on briefs, contract seats, and reading salary bands across four regions.",
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Notes from the searches we are running."
        lede="Short pieces for hiring managers: how to write a brief, how to fill a contract seat, and how to read a salary band."
      />
      <PageSection id="list" label="Desk notes" title="Latest">
        <ul className="grid gap-12">
          {insights.map((insight) => (
            <li key={insight.slug} className="border-t border-brand pt-6">
              <article>
                <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
                  {insight.kicker}
                </p>
                <h3 className="font-display mt-3 text-3xl text-ink">
                  <Link href={`/insights/${insight.slug}`} className={textLink}>
                    {insight.title}
                  </Link>
                </h3>
                <p className="mt-3 text-sm text-stone">
                  <time dateTime={isoDate(insight.date)}>{insight.date}</time>
                  {" · "}
                  {insight.minutes} min
                </p>
                <p className="mt-4 max-w-2xl leading-7 text-ink-soft">{insight.excerpt}</p>
              </article>
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  );
}

function isoDate(label: string) {
  const parsed = new Date(label);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}
