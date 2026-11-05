import Image from "next/image";
import Link from "next/link";
import { pageWrap } from "@/components/pages/format";
import { trainingRegions } from "@/content/ai-training";

export function TrainingRegions() {
  return (
    <section id="regions" aria-labelledby="regions-heading" className="scroll-mt-24 border-t border-cloud-soft bg-cloud text-ink">
      <div className={`${pageWrap} py-16 md:py-24`}>
        <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">Regions</p>
        <h2 id="regions-heading" className="font-display mt-3 max-w-3xl text-3xl leading-tight md:text-5xl">
          Real pages, not a location swap.
        </h2>
        <ul className="mt-10 grid list-none grid-cols-1 gap-4 p-0 min-[700px]:grid-cols-6">
          {trainingRegions.map((region, index) => (
            <li key={region.slug} className={index < 2 ? "min-[700px]:col-span-3" : "min-[700px]:col-span-2"}>
              <Link
                href={`/ai-training/${region.slug}`}
                className={`group relative block overflow-hidden text-cloud no-underline aspect-[16/11] ${
                  index < 2 ? "" : "min-[700px]:aspect-[3/4]"
                }`}
              >
                <Image
                  src={region.image}
                  alt=""
                  fill
                  sizes={index < 2 ? "(max-width: 699px) 100vw, 50vw" : "(max-width: 699px) 100vw, 33vw"}
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/10" />
                <span className="absolute inset-x-0 bottom-0 grid gap-2 p-5">
                  <span className="font-display text-3xl leading-none">{region.name}</span>
                  <span className="text-sm leading-6 text-cloud/90">{region.summary}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
