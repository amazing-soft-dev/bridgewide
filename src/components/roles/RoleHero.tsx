"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AccentLine } from "@/components/roles/AccentLine";
import { deskWrap } from "@/components/roles/desk";
import { useEntered } from "@/hooks/use-entered";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useScrollFrame } from "@/hooks/scroll-frame";
import { Button } from "@/components/ui/Button";
import { formatCompactSalary } from "@/components/pages/format";
import type { Role } from "@/content/site";
import { firstTag, isNewTag, placeLine, postedLabel } from "@/lib/role-desk";

export function RoleHero({
  role,
  regionName,
  image,
  refCode,
  closed = false,
}: {
  role: Role;
  regionName: string;
  image: string;
  refCode: string;
  closed?: boolean;
}) {
  const on = useEntered();
  const reduced = usePrefersReducedMotion();
  const [copied, setCopied] = useState(false);
  const [shift, setShift] = useState(0);
  const tag = firstTag(role);

  useScrollFrame(() => {
    const next = Math.min(1, window.scrollY / 800) * 60;
    return () => setShift(next);
  }, !reduced);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 1800);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <header data-header-tone="dark" className="relative overflow-hidden bg-ink pt-[calc(var(--header-h)+clamp(36px,6vh,72px))] pb-[clamp(48px,7vh,80px)] text-white max-[899px]:pt-[calc(var(--header-h)+28px)]">
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute inset-[-6%_0_0_0]" style={{ translate: `0 ${shift}px` }}>
          <Image
            src={image}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover saturate-[0.7] brightness-[0.55]"
          />
        </div>
        <span className="absolute inset-0 bg-[linear-gradient(100deg,color-mix(in_srgb,var(--color-ink)_94%,transparent),color-mix(in_srgb,var(--color-ink)_70%,transparent)_55%,color-mix(in_srgb,var(--color-ink)_45%,transparent))]" />
      </div>
      <div className={`${deskWrap} relative grid gap-4`}>
        <nav aria-label="Breadcrumb" className="font-mono text-xs tracking-[0.16em] text-white/80 uppercase">
          <ol className="m-0 flex list-none flex-wrap items-center gap-2.5 p-0">
            <li>
              <Link href="/" className="text-inherit no-underline hover:text-white">
                Home
              </Link>
            </li>
            <CrumbDivider />
            <li>
              <Link href="/roles" className="text-inherit no-underline hover:text-white">
                Roles
              </Link>
            </li>
            <CrumbDivider />
            <li>
              <span aria-current="page" className="inline-block max-w-[40ch] truncate text-white">
                {role.title}
              </span>
            </li>
          </ol>
        </nav>
        <p
          data-motion="reveal"
          className={`m-0 flex flex-wrap items-center gap-3 font-mono text-xs tracking-[0.14em] text-white/80 uppercase transition duration-700 ${
            on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
          }`}
        >
          <span className="rounded-[3px] border border-brand px-2 py-1 text-white">{role.boardCode}</span>
          {regionName}
          <em className="text-white/80 not-italic">Ref {refCode}</em>
        </p>
        <h1 className="font-display max-w-[16ch] text-[clamp(40px,5.2vw,84px)] leading-[0.98] tracking-[-0.04em] text-white">
          <AccentLine text={role.title} on={on} tone="dark" />
        </h1>
        <ul
          data-motion="reveal"
          className={`m-0 flex list-none flex-wrap gap-2 p-0 font-mono text-xs tracking-[0.1em] uppercase transition duration-700 delay-200 ${
            on ? "translate-y-0 opacity-100" : "translate-y-2.5 opacity-0"
          }`}
        >
          <li className="rounded border border-white/15 bg-white/10 px-3 py-2">
            <b className="font-display text-lg tracking-[-0.02em] normal-case">
              {formatCompactSalary(role.salaryMin, role.salaryUnit)}
            </b>
          </li>
          <li className="rounded border border-white/15 bg-white/10 px-3 py-2">{placeLine(role)}</li>
          <li className="rounded border border-white/15 bg-white/10 px-3 py-2">{role.engagement}</li>
          {role.noticePeriod ? (
            <li className="rounded border border-white/15 bg-white/10 px-3 py-2">Notice {role.noticePeriod}</li>
          ) : null}
          <li className="rounded border border-white/15 bg-white/10 px-3 py-2">Posted {postedLabel(role.postedOn)}</li>
          {closed ? (
            <li className="rounded border border-brand bg-brand px-3 py-2">Closed</li>
          ) : null}
          {tag ? (
            <li className={`rounded border px-3 py-2 ${isNewTag(tag) ? "border-brand bg-brand" : "border-white/15 bg-white/10"}`}>
              {tag}
            </li>
          ) : null}
        </ul>
        <div
          data-motion="reveal"
          className={`mt-1 flex flex-wrap items-center gap-4 transition duration-700 delay-300 ${
            on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          {closed ? (
            <Button href={`/contact?region=${role.region}#keep-profile`}>Keep your profile</Button>
          ) : (
            <Button
              href="#apply"
              onClick={(event) => {
                event.preventDefault();
                document.getElementById("apply")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              Apply now
            </Button>
          )}
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href).then(
                () => setCopied(true),
                () => setCopied(false),
              );
            }}
            className="border-0 border-b border-white/40 bg-transparent px-0 py-1.5 font-mono text-xs tracking-[0.14em] text-white uppercase hover:border-white"
          >
            {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </div>
    </header>
  );
}

function CrumbDivider() {
  return (
    <li aria-hidden className="inline-flex">
      <i className="block h-px w-6 bg-current opacity-60" />
    </li>
  );
}
