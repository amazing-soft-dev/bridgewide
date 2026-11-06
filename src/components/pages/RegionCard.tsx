import { RegionTile } from "@/components/ui/RegionTile";
import type { Region } from "@/content/site";

export function RegionCard({ region }: { region: Region }) {
  return (
    <RegionTile
      variant="card"
      href={`/regions/${region.slug}`}
      name={region.name}
      summary={region.summary}
      image={region.image}
      alt={`Photograph for the ${region.name} desk`}
      code={region.code}
      meta={`${region.openRoleCount} open ${region.openRoleCount === 1 ? "role" : "roles"}`}
      sizes="(min-width: 768px) 50vw, 100vw"
    />
  );
}
