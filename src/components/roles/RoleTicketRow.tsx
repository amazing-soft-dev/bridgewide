import { formatCompactSalary } from "@/components/pages/format";
import { RoleTicket } from "@/components/ui/RoleTicket";
import type { Role } from "@/content/site";
import { firstTag, isNewTag, placeLine } from "@/lib/role-desk";

/**
 * A site role as one ticket row: code, title, summary, then place,
 * engagement, pay, tag, and the optional "listed" age. Used by the roles
 * desk, the region pages, and the home preview.
 */
export function RoleTicketRow({
  role,
  age,
  heading,
}: {
  role: Role;
  /** "Listed 3 weeks ago", shown on the widest layout. */
  age?: string;
  /** Heading level for the title when the row sits in a list of its own. */
  heading?: "h2" | "h3";
}) {
  const tag = firstTag(role);

  return (
    <RoleTicket
      href={`/roles/${role.slug}`}
      code={role.boardCode}
      title={role.title}
      summary={role.summary}
      heading={heading}
      className="grid-cols-[40px_minmax(0,1fr)_auto] min-[900px]:grid-cols-[44px_minmax(0,1fr)_120px_90px_20px] min-[900px]:gap-3.5 min-[900px]:px-[18px] min-[1200px]:grid-cols-[48px_minmax(0,1fr)_130px_92px_116px_120px_70px_20px]"
    >
      <span className="hidden font-mono text-xs tracking-[0.04em] text-stone min-[900px]:block">
        {placeLine(role)}
      </span>
      <span className="hidden font-mono text-xs tracking-[0.04em] text-stone min-[1200px]:block">
        {role.engagement}
      </span>
      <span className="text-[15px] font-bold tracking-[-0.02em] min-[900px]:text-[17px]">
        {formatCompactSalary(role.salaryMin, role.salaryUnit)}
      </span>
      {tag ? (
        <span
          className={`hidden max-w-full justify-self-start rounded-[3px] px-1.5 py-1 font-mono text-xs tracking-[0.12em] uppercase min-[1200px]:inline-block ${
            isNewTag(tag) ? "bg-brand text-white" : "bg-cloud text-stone"
          }`}
        >
          {tag}
        </span>
      ) : (
        <span className="hidden min-[1200px]:block" />
      )}
      <span className="hidden font-mono text-xs tracking-[0.08em] text-stone uppercase min-[1200px]:block">
        {age}
      </span>
    </RoleTicket>
  );
}
