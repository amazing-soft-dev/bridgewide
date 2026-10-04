import Link from "next/link";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { insights } from "@/content/site";

export default function InsightsSection() {
  return (
    <section
      className="seam-left relative z-10 bg-cloud pt-24 pb-24 md:pt-28 md:pb-28"
      aria-labelledby="insights-heading"
    >
      <div className={sectionContainer}>
        <SectionHeading
          id="insights-heading"
          eyebrow="Notes"
          title="Insights"
          lede="Short reading for the person opening the seat."
        />
        <RevealGroup className="mt-12 divide-y divide-ink/15 border-t border-ink/15">
          {insights.map((insight) => (
            <RevealItem key={insight.slug}>
              <article className="grid gap-3 py-6 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-8">
                <p className="font-mono text-xs tracking-[0.14em] text-brand uppercase">
                  {insight.kicker}
                  <span className="mt-2 block text-ink-soft normal-case tracking-normal">
                    {insight.date} · {insight.minutes} min
                  </span>
                </p>
                <div>
                  <h3 className="font-display text-2xl leading-tight text-ink md:text-3xl">
                    <Link
                      href={`/insights/${insight.slug}`}
                      className="text-ink no-underline decoration-brand underline-offset-4 hover:text-brand hover:underline"
                    >
                      {insight.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-ink-soft">
                    {insight.excerpt}
                  </p>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
