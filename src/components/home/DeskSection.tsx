import Image from "next/image";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { images, people } from "@/content/site";

export default function DeskSection() {
  return (
    <section
      className="seam-right relative z-10 bg-ink pt-24 pb-24 text-cloud md:pt-28 md:pb-28"
      aria-labelledby="desk-heading"
    >
      <div className="absolute inset-0">
        <Image
          src={images.desk}
          alt="Two colleagues talking through work at a desk"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/78" aria-hidden />
      </div>
      <div className={`relative ${sectionContainer}`}>
        <SectionHeading
          id="desk-heading"
          tone="dark"
          eyebrow="People"
          title="The desk"
          lede="Former engineers and managers. Each consultant keeps a region or a discipline, and stays on the search until someone starts."
        />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {people.map((person) => (
            <RevealItem key={person.name} className="h-full">
              <article className="flex h-full flex-col border border-cloud/25 bg-ink/55 p-4">
                <h3 className="font-display text-2xl leading-tight text-cloud">
                  {person.name}
                </h3>
                <p className="mt-3 text-sm leading-6 text-cloud/90">{person.role}</p>
                <p className="mt-4 font-mono text-xs tracking-[0.14em] text-brand uppercase">
                  {person.focus}
                </p>
                <p className="mt-auto pt-6 font-mono text-xs tracking-wide text-cloud/80 uppercase">
                  {person.placementCount} placements
                </p>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
