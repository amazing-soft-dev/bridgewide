import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SplitWords } from "@/components/ui/SplitWords";
import { photoSecondaryClass, sectionContainer } from "@/components/ui/SectionHeading";
import { hero, images } from "@/content/site";

export function ClosingBand() {
  return (
    <section
      className="seam-left relative z-10 bg-ink pt-28 pb-24 text-cloud md:pt-36 md:pb-32"
      aria-labelledby="close-heading"
    >
      <div className="absolute inset-0">
        <Image
          src={images.close}
          alt="Close handshake between two people"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/72" aria-hidden />
      </div>
      <div className={`relative ${sectionContainer}`}>
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
            Start a search
          </p>
          <h2
            id="close-heading"
            className="mt-3 max-w-3xl font-display text-4xl leading-[1.02] tracking-tight text-cloud md:text-6xl"
          >
            <SplitWords text="Tell us the seat. We will stay until someone starts." />
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-cloud">
            The brief needs a manager, a stack, and a band you will actually
            offer. The desk takes it from there.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href={hero.primaryCta.href}>
              {hero.primaryCta.label}
            </Button>
            <Button
              href={hero.secondaryCta.href}
              variant="secondary"
              className={photoSecondaryClass}
            >
              {hero.secondaryCta.label}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
