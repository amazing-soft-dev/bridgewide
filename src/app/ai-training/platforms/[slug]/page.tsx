import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { Button } from "@/components/ui/Button";
import { platforms, trainingPlatform } from "@/content/ai-training";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return platforms.map((platform) => ({ slug: platform.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const platform = trainingPlatform(slug);
  if (!platform) notFound();

  return pageMetadata({
    title: `${platform.name} · AI training`,
    description: platform.summary,
    path: `/ai-training/platforms/${platform.slug}`,
  });
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const platform = trainingPlatform(slug);
  if (!platform) notFound();

  const relationship =
    platform.relationship === "direct"
      ? "BridgeWide has a direct line to this platform."
      : "Listed in the public directory. BridgeWide introduces candidates where it has a direct line.";

  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "Platforms", path: "/ai-training/platforms" }, { name: platform.name, path: `/ai-training/platforms/${platform.slug}` }])} />
      <PageHero eyebrow="Platform" title={platform.name} lede={platform.summary}>
        <Button href="/ai-training/for-candidates">Apply</Button>
        <Button href="/ai-training/platforms" variant="secondary">
          All platforms
        </Button>
      </PageHero>
      <PageSection id="work" label="Work" title="What this platform is known to post.">
        <p className="max-w-2xl leading-8 text-ink-soft">{platform.work}</p>
        <p className="mt-6 max-w-2xl leading-8 text-ink-soft">{relationship}</p>
        <p className="mt-8">
          <Link href="/ai-training/for-partners" className={textLink}>
            Partner inquiry
          </Link>
        </p>
      </PageSection>
    </>
  );
}
