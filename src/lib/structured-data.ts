import { siteUrl } from "@/components/pages/metadata";
import { contact, faq, organization, type FaqItem, type Insight } from "@/content/site";

/**
 * schema.org builders. Only facts the site already states go in here.
 * No JobPosting or Review markup while `contentIsSample` is true: Google
 * treats markup for jobs or reviews that do not exist as spam.
 */

const abs = (path: string) => new URL(path, siteUrl).toString();
const orgId = abs("/#organization");
const siteId = abs("/#website");

export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": orgId,
        name: organization.name,
        url: abs("/"),
        logo: { "@type": "ImageObject", url: abs("/logo.png"), width: 512, height: 512 },
        image: abs("/opengraph-image"),
        description: organization.description,
        email: contact.email,
        areaServed: organization.areaServed.map((name) => ({ "@type": "Place", name })),
        knowsAbout: organization.knowsAbout,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: contact.email,
          availableLanguage: ["English"],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Recruitment services",
          itemListElement: organization.services.map((name) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name, provider: { "@id": orgId } },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": siteId,
        name: organization.name,
        url: abs("/"),
        inLanguage: "en",
        publisher: { "@id": orgId },
      },
    ],
  };
}

export function faqPage(items: readonly FaqItem[] = faq) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbs(trail: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

export function article(insight: Insight) {
  const published = isoDate(insight.date);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    url: abs(`/insights/${insight.slug}`),
    mainEntityOfPage: abs(`/insights/${insight.slug}`),
    ...(published && { datePublished: published, dateModified: published }),
    timeRequired: `PT${insight.minutes}M`,
    articleSection: insight.kicker,
    inLanguage: "en",
    image: abs("/opengraph-image"),
    author: { "@id": orgId },
    publisher: { "@id": orgId },
  };
}

/** "12 September 2026" -> "2026-09-12" (UTC, so the date never shifts). */
export function isoDate(label: string): string | undefined {
  const parsed = Date.parse(`${label} UTC`);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString().slice(0, 10);
}
