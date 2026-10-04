import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { RegionCard } from "@/components/pages/RegionCard";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { pageMetadata } from "@/components/pages/metadata";
import { regions } from "@/content/site";

export const metadata = pageMetadata({
  title: "Regions · BridgeWide",
  description:
    "Four desks for hiring software engineers: the United States, Canada, Latin America, and Europe.",
  path: "/regions",
});

export default function RegionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Regions"
        title="Four desks. One search if you want the comparison."
        lede="Hybrid seats where the team sits together, and remote seats where the hours overlap. Each region has its own consultant coverage."
      />
      <PageSection id="desks" label="Desks" title="Where we hire">
        <RevealGroup className="grid gap-12 md:grid-cols-2">
          {regions.map((region) => (
            <RevealItem key={region.slug}>
              <RegionCard region={region} />
            </RevealItem>
          ))}
        </RevealGroup>
      </PageSection>
    </>
  );
}
