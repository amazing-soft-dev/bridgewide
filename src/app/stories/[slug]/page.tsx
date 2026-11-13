import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { Prose } from "@/components/pages/Prose";
import { regionFor, textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { contentUpdatedOn, getStory, stories } from "@/content/site";
import { caseStudySections } from "@/lib/case-study";
import { breadcrumbs } from "@/lib/structured-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  return pageMetadata({
    title: `${story.company}`,
    description: story.quote,
    path: `/stories/${story.slug}`,
    type: "article",
    modifiedTime: contentUpdatedOn,
  });
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();

  const region = regionFor(story.region);

  return (
    <article>
      <JsonLd
        data={breadcrumbs([
          { name: "Stories", path: "/stories" },
          { name: story.company, path: `/stories/${story.slug}` },
        ])}
      />
      <PageHero
        eyebrow={region.name}
        title={story.company}
        lede={story.result}
        image={{
          src: story.image,
          alt: `Photograph for the ${story.company} story`,
        }}
        meta={
          <span className="eyebrow">
            {story.metric}
          </span>
        }
      />
      <PageSection id="story" label="The search" title="What changed">
        <blockquote className="max-w-3xl border-l-2 border-brand pl-6">
          <p className="font-display text-2xl leading-snug text-ink md:text-3xl">{story.quote}</p>
          <footer className="mt-4 text-sm text-stone">
            <cite className="not-italic">{story.attribution}</cite>
          </footer>
        </blockquote>
        <div className="mt-10 grid max-w-3xl gap-8">
          {caseStudySections(story).map((section) => (
            <section key={section.label} aria-labelledby={`${story.slug}-${section.label}`}>
              <h3 id={`${story.slug}-${section.label}`} className="eyebrow-muted m-0 mb-3">
                {section.label}
              </h3>
              <Prose>
                <p>{section.text}</p>
              </Prose>
            </section>
          ))}
        </div>
        <p className="mt-10 flex flex-wrap gap-6">
          <Link href={`/regions/${region.slug}`} className={textLink}>
            {region.name} desk
          </Link>
          <Link href="/stories" className={textLink}>
            All stories
          </Link>
        </p>
      </PageSection>
    </article>
  );
}
