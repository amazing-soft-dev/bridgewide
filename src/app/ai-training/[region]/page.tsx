import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { Button } from "@/components/ui/Button";
import {
  formatHourly,
  trainingRegion,
  trainingRegions,
  trainingRoles,
} from "@/content/ai-training";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return trainingRegions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = trainingRegion(slug);
  if (!region) notFound();

  return pageMetadata({
    title: `${region.name} · AI training`,
    description: region.summary,
    path: `/ai-training/${region.slug}`,
  });
}

export default async function TrainingRegionPage({
  params,
}: {
  params: Promise<{ region: string }>;
}) {
  const { region: slug } = await params;
  const region = trainingRegion(slug);
  if (!region) notFound();
  const roles = trainingRoles.filter((role) => role.region === region.slug);

  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: region.name, path: `/ai-training/${region.slug}` }])} />
      <PageHero eyebrow="Region" title={region.name} lede={region.summary}>
        <Button href="/ai-training/for-candidates">Apply</Button>
      </PageHero>
      <PageSection id="roles" label="Roles" title="Roles written for this region.">
        {roles.length === 0 ? (
          <p className="text-ink-soft">
            Roles for {region.name} will show here. You can still apply from anywhere.
          </p>
        ) : (
          <ul className="grid gap-6">
            {roles.map((role) => (
              <li key={role.slug} className="border-t border-brand pt-4">
                <h3 className="font-display text-2xl">
                  <Link href={`/ai-training/jobs/${role.slug}`} className={textLink}>
                    {role.title}
                  </Link>
                </h3>
                <p className="mt-2 text-ink-soft">{role.summary}</p>
                <p className="mt-2 font-mono text-sm">{formatHourly(role.payMin, role.payMax)}</p>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8">
          <Link href="/ai-training" className={textLink}>
            All regions
          </Link>
        </p>
      </PageSection>
    </>
  );
}
