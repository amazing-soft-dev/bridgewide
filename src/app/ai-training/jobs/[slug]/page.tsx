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
  trainingRole,
  trainingRoles,
  workTypeLabel,
} from "@/content/ai-training";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs, trainingJobPosting } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return trainingRoles.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = trainingRole(slug);
  if (!role) notFound();

  return pageMetadata({
    title: `${role.title} · AI training`,
    description: `${role.summary} Pay ${formatHourly(role.payMin, role.payMax)}.`,
    path: `/ai-training/jobs/${role.slug}`,
  });
}

export default async function TrainingJobPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const role = trainingRole(slug);
  if (!role) notFound();
  const region = trainingRegion(role.region);

  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "Roles", path: "/ai-training/jobs" }, { name: role.title, path: `/ai-training/jobs/${role.slug}` }])} />
      <JsonLd data={trainingJobPosting(role)} />
      <PageHero
        eyebrow="Role"
        title={role.title}
        lede={role.summary}
        meta={
          <span className="font-mono text-xs tracking-[0.16em] text-stone uppercase">
            {region?.name} · {workTypeLabel(role.workType)} · {formatHourly(role.payMin, role.payMax)}
          </span>
        }
      >
        <Button href={`/ai-training/for-candidates?role=${role.slug}`}>Apply</Button>
        <Button href="/ai-training/jobs" variant="secondary">
          All roles
        </Button>
      </PageHero>
      <PageSection id="about" label="This listing" title="How this work pays.">
        <p className="max-w-2xl leading-8 text-ink-soft">
          The pay range is what this work carries. The platform pays the person, in USD. BridgeWide does not take a cut, and a profile is shared only after the candidate agrees.
        </p>
        <p className="mt-8">
          <Link href={`/ai-training/${role.region}`} className={textLink}>
            {region?.name} page
          </Link>
        </p>
      </PageSection>
    </>
  );
}
