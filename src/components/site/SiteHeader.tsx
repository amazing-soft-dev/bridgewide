import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { MobileNav } from "@/components/site/MobileNav";
import { Button } from "@/components/ui/Button";
import { nav } from "@/content/site";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-ink/10 bg-cloud/95 text-ink backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl items-center gap-4 px-4 py-3">
        <Logo className="shrink-0" />
        <nav aria-label="Primary" className="ml-4 hidden xl:block">
          <ul className="flex items-center gap-5">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-ink-soft no-underline hover:text-ink focus-visible:outline-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto hidden items-center gap-2 xl:flex">
          <Button href="/engineers" variant="secondary">
            Find a role
          </Button>
          <Button href="/employers" variant="primary">
            Hire engineers
          </Button>
        </div>
        <MobileNav items={nav} />
      </div>
    </header>
  );
}
