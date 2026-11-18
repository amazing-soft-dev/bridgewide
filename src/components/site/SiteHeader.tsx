import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { HeaderShell } from "@/components/site/HeaderShell";
import { SearchButton, SearchDrawer, type SearchRole } from "@/components/site/HeaderSearch";
import { MobileNav } from "@/components/site/MobileNav";
import { Button } from "@/components/ui/Button";
import { trainingRoles } from "@/content/ai-training";
import { contact, getAnnouncement, nav, roles } from "@/content/site";
import { isRoleOpen } from "@/lib/desk-clock";
import "./header.css";

const searchRoles: readonly SearchRole[] = [
  ...roles.filter((role) => isRoleOpen(role)).map((role) => ({
    slug: role.slug,
    title: role.title,
    city: role.city,
    country: role.country,
    countryCode: role.countryCode,
    discipline: role.discipline,
    engagement: role.engagement,
    workMode: role.workMode,
  })),
  ...trainingRoles.map((role) => ({
    slug: role.slug,
    title: role.title,
    city: role.place,
    country: role.place,
    countryCode: role.platform.slice(0, 3).toUpperCase(),
    discipline: role.workType,
    engagement: role.platform,
    workMode: "Remote",
    href: `/ai-training/jobs/${role.slug}`,
  })),
];

export function SiteHeader() {
  const announcement = getAnnouncement();
  return (
    <HeaderShell>
      <div className="sthd-strip">
        <span className="sthd-live" aria-hidden />
        <b>{announcement.liveRoleCount}</b>
        <i aria-hidden>·</i>
        <Link href={announcement.salaryGuideHref}>{announcement.salaryGuideLabel} →</Link>
      </div>
      <div className="sthd-bar" data-header-bar>
        <div className="sthd-in">
          <Logo variant="full" className="sthd-logo text-brand" />
          <nav aria-label="Primary" className="sthd-links">
            {nav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="sthd-r">
            <SearchButton />
            <a className="sthd-tel" href={`mailto:${contact.email}`}>
              {contact.email}
            </a>
            <Button href="/employers" compact className="sthd-cta">
              Hire engineers
            </Button>
            <MobileNav
              items={nav}
              roles={searchRoles}
              email={contact.email}
              location={contact.location}
            />
          </div>
        </div>
        <SearchDrawer roles={searchRoles} />
      </div>
    </HeaderShell>
  );
}
