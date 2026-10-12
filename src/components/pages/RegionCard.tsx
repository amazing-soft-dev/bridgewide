import Link from "next/link";
import { ContentImage } from "@/components/pages/ContentImage";
import { textLink } from "@/components/pages/format";
import { HoverLift } from "@/components/ui/HoverLift";
import type { Region } from "@/content/site";

export function RegionCard({ region }: { region: Region }) {
  return (
    <HoverLift>
    <article className="grid content-start gap-4">
      <ContentImage
        src={region.image}
        alt={`Photograph for the ${region.name} desk`}
        sizes="(min-width: 768px) 50vw, 100vw"
        className="aspect-[4/3] transform-gpu"
      />
      <p className="font-mono text-xs tracking-[0.18em] text-brand uppercase">{region.code}</p>
      <h3 className="font-display text-3xl text-ink">
        <Link href={`/regions/${region.slug}`} className={textLink}>
          {region.name}
        </Link>
      </h3>
      <p className="leading-7 text-ink-soft">{region.summary}</p>
      <p className="font-mono text-xs tracking-[0.18em] text-stone uppercase">
        {region.openRoleCount} open {region.openRoleCount === 1 ? "role" : "roles"}
      </p>
    </article>
    </HoverLift>
  );
}
