import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { HeaderShell } from "@/components/site/HeaderShell";
import { MobileNav } from "@/components/site/MobileNav";
import { Button } from "@/components/ui/Button";
import { nav } from "@/content/site";

export function SiteHeader() {
  return (
    <HeaderShell>
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        <Logo variant="full" className="shrink-0 text-brand" />
        <nav aria-label="Primary" className="ml-4 hidden xl:block">
          <ul className="flex items-center gap-5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ink-soft no-underline hover:text-ink focus-visible:outline-ink group-data-[tone=dark]/header:text-cloud/85 group-data-[tone=dark]/header:hover:text-cloud"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-2 xl:flex">
          <Button
            href="/engineers"
            variant="secondary"
            className="group-data-[tone=dark]/header:border-[color-mix(in_srgb,#fff_36%,transparent)] group-data-[tone=dark]/header:bg-[color-mix(in_srgb,#fff_8%,transparent)] group-data-[tone=dark]/header:text-white group-data-[tone=dark]/header:hover:border-ink group-data-[tone=dark]/header:focus-visible:border-ink"
          >
            Find a role
          </Button>
          <Button href="/employers" variant="primary">
            Hire engineers
          </Button>
        </div>
        <MobileNav items={nav} />
      </div>
    </HeaderShell>
  );
}
