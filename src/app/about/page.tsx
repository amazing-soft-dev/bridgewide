import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { SampleNote } from "@/components/pages/SampleNote";
import { pageMetadata } from "@/components/pages/metadata";
import { images, people, sampleFiguresNote } from "@/content/site";

export const metadata = pageMetadata({
  title: "About · BridgeWide",
  description:
    "The BridgeWide desk: consultants who hire for the engineering work they used to do, across four regions.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A desk of people who have done the job."
        lede="BridgeWide is a staffing firm for companies that need software engineers. The consultants on this desk came from backend, platform, mobile, data, and engineering management."
        image={{
          src: images.desk,
          alt: "Photograph of the BridgeWide desk",
        }}
      />
      <PageSection
        id="people"
        label={sampleFiguresNote}
        title="The desk"
        lede="Names, focus, and placement counts on this page are sample figures."
      >
        <ul className="grid gap-10 md:grid-cols-2">
          {people.map((person) => (
            <li key={person.name} className="border-t border-brand pt-6">
              <article>
                <h3 className="font-display text-3xl text-ink">{person.name}</h3>
                <p className="mt-3 leading-7 text-ink-soft">{person.role}</p>
                <p className="mt-3 font-mono text-xs tracking-[0.18em] text-brand uppercase">
                  {person.focus}
                </p>
                <p className="mt-4 text-ink">
                  <SampleNote />{" "}
                  <span className="ml-2">
                    {person.placementCount} placements
                  </span>
                </p>
              </article>
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  );
}
