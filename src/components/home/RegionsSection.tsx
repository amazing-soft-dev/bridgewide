import { RegionTile } from "@/components/ui/RegionTile";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { openRoleCount, regions, type RegionSlug } from "@/content/site";

const regionAlt: Record<RegionSlug, string> = {
  usa: "Manhattan skyline and the Brooklyn Bridge over the East River",
  canada: "The Toronto skyline and CN Tower across Lake Ontario at golden hour",
  latam: "Paseo de la Reforma and the Mexico City skyline from the air",
  europe: "The River Thames and St Paul's Cathedral in London from the air",
  asia: "Marina Bay and the Singapore financial district at dusk",
};

/**
 * The bento order: the three remote regions share the first row, and the
 * two hybrid desks take a half each on the second. Phones stack in the same
 * order.
 */
const bento: readonly { slug: RegionSlug; span: string; aspect: string; sizes: string }[] = [
  { slug: "latam", span: "md:col-span-2", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 33vw, 100vw" },
  { slug: "europe", span: "md:col-span-2", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 33vw, 100vw" },
  { slug: "asia", span: "md:col-span-2", aspect: "aspect-[4/5]", sizes: "(min-width: 768px) 33vw, 100vw" },
  { slug: "usa", span: "md:col-span-3", aspect: "aspect-[4/5] md:aspect-[16/10]", sizes: "(min-width: 768px) 50vw, 100vw" },
  { slug: "canada", span: "md:col-span-3", aspect: "aspect-[4/5] md:aspect-[16/10]", sizes: "(min-width: 768px) 50vw, 100vw" },
];

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
          title="Five regions"
          lede="Hybrid and remote seats, permanent and contract. Each region has its own desk."
        />
        <RevealGroup className="mt-12 grid gap-4 md:grid-cols-6">
          {bento.map(({ slug, span, aspect, sizes }) => {
            const region = regions.find((entry) => entry.slug === slug);
            if (!region) return null;
            return (
              <RevealItem key={slug} className={span}>
                <RegionTile
                  variant="bento"
                  href={`/regions/${slug}`}
                  name={region.name}
                  summary={region.summary}
                  image={region.image}
                  alt={regionAlt[slug]}
                  code={region.code}
                  meta={`${openRoleCount(slug)} open roles`}
                  sizes={sizes}
                  aspectClassName={aspect}
                />
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
