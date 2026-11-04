import Link from "next/link";
import { notFound } from "next/navigation";
import { ExampleBadge } from "@/components/ai-training/ExampleBadge";
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
    title: `${role.title} · AI training · BridgeWide`,
    description: `${role.summary} Example pay ${formatHourly(role.payMin, role.payMax)}.`,
    path: `/ai-training/jobs/${role.slug}`,
    robots: role.sample ? { index: false, follow: true } : undefined,
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
      <PageHero
        eyebrow="Example role"
        title={role.title}
        lede={role.summary}
        meta={
          <span className="flex flex-wrap items-center gap-3">
            <ExampleBadge />
            <span className="font-mono text-xs tracking-[0.16em] text-stone uppercase">
              {region?.name} · {workTypeLabel(role.workType)} · {formatHourly(role.payMin, role.payMax)}
            </span>
          </span>
        }
      >
        <Button href={`/ai-training/for-candidates?role=${role.slug}`}>Apply</Button>
        <Button href="/ai-training/jobs" variant="secondary">
          All example roles
        </Button>
      </PageHero>
      <PageSection id="about" label="This listing" title="An example, not a live seat.">
        <p className="max-w-2xl leading-8 text-ink-soft">
          The pay range shows the kind of rate this work can carry. The platform would pay the person,
          in USD. BridgeWide does not take a cut, and a profile is shared only after the candidate agrees.
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
