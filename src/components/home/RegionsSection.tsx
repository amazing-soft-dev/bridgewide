import Image from "next/image";
import Link from "next/link";
import { HoverLift } from "@/components/ui/HoverLift";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { regions, type RegionSlug } from "@/content/site";

const regionAlt: Record<RegionSlug, string> = {
  usa: "New York skyline",
  canada: "Toronto skyline beside the lake",
  latam: "Rio de Janeiro from above",
  europe: "A London street",
};

export default function RegionsSection() {
  return (
    <section
      className="seam-right relative z-10 bg-cloud pt-24 pb-24 md:pt-28 md:pb-28"
      aria-labelledby="regions-heading"
    >
      <div className={sectionContainer}>
        <SectionHeading
          id="regions-heading"
          eyebrow="Coverage"
          title="Four regions"
          lede="Hybrid and remote seats, permanent and contract. Each region has its own desk."
        />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <RevealItem key={region.slug} className="h-full">
              <HoverLift className="h-full">
              <Link
                href={`/regions/${region.slug}`}
                className="group flex h-full flex-col bg-ink text-cloud no-underline"
              >
                <div className="relative aspect-[4/5] transform-gpu overflow-hidden bg-ink">
                  <Image
                    src={region.image}
                    alt={regionAlt[region.slug]}
                    fill
                    loading="lazy"
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 top-0 -bottom-px bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <p className="absolute bottom-3 left-4 font-mono text-xs tracking-[0.16em] text-brand uppercase">
                    {region.code}
                  </p>
                </div>
                <div className="relative -mt-px flex flex-1 flex-col gap-3 bg-ink p-4">
                  <h3 className="font-display text-2xl leading-tight text-cloud">
                    {region.name}
                  </h3>
                  <p className="text-sm leading-6 text-cloud/85">{region.summary}</p>
                  <p className="mt-auto font-mono text-xs tracking-[0.14em] text-brand uppercase">
                    {region.openRoleCount} open roles
                  </p>
                </div>
              </Link>
              </HoverLift>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
