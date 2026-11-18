import { notFound } from "next/navigation";
import { ogCard, ogContentType, ogSize } from "@/components/seo/OgCard";
import { getRegion, openRoleCount, regions } from "@/content/site";

export const dynamic = "force-static";
// A role closes at 18:00 Pacific. Next.js reads this value statically, so it must be a number literal:
// regenerate at most every five minutes in the server build. The static export ignores it.
export const revalidate = 300;
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
  const open = openRoleCount(region.slug);
  return ogCard({
    eyebrow: `${region.code} desk · ${open} open ${open === 1 ? "role" : "roles"}`,
    title: `Software engineers in ${region.name}`,
    line: region.summary,
  });
}
