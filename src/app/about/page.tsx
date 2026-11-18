import Image from "next/image";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { pageMetadata } from "@/components/pages/metadata";
import { images, people } from "@/content/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbs, desk } from "@/lib/structured-data";

export const metadata = pageMetadata({
  title: "About",
  description:
    "The BridgeWide desk: consultants who hire for the engineering work they used to do, across five regions.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: "About", path: "/about" }])} />
      <JsonLd data={desk()} />
      <PageHero
        eyebrow="About"
        title="A desk of people who have done the job."
        lede="BridgeWide is a staffing firm for companies that need software engineers. The consultants on this desk came from backend, platform, mobile, data, and engineering management."
        image={{
          src: images.desk,
          alt: "Photograph of the BridgeWide desk",
        }}
      />
      <PageSection id="people" label="People" title="The desk">
        <ul className="grid gap-10 md:grid-cols-2">
          {people.map((person) => (
            <li key={person.id} id={person.id} className="border-t border-brand pt-6">
              <article className="grid grid-cols-[7.5rem_1fr] gap-5">
                <Image
                  src={person.image}
                  alt=""
                  width={240}
                  height={300}
                  className="aspect-[4/5] w-full object-cover"
                />
                <div>
                <h3 className="font-display text-3xl text-ink">{person.name}</h3>
                <p className="mt-3 leading-7 text-ink-soft">{person.role}</p>
                <p className="mt-3 eyebrow">
                  {person.focus}
                </p>
                <p className="mt-4 text-ink">{person.placementCount} placements</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </PageSection>
    </>
  );
}
