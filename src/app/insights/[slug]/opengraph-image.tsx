import { notFound } from "next/navigation";
import { ogCard, ogContentType, ogSize } from "@/components/seo/OgCard";
import { getInsight, insights } from "@/content/site";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "BridgeWide insight";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight) notFound();
  return ogCard({
    eyebrow: `${insight.kicker} · ${insight.minutes} min read`,
    title: insight.title,
    line: insight.excerpt,
  });
}
