import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { formatUsd } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { regions, salaryBands } from "@/content/site";

export const metadata = pageMetadata({
  title: "Salary guide · BridgeWide",
  description: `${salaryBands.edition}. Salary bands by region for backend, frontend, data, cloud, mobile, and engineering leadership. ${salaryBands.basis}.`,
  path: "/salary-guide",
});

export default function SalaryGuidePage() {
  return (
    <>
      <PageHero
        eyebrow="Salary guide"
        title={salaryBands.edition}
        lede={`${salaryBands.basis}. Low, median, and high for each discipline, compared in the region where the engineer will be employed. Equity and local rules sit beside these bands.`}
      />
      <PageSection
        id="bands"
        label="Bands"
        title="Bands by region"
        lede="Use a band to set an offer conversation. A figure under the median should be said early, before a shortlist goes out."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <caption className="sr-only">
              {salaryBands.edition}. {salaryBands.basis}. Low, high, and median
              for every discipline in each region.
            </caption>
            <thead>
              <tr className="border-b border-brand">
                <th scope="col" className="py-3 pr-4 font-mono text-xs tracking-[0.18em] text-stone uppercase">
                  Discipline
                </th>
                {regions.map((region) => (
                  <th
                    key={region.slug}
                    scope="col"
                    className="px-3 py-3 font-mono text-xs tracking-[0.18em] text-brand uppercase"
                  >
                    {region.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {salaryBands.disciplines.map((discipline) => (
                <tr key={discipline.slug} className="border-b border-cloud-soft align-top transition-colors hover:bg-white/60">
                  <th scope="row" className="py-4 pr-4 font-display text-xl text-ink">
                    {discipline.label}
                  </th>
                  {regions.map((region) => {
                    const band = discipline.bands[region.slug];
                    return (
                      <td key={region.slug} className="px-3 py-4 text-sm leading-6 text-ink">
                        <span className="block">
                          {formatUsd(band.low)}–{formatUsd(band.high)}
                        </span>
                        <span className="font-mono text-xs tracking-wide text-stone">
                          Median {formatUsd(band.median)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </PageSection>
    </>
  );
}
