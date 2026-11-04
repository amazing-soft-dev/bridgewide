import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
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
  return (
    <footer className="bg-ink text-cloud">
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="grid content-start gap-4">
          <Logo variant="full" className="text-cloud" />
          <p className="text-sm text-cloud-soft">{contact.location}</p>
        </div>
        <nav
          aria-label="Footer"
          className="mt-10 grid gap-10 md:grid-cols-2 lg:grid-cols-5"
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
        </nav>
      </div>
    </footer>
  );
}
