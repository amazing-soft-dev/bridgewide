import { StorySlides } from "@/components/ui/StorySlides";
import { getRegion, stories } from "@/content/site";

const storyAlt: Record<string, string> = {
  "northline-ledger-owner": "People in a meeting around a table",
  "harbor-metrics-warehouse": "A quiet modern office interior",
  "campo-health-release": "A laptop open on a desk",
  "keel-systems-paved-path": "A team working side by side",
  "anon-canada-contract": "An abstract mark for an anonymized client story",
};

const pad = (value: number) => String(value).padStart(2, "0");

export default function StoriesSection() {
  return (
    <StorySlides
      heading="Employer stories"
      headingId="stories-heading"
      badge="Employer stories"
      seam="left"
      clearance="bottom"
      slides={stories.map((story, index) => {
        const [figure, ...unit] = story.metric.split(" ");
        const region = getRegion(story.region);
        return {
          key: story.slug,
          image: { src: story.image, alt: storyAlt[story.slug] ?? story.company },
          kicker: (
            <>
              {story.company} · {region?.name}
            </>
          ),
          copy: (
            <figure className="mt-4">
              <blockquote className="max-w-[36rem] font-display text-[clamp(1.85rem,3.3vw,3rem)] leading-[1.06] tracking-tight text-cloud">
                “{story.quote}”
              </blockquote>
              <figcaption className="mt-5 text-sm text-cloud/80">{story.attribution}</figcaption>
            </figure>
          ),
          cta: { href: `/stories/${story.slug}`, label: "Read the story" },
          card: {
            figure,
            unit: `${unit.join(" ")} from brief to start`,
            foot: `${region?.code} placement ${pad(index + 1)}`,
          },
          note: story.result,
        };
      })}
    />
  );
}
