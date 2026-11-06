import { notFound } from "next/navigation";
import { ogCard, ogContentType, ogSize } from "@/components/seo/OgCard";
import { getRegion, regions } from "@/content/site";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "BridgeWide hiring region";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return regions.map((region) => ({ region: region.slug }));
}

export default async function Image({ params }: { params: Promise<{ region: string }> }) {
  const { region: slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();
  return ogCard({
    eyebrow: `${region.code} desk · ${region.openRoleCount} open ${region.openRoleCount === 1 ? "role" : "roles"}`,
    title: `Software engineers in ${region.name}`,
    line: region.summary,
  });
}
