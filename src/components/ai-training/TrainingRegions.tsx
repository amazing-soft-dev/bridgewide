import { RegionTile } from "@/components/ui/RegionTile";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trainingRegions } from "@/content/ai-training";

export function TrainingRegions() {
  return (
    <section id="regions" aria-labelledby="regions-heading" className="scroll-mt-24 border-t border-cloud-soft bg-cloud text-ink">
      <div className="wrap py-16 md:py-24">
        <SectionHeading id="regions-heading" eyebrow="Regions" title="Real pages, not a location swap." />
        <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 min-[700px]:grid-cols-6">
          {trainingRegions.map((region, index) => {
            const wide = index < 2;
            return (
              <li key={region.slug} className={wide ? "min-[700px]:col-span-3" : "min-[700px]:col-span-2"}>
                <RegionTile
                  variant="photo"
                  href={`/ai-training/${region.slug}`}
                  name={region.name}
                  summary={region.summary}
                  image={region.image}
                  alt=""
                  sizes={wide ? "(max-width: 699px) 100vw, 50vw" : "(max-width: 699px) 100vw, 33vw"}
                  aspectClassName={wide ? "aspect-[16/11]" : "aspect-[16/11] min-[700px]:aspect-[3/4]"}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
