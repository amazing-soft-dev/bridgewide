import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { Prose } from "@/components/pages/Prose";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { getInsight, insights } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  return pageMetadata({
    title: `${insight.title} · BridgeWide`,
    description: insight.excerpt,
    path: `/insights/${insight.slug}`,
    type: "article",
  });
}

export default async function InsightPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();

  return (
    <article>
      <PageHero
        eyebrow={insight.kicker}
        title={insight.title}
        lede={insight.excerpt}
        meta={
          <>
            <time dateTime={isoDate(insight.date)}>{insight.date}</time>
            {" · "}
            {insight.minutes} min
          </>
        }
      />
      <PageSection id="note" label="Note" title="The argument">
        <Prose>
          {insight.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>
        <p className="mt-10">
          <Link href="/insights" className={textLink}>
            All insights
          </Link>
        </p>
      </PageSection>
    </article>
  );
}

function isoDate(label: string) {
  const parsed = new Date(label);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().slice(0, 10);
}
