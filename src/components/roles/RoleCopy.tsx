import Link from "next/link";
import { cutMd } from "@/components/roles/desk";
import { formatCompactSalary, regionFor } from "@/components/pages/format";
import type { Role } from "@/content/site";
import { firstTag, placeLine } from "@/lib/role-desk";

const blocks = [
  { index: "00", title: "The role", kind: "summary" },
  { index: "01", title: "What you would do", kind: "duties" },
  { index: "02", title: "What you bring", kind: "requirements" },
  { index: "03", title: "What you get", kind: "benefits" },
] as const;

export function RoleCopy({ role }: { role: Role }) {
  return (
    <div className="grid gap-[18px]">
      {blocks.map((block) => (
        <article
          key={block.index}
          className={`rounded-[10px] border border-cloud-soft bg-white px-7 py-6 max-[899px]:px-5 ${cutMd}`}
        >
          <h2 className="font-display m-0 mb-4 flex items-baseline gap-3.5 text-[clamp(22px,2vw,30px)] tracking-[-0.03em]">
            <span className="font-mono text-xs tracking-[0.14em] text-brand">{block.index}</span>
            {block.title}
          </h2>
          {block.kind === "summary" ? (
            <p className="m-0 text-lg leading-relaxed text-ink">{role.summary}</p>
          ) : (
            <ol className="m-0 grid list-none p-0">
              {role[block.kind].map((line, index) => (
                <li
                  key={line}
                  className="grid grid-cols-[40px_minmax(0,1fr)] gap-2.5 border-t border-dashed border-cloud-soft py-3.5 text-base leading-normal"
                >
                  <i className="pt-1 font-mono text-xs tracking-[0.12em] text-stone not-italic">
                    {String(index + 1).padStart(2, "0")}
                  </i>
                  {line}
                </li>
              ))}
            </ol>
          )}
        </article>
      ))}
    </div>
  );
}

export function RelatedRoles({
  roles: items,
  regionName,
}: {
  roles: readonly Role[];
  regionName: string;
}) {
  if (items.length === 0) return null;

  return (
    <div className="pt-[clamp(56px,8vh,96px)] pb-[clamp(72px,10vh,120px)]">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h2 className="font-display m-0 text-[clamp(26px,2.8vw,42px)] tracking-[-0.035em]">
          More roles in {regionName}
        </h2>
        <Link
          href="/roles"
          className="font-mono text-xs tracking-[0.14em] text-brand uppercase no-underline"
        >
          All open roles →
        </Link>
      </div>
      <ul className="m-0 grid list-none gap-3 p-0 min-[900px]:grid-cols-3">
        {items.map((role) => {
          const place = regionFor(role.region);
          return (
            <li key={role.slug}>
              <Link
                href={`/roles/${role.slug}`}
                className={`grid gap-2.5 rounded-[10px] border border-cloud-soft bg-white p-5 text-ink no-underline transition duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1.5 hover:shadow-[0_24px_50px_color-mix(in_srgb,var(--color-ink)_12%,transparent)] ${cutMd}`}
              >
                <span className="justify-self-start rounded-[3px] border border-[color-mix(in_srgb,var(--color-brand)_45%,transparent)] px-2 py-1 font-mono text-xs tracking-[0.12em] text-brand">
                  {role.boardCode}
                </span>
                <b className="font-display text-xl leading-tight tracking-[-0.02em]">{role.title}</b>
                <span className="font-mono text-xs tracking-[0.06em] text-stone">
                  {place.name} · {placeLine(role)} · {role.engagement}
                  {firstTag(role) ? ` · ${firstTag(role)}` : ""}
                </span>
                <span className="border-t border-dashed border-cloud-soft pt-2 text-lg tracking-[-0.02em]">
                  {formatCompactSalary(role.salaryMin, role.salaryUnit)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
