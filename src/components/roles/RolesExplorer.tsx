"use client";

import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { deskWrap } from "@/components/roles/desk";
import { Button } from "@/components/ui/Button";
import { RoleTicketRow } from "@/components/roles/RoleTicketRow";
import { regions, roles, rolesListedOn, type Role } from "@/content/site";
import { isRoleOpen } from "@/lib/desk-clock";
import { formatCompactSalary } from "@/components/pages/format";
import {
  filterRoles,
  firstTag,
  isNewTag,
  listedAge,
  placeLine,
  postedLabel,
  uniqueInOrder,
} from "@/lib/role-desk";

const engagements = uniqueInOrder(roles.map((role) => role.engagement));
const cities = uniqueInOrder(roles.map((role) => role.city));

function readQuery(search: string) {
  const params = new URLSearchParams(search);
  const region = params.get("r") ?? "";
  const engagement = params.get("t") ?? "";
  const city = params.get("l") ?? "";
  return {
    q: params.get("q") ?? "",
    region: regions.some((item) => item.slug === region) ? region : "",
    engagement: engagements.includes(engagement) ? engagement : "",
    city: cities.includes(city) ? city : "",
  };
}

function subscribeToQuery(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener("roles-query", onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener("roles-query", onStoreChange);
  };
}

function writeQuery(next: { q: string; region: string; engagement: string; city: string }) {
  const params = new URLSearchParams(window.location.search);
  const set = (key: string, value: string) => {
    if (value.trim()) params.set(key, value.trim());
    else params.delete(key);
  };
  set("q", next.q);
  set("r", next.region);
  set("t", next.engagement);
  set("l", next.city);
  const query = params.toString();
  const url = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new Event("roles-query"));
}

