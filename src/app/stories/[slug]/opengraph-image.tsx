import { notFound } from "next/navigation";
import { regionFor } from "@/components/pages/format";
import { ogCard, ogContentType, ogSize } from "@/components/seo/OgCard";
import { getStory, stories } from "@/content/site";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "BridgeWide employer story";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const region = regionFor(story.region);
  return ogCard({
    eyebrow: `Employer story · ${story.company} · ${region.name}`,
    title: story.result,
    line: `${story.metric} from brief to start. “${story.quote}”`,
  });
}
