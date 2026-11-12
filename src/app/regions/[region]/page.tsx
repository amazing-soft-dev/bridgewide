import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { RoleList } from "@/components/pages/RoleList";
import { rolesIn, textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRegion, regions } from "@/content/site";
import { breadcrumbs } from "@/lib/structured-data";

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
    title: `${region.name}`,
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
      <JsonLd
        data={breadcrumbs([
          { name: "Regions", path: "/regions" },
          { name: region.name, path: `/regions/${region.slug}` },
        ])}
      />
      <PageHero
        eyebrow={region.code}
        title={region.name}
        lede={region.summary}
        image={{
          src: region.image,
          alt: `Photograph for the ${region.name} desk`,
        }}
        meta={
          <span className="eyebrow-muted">
            {region.openRoleCount} open {region.openRoleCount === 1 ? "role" : "roles"}
          </span>
        }
      />
      <PageSection
        id="roles"
        label="Seats"
        title="Open roles"
      >
        {region.openRoleCount === 0 ? (
          <p className="max-w-xl leading-8">
            This desk is open and there is no role on the board right now.{" "}
            <Link href={`/contact?region=${region.slug}#keep-profile`} className={textLink}>
              Leave a CV and a profile
            </Link>{" "}
            and the desk will keep them for 12 months.
          </p>
        ) : (
          <RoleList items={rolesIn(region.slug)} />
        )}
        <p className="mt-8">
          <Link href="/regions" className={textLink}>
            All regions
          </Link>
        </p>
      </PageSection>
    </>
  );
}
