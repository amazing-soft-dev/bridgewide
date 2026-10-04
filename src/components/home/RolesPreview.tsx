import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HoverLift } from "@/components/ui/HoverLift";
import { RevealItem, RevealGroup } from "@/components/ui/Reveal";
import { SectionHeading, sectionContainer } from "@/components/ui/SectionHeading";
import { getRegion, roles, sampleFiguresNote } from "@/content/site";

export default function RolesPreview() {
  const preview = roles.slice(0, 4);

  return (
    <section
      className="seam-right relative z-10 bg-cloud pt-24 pb-24 md:pt-28 md:pb-28"
      aria-labelledby="roles-heading"
    >
      <div className={sectionContainer}>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            id="roles-heading"
            eyebrow="Now hiring"
            title="Open roles"
            lede="Four of the seats that are live. The full list is on the roles page."
          />
          <Button href="/roles" variant="secondary">
            See all roles
          </Button>
        </div>
        <p className="mt-8 font-mono text-xs tracking-[0.16em] text-ink uppercase">
          {sampleFiguresNote}
        </p>
        <RevealGroup className="mt-4 divide-y divide-ink/15 border-y border-ink/15">
          {preview.map((role) => {
            const code = getRegion(role.region)?.code;
            return (
              <RevealItem key={role.slug}>
                <HoverLift>
                <article className="grid gap-4 py-6 md:grid-cols-[minmax(0,1.4fr)_auto_auto] md:items-baseline md:gap-8">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl leading-tight text-ink">
                        <Link
                          href={`/roles/${role.slug}`}
                          className="text-ink no-underline decoration-brand underline-offset-4 hover:text-brand hover:underline"
                        >
                          {role.title}
                        </Link>
                      </h3>
                      {role.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[11px] tracking-[0.14em] text-brand uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 font-mono text-xs tracking-wide text-ink-soft uppercase">
                      {role.city}
                      {code ? ` · ${code}` : ""} · {role.workMode} · {role.engagement}
                    </p>
                  </div>
                  <p className="text-sm text-ink-soft">{role.discipline}</p>
                  <p className="text-sm text-ink">
                    <span className="mb-1 block font-mono text-[11px] tracking-[0.14em] text-ink uppercase md:text-right">
                      {sampleFiguresNote}
                    </span>
                    <span className="md:block md:text-right">{role.salary}</span>
                  </p>
                </article>
                </HoverLift>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
