import { notFound } from "next/navigation";
import { regionFor } from "@/components/pages/format";
import { pageMetadata } from "@/components/pages/metadata";
import { RoleApply } from "@/components/roles/RoleApply";
import { RelatedRoles, RoleCopy } from "@/components/roles/RoleCopy";
import { RoleHero } from "@/components/roles/RoleHero";
import { deskWrap } from "@/components/roles/desk";
import { JsonLd } from "@/components/seo/JsonLd";
import { getRole, roles } from "@/content/site";
import { relatedRoles, roleRef } from "@/lib/role-desk";
import { breadcrumbs, jobPosting } from "@/lib/structured-data";

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
    title: `${role.title} · ${region.name}`,
    description: role.summary,
    path: `/roles/${role.slug}`,
  });
}

export default async function RolePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const role = getRole(slug);
  if (!role) notFound();

  const region = regionFor(role.region);
  const refCode = roleRef(role.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbs([
          { name: "Roles", path: "/roles" },
          { name: role.title, path: `/roles/${role.slug}` },
        ])}
      />
      <JsonLd data={jobPosting(role)} />
      <RoleHero role={role} regionName={region.name} image={region.image} refCode={refCode} />
      <section className="bg-cloud text-ink">
        <div
          className={`${deskWrap} grid items-start gap-7 pt-[clamp(40px,6vh,72px)] min-[1024px]:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] min-[1024px]:gap-[clamp(28px,5vw,80px)]`}
        >
          <RoleCopy role={role} />
          <RoleApply role={role} refCode={refCode} />
        </div>
        <div className={deskWrap}>
          <RelatedRoles roles={relatedRoles(role)} regionName={region.name} />
        </div>
      </section>
    </>
  );
}