export function RolesExplorer() {
  const search = useSyncExternalStore(subscribeToQuery, () => window.location.search, () => "");
  const query = useMemo(() => readQuery(search), [search]);
  const [age, setAge] = useState(postedLabel(rolesListedOn));

  useEffect(() => {
    const id = requestAnimationFrame(() => setAge(listedAge(rolesListedOn)));
    return () => cancelAnimationFrame(id);
  }, []);

  const visible = useMemo(
    () => filterRoles(roles, query),
    [query],
  );

  const update = (patch: Partial<typeof query>) => {
    writeQuery({ ...query, ...patch });
  };

  const clear = () => writeQuery({ q: "", region: "", engagement: "", city: "" });

  return (
    <section className="bg-cloud pb-[clamp(72px,10vh,120px)] text-ink" aria-label="Open roles">
      <div className={deskWrap}>
        <div className="relative z-[5] grid grid-cols-2 items-stretch gap-2.5 rounded-[10px] border border-cloud-soft bg-white/92 p-2.5 shadow-[0_16px_40px_color-mix(in_srgb,var(--color-ink)_6%,transparent)] backdrop-blur-md min-[900px]:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
          <label className="col-span-2 flex min-h-[52px] items-center gap-2.5 rounded-md bg-cloud px-3.5 text-stone focus-within:shadow-[inset_0_0_0_2px_var(--color-brand)] min-[900px]:col-span-1">
            <span className="sr-only">Search</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <input
              value={query.q}
              onChange={(event) => update({ q: event.target.value })}
              placeholder="Job title, skill or keyword"
              className="min-w-0 flex-1 border-0 bg-transparent text-base text-ink outline-none placeholder:text-stone"
            />
            {query.q ? (
              <button
                type="button"
                className="border-0 bg-transparent text-xl leading-none text-stone"
                onClick={() => update({ q: "" })}
                aria-label="Clear search"
              >
                ×
              </button>
            ) : null}
          </label>
          <Select label="Engagement" value={query.engagement} onChange={(engagement) => update({ engagement })}>
            <option value="">All types</option>
            {engagements.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <Select label="City" value={query.city} onChange={(city) => update({ city })}>
            <option value="">Anywhere</option>
            {cities.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <p className="col-span-2 flex items-center gap-2 px-1 pt-1 font-mono text-xs tracking-[0.14em] text-stone uppercase min-[900px]:col-span-1 min-[900px]:px-3.5 min-[900px]:pt-0">
            <b className="font-display text-[26px] tracking-[-0.03em] text-ink">{visible.length}</b>
            roles
          </p>
        </div>

        <div className="mt-4 mb-6 flex flex-wrap gap-1.5">
          <Pill
            on={query.region === ""}
            count={roles.length}
            onClick={() => update({ region: "" })}
          >
            All
          </Pill>
          {regions.map((item) => (
            <Pill
              key={item.slug}
              on={query.region === item.slug}
              count={roles.filter((role) => role.region === item.slug && isRoleOpen(role)).length}
              onClick={() => update({ region: item.slug })}
            >
              {item.name === "United States" ? "USA" : item.name === "Latin America" ? "LATAM" : item.name}
            </Pill>
          ))}
        </div>

        {visible.length ? (
          <ol key={`${query.q}|${query.region}|${query.engagement}|${query.city}`} className="m-0 grid list-none gap-1.5 p-0">
            {visible.map((role, index) => (
              <li
                key={role.slug}
                data-motion="enter"
                className="motion-safe:animate-hero-row-in"
                style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
              >
                <RoleTicketRow role={role} age={age} />
              </li>
            ))}
          </ol>
        ) : (
          <div className="grid justify-items-start gap-3.5 rounded-[10px] border-[1.5px] border-dashed border-cloud-soft bg-white px-7 py-9">
            <p className="m-0 max-w-[560px] text-base leading-relaxed text-ink-soft">
              Nothing matches those filters. Try fewer words, or send a CV and a consultant will
              call when a seat opens.
            </p>
            <button
              type="button"
              onClick={clear}
              className="border-0 border-b border-current bg-transparent p-0 font-mono text-xs tracking-[0.14em] text-brand uppercase"
            >
              Clear filters
            </button>
          </div>
        )}

        <aside className="mt-7 flex flex-col items-start justify-between gap-6 rounded-[10px] bg-ink px-7 py-6 text-white [clip-path:polygon(0_0,calc(100%-18px)_0,100%_18px,100%_100%,0_100%)] min-[900px]:flex-row min-[900px]:items-center">
          <div>
            <b className="font-display text-2xl tracking-[-0.03em]">Not seeing it yet?</b>
            <p className="mt-1.5 max-w-[600px] text-sm leading-normal text-white/80">
              Most seats are filled before they are listed. Send a CV and a consultant calls when
              the right one opens.
            </p>
          </div>
          <Button href="/engineers">Send a CV</Button>
        </aside>
      </div>
    </section>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label className="relative grid min-h-[52px] min-w-0 content-center rounded-md bg-cloud py-1.5 pr-9 pl-3.5 focus-within:shadow-[inset_0_0_0_2px_var(--color-brand)] after:pointer-events-none after:absolute after:top-1/2 after:right-4 after:mt-[-5px] after:h-[7px] after:w-[7px] after:rotate-45 after:border-r-[1.5px] after:border-b-[1.5px] after:border-ink after:content-['']">
      <span className="font-mono text-xs tracking-[0.16em] text-stone uppercase">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="cursor-pointer appearance-none border-0 bg-transparent py-0.5 text-sm text-ink outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function Pill({
  on,
  count,
  onClick,
  children,
}: {
  on: boolean;
  count: number;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-2 font-mono text-xs tracking-[0.12em] uppercase transition-[background,color,border-color] duration-300 ${
        on
          ? "border-ink bg-ink text-white"
          : "border-cloud-soft bg-white text-ink hover:border-ink"
      }`}
    >
      {children}
      <em
        className={`rounded-[3px] px-1.5 py-0.5 text-xs not-italic ${
          on ? "bg-brand text-white" : "bg-cloud text-stone"
        }`}
      >
        {count}
      </em>
    </button>
  );
}

