import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { RoleList } from "@/components/pages/RoleList";
import { rolesIn, textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { regions, sampleFiguresNote } from "@/content/site";

export const metadata = pageMetadata({
  title: "Roles · BridgeWide",
  description:
    "Open software engineering roles across the USA, Canada, Latin America, and Europe. Salaries are labeled sample figures.",
  path: "/roles",
});

export default function RolesPage() {
  return (
    <>
      <PageHero
        eyebrow="Roles"
        title="Seats that are live this season."
        lede="Grouped by region. Each salary is a sample figure for the conversation, not an offer."
      >
        <nav aria-label="Jump to region">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {regions.map((region) => (
              <li key={region.slug}>
                <a
                  href={`#${region.slug}`}
                  className="font-mono text-xs tracking-[0.18em] text-brand uppercase no-underline hover:text-ink"
                >
                  {region.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHero>
      {regions.map((region) => (
        <PageSection
          key={region.slug}
          id={region.slug}
          label={`${region.code} · ${sampleFiguresNote}`}
          title={region.name}
          lede={region.summary}
        >
          <RoleList items={rolesIn(region.slug)} />
          <p className="mt-8">
            <Link href={`/regions/${region.slug}`} className={textLink}>
              {region.name} desk
            </Link>
          </p>
        </PageSection>
      ))}
    </>
  );
}
