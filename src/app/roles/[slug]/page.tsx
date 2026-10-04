import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { SampleNote } from "@/components/pages/SampleNote";
import { regionFor, textLink } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { Button } from "@/components/ui/Button";
import { getRole, roles } from "@/content/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return roles.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();
  const region = regionFor(role.region);

  return pageMetadata({
    title: `${role.title} · ${region.name} · BridgeWide`,
    description: role.summary,
    path: `/roles/${role.slug}`,
  });
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  const region = regionFor(role.region);
  const facts = [
    { term: "Region", detail: region.name },
    { term: "City", detail: role.city },
    { term: "Engagement", detail: `${role.engagement} · ${role.workMode}` },
    { term: "Discipline", detail: role.discipline },
    { term: "Consultant", detail: role.consultantName },
  ];

  return (
    <>
      <PageHero
        eyebrow={`${region.code} · ${role.city}`}
        title={role.title}
        lede={role.summary}
        meta={
          role.tags?.length ? (
            <span className="font-mono text-xs tracking-[0.18em] text-brand uppercase">
              {role.tags.join(" · ")}
            </span>
          ) : null
        }
      >
        <Button href="/employers">Hire engineers</Button>
        <Button href="/engineers" variant="secondary">
          Send a CV
        </Button>
      </PageHero>
      <PageSection id="role" label="The seat" title="What this search is">
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.term} className="border-t border-brand pt-4">
              <dt className="font-mono text-xs tracking-[0.18em] text-stone uppercase">{fact.term}</dt>
              <dd className="mt-2 text-lg text-ink">
                {fact.term === "Region" ? (
                  <Link href={`/regions/${region.slug}`} className={textLink}>
                    {fact.detail}
                  </Link>
                ) : (
                  fact.detail
                )}
              </dd>
            </div>
          ))}
          <div className="border-t border-brand pt-4">
            <dt className="font-mono text-xs tracking-[0.18em] text-stone uppercase">Salary</dt>
            <dd className="mt-2 text-lg text-ink">
              <SampleNote /> <span className="ml-2">{role.salary}</span>
            </dd>
          </div>
        </dl>
        <p className="mt-10">
          <Link href="/roles" className={textLink}>
            All roles
          </Link>
        </p>
      </PageSection>
    </>
  );
}
