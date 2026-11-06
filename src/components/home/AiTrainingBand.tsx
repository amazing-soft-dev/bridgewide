import Link from "next/link";

import { Button } from "@/components/ui/Button";

export function AiTrainingBand() {
  return (
    <section
      id="ai-training"
      aria-labelledby="ai-training-heading"
      data-header-tone="light"
      className="relative z-10 bg-cloud pt-20 pb-24 text-ink seam-left"
    >
      <div className="wrap">
        <p className="eyebrow">AI training</p>
        <h2
          id="ai-training-heading"
          className="font-display mt-3 max-w-3xl text-4xl leading-[1.05] md:text-6xl"
        >
          <Link href="/ai-training" className="text-ink no-underline hover:text-ink-soft">
            Get paid to train the world’s best AI
          </Link>
        </h2>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft">
          One application for the roles those platforms post: software, data, AI, writing, STEM,
          multilingual work, and other specialist tracks. Remote, paid in USD by the platform,
          including the United States.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/ai-training/for-candidates">Apply</Button>
          <Button href="/ai-training/for-partners" variant="secondary">
            For partners
          </Button>
        </div>
      </div>
    </section>
  );
}
