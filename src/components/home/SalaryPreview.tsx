import { Button } from "@/components/ui/Button";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { regions, salaryBands, sampleFiguresNote } from "@/content/site";

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function SalaryPreview() {
  const preview = salaryBands.disciplines.slice(0, 3);

  return (
    <section
      className="seam-left relative z-10 bg-cloud pt-24 pb-24 md:pt-28 md:pb-28"
      aria-labelledby="salary-heading"
    >
      <div className={sectionContainer}>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="salary-heading"
            eyebrow={salaryBands.edition}
            title="Salary guide"
            lede={`${salaryBands.basis}. Backend, frontend, and data are below. Cloud, mobile, and leadership are in the full guide.`}
          />
          <Button href="/salary-guide" variant="secondary">
            Full salary guide
          </Button>
        </div>
        <p className="mt-8 font-mono text-xs tracking-[0.18em] text-ink uppercase">
          {sampleFiguresNote}
        </p>
        <RevealGroup className="mt-6 grid gap-6">
          {preview.map((discipline) => (
            <RevealItem key={discipline.slug}>
              <article className="border-t border-ink/15 pt-5">
                <h3 className="font-display text-2xl text-ink">{discipline.label}</h3>
                <dl className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {regions.map((region) => {
                    const band = discipline.bands[region.slug];
                    return (
                      <div key={region.slug}>
                        <dt className="font-mono text-[11px] tracking-[0.14em] text-brand uppercase">
                          {region.code}
                        </dt>
                        <dd className="mt-1 text-lg text-ink">
                          {money.format(band.median)}
                        </dd>
                        <dd className="mt-1 text-sm text-ink-soft">
                          {money.format(band.low)}–{money.format(band.high)}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </article>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
