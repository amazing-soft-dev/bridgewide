import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { HeaderShell } from "@/components/site/HeaderShell";
import { SearchButton, SearchDrawer, type SearchRole } from "@/components/site/HeaderSearch";
import { MobileNav } from "@/components/site/MobileNav";
import { Button } from "@/components/ui/Button";
import { announcement, contact, nav, roles } from "@/content/site";
import "./header.css";

const searchRoles: readonly SearchRole[] = roles.map((role) => ({
  slug: role.slug,
  title: role.title,
  city: role.city,
  country: role.country,
  countryCode: role.countryCode,
  discipline: role.discipline,
  engagement: role.engagement,
  workMode: role.workMode,
}));

export function SiteHeader() {
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
            <Button href="/employers" arrow={false} compact className="sthd-cta">
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
