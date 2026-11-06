import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";
import { trainingMission } from "@/content/ai-training";

export function MissionBand() {
  return (
    <section id="mission" aria-labelledby="mission-heading" className="relative scroll-mt-24 overflow-hidden bg-ink text-cloud">
      <Image src="/images/training-mission.webp" alt="" fill priority={false} sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(17_17_17/0.88)_0%,rgb(17_17_17/0.78)_48%,rgb(17_17_17/0.9)_100%)]" aria-hidden />
      <div className={`relative py-16 md:py-24 wrap`}>
        <p className="eyebrow">
          <SplitWords text="Mission" />
        </p>
        <h2 id="mission-heading" className="font-display mt-3 max-w-3xl text-3xl leading-tight md:text-5xl">
          <SplitWords text="Close the gap." delay={0.06} />
        </h2>
        <Reveal delay={0.12}>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-cloud-soft">{trainingMission}</p>
        </Reveal>
      </div>
    </section>
  );
}
