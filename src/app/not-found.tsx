import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/pages/PageHero";
import { PageSection } from "@/components/pages/PageSection";
import { textLink } from "@/components/pages/format";
import { contact } from "@/content/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/** The ways back from a bad link, shared with the test. */
export const notFoundLinks = [
  { href: "/", label: "The home page" },
  { href: "/roles", label: "Open roles" },
  { href: "/contact", label: "Talk to the desk" },
] as const;

export default function NotFound() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="That page is not here."
        lede="The link may be old, or the role you were looking for may have closed. These pages are a good place to start."
      />
      <PageSection id="back" label="Next" title="Try one of these">
        <ul className="m-0 grid list-none gap-3 p-0 text-lg">
          {notFoundLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className={textLink}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-xl text-stone">
          Still stuck? Write to{" "}
          <a href={`mailto:${contact.email}`} className={textLink}>
            {contact.email}
          </a>
          .
        </p>
      </PageSection>
    </>
  );
}
