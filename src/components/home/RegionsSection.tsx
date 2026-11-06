import { RegionTile } from "@/components/ui/RegionTile";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
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
      className="seam-left relative z-10 bg-cloud pt-24 pb-24 md:pt-28 md:pb-28"
      aria-labelledby="regions-heading"
    >
      <div className="wrap">
        <SectionHeading
          id="regions-heading"
          eyebrow="Coverage"
          title="Four regions"
          lede="Hybrid and remote seats, permanent and contract. Each region has its own desk."
        />
        <RevealGroup className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {regions.map((region) => (
            <RevealItem key={region.slug} className="h-full">
              <RegionTile
                variant="panel"
                href={`/regions/${region.slug}`}
                name={region.name}
                summary={region.summary}
                image={region.image}
                alt={regionAlt[region.slug]}
                code={region.code}
                meta={`${region.openRoleCount} open roles`}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
