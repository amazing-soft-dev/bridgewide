import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { platforms } from "@/content/ai-training";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "Platforms · AI training",
  description:
    "A public directory of AI-training platforms. BridgeWide introduces candidates where it has a direct line.",
  path: "/ai-training/platforms",
});

export default function PlatformsPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "AI training", path: "/ai-training" }, { name: "Platforms", path: "/ai-training/platforms" }])} />
      <PageHero
        eyebrow="Platforms"
        title="A directory, not a claim of partnership."
        lede="These are public platforms that post AI-training work. BridgeWide introduces you where it has a direct line, and briefs you on the assessment either way."
      />
      <PageSection id="directory" label="Directory" title={`${platforms.length} platforms.`}>
        <ul className="grid gap-6 md:grid-cols-2">
          {platforms.map((platform) => (
            <li key={platform.slug} className="border-t border-brand pt-4">
              <h3 className="font-display text-2xl">
                <Link href={`/ai-training/platforms/${platform.slug}`} className={textLink}>
                  {platform.name}
                </Link>
              </h3>
              <p className="mt-3 leading-7 text-ink-soft">{platform.summary}</p>
              <p className="mt-2 font-mono text-xs tracking-[0.14em] text-stone uppercase">
                {platform.work}
              </p>
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  );
}
