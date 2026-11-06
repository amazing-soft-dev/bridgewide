import { notFound } from "next/navigation";
import { regionFor } from "@/components/pages/format";
import { ogCard, ogContentType, ogSize } from "@/components/seo/OgCard";
import { getRole, roles } from "@/content/site";

export const dynamic = "force-static";
export const dynamicParams = false;
export const alt = "Open engineering role at BridgeWide";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return roles.map((role) => ({ slug: role.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();
  const region = regionFor(role.region);
  return ogCard({
    eyebrow: `${region.name} · ${role.city} · ${role.workMode} · ${role.engagement}`,
    title: role.title,
    line: role.salary,
  });
}
