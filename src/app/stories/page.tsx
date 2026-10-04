import Link from "next/link";
import { ContentImage } from "@/components/pages/ContentImage";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { regionFor, textLink } from "@/components/pages/format";
import { HoverLift } from "@/components/ui/HoverLift";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { pageMetadata } from "@/components/pages/metadata";
import { stories } from "@/content/site";

export const metadata = pageMetadata({
  title: "Stories · BridgeWide",
  description:
    "How companies filled an engineering seat with BridgeWide, from the brief to the start date.",
  path: "/stories",
});

export default function StoriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Stories"
        title="Searches that ended with a start date."
        lede="Four employer stories, one from each desk. The day counts are the time from a complete brief to a hire."
      />
      <PageSection id="list" label="Employers" title="From the desks">
        <RevealGroup className="grid gap-14">
          {stories.map((story) => {
            const region = regionFor(story.region);
            return (
              <RevealItem key={story.slug}>
                <HoverLift>
                <article className="grid gap-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
                  <ContentImage
                    src={story.image}
                    alt={`Photograph for the ${story.company} story`}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="aspect-[4/3]"
                  />
                  <div>
                    <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
                      {region.name} · {story.metric}
                    </p>
                    <h3 className="font-display mt-3 text-3xl text-ink">
                      <Link href={`/stories/${story.slug}`} className={textLink}>
                        {story.company}
                      </Link>
                    </h3>
                    <p className="mt-4 text-lg leading-8 text-ink">{story.quote}</p>
                    <p className="mt-3 text-sm text-stone">{story.attribution}</p>
                    <p className="mt-4 text-ink-soft">{story.result}</p>
                  </div>
                </article>
                </HoverLift>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </PageSection>
    </>
  );
}
