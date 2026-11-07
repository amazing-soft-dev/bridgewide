import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { FooterCurtain } from "@/components/site/FooterCurtain";
import { FooterDesk } from "@/components/site/FooterDesk";
import { FooterSignup } from "@/components/site/FooterSignup";
import { contact, footerColumns, type FooterItem } from "@/content/site";

const linkClass = "text-sm text-cloud no-underline hover:text-brand";

function FooterEntry({ item }: { item: FooterItem }) {
  if (!item.href) {
    return <span className="text-sm text-cloud-soft">{item.label}</span>;
  }
  if (item.href.startsWith("mailto:")) {
    return (
      <a href={item.href} className={linkClass}>
        {item.label}
      </a>
    );
  }
  return (
    <Link href={item.href} className={linkClass}>
      {item.label}
    </Link>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <FooterCurtain>
      <footer className="bg-ink text-cloud">
        <div className="mx-auto w-full max-w-6xl px-4 pt-16 pb-7 md:pt-24">
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
            <div className="grid content-start gap-6">
              <Logo variant="full" className="text-cloud" />
              <FooterSignup />
            </div>
            <nav
              aria-label="Footer"
              className="grid gap-10 md:grid-cols-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,1.6fr)] lg:gap-6"
            >
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <h2 className="font-mono text-[11px] tracking-[0.16em] text-cloud-soft uppercase">
                    {column.title}
                  </h2>
                  <ul className="mt-4 grid gap-2">
                    {column.items.map((item) => (
                      <li key={item.label}>
                        <FooterEntry item={item} />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <FooterDesk />
            </nav>
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/12 pt-4 font-mono text-xs tracking-[0.1em] text-white/80 uppercase sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
            <span>
              © {year} BridgeWide
            </span>
            <span>{contact.location}</span>
            <span className="flex gap-4 sm:ml-auto">
              <Link href="/privacy" className="text-inherit no-underline hover:text-cloud">
                Privacy
              </Link>
              <Link href="/terms" className="text-inherit no-underline hover:text-cloud">
                Terms
              </Link>
            </span>
          </div>
        </div>
      </footer>
    </FooterCurtain>
  );
}
