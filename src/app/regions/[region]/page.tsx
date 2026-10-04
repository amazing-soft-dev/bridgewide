import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { RoleList } from "@/components/pages/RoleList";
import { rolesIn, textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { getRegion, regions, sampleFiguresNote } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return regions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();

  return pageMetadata({
    title: `${region.name} · BridgeWide`,
    description: region.summary,
    path: `/regions/${region.slug}`,
  });
}

export default async function RegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();

  return (
    <>
      <PageHero
        eyebrow={region.code}
        title={region.name}
        lede={region.summary}
        image={{
          src: region.image,
          alt: `Photograph for the ${region.name} desk`,
        }}
        meta={
          <span className="font-mono text-xs tracking-[0.18em] text-stone uppercase">
            {region.openRoleCount} open {region.openRoleCount === 1 ? "role" : "roles"}
          </span>
        }
      />
      <PageSection
        id="roles"
        label={`${sampleFiguresNote}`}
        title="Open roles"
        lede="Salaries on these seats are sample figures."
      >
        <RoleList items={rolesIn(region.slug)} />
        <p className="mt-8">
          <Link href="/regions" className={textLink}>
            All regions
          </Link>
        </p>
      </PageSection>
    </>
  );
}
