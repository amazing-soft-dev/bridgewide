import { siteUrl } from "@/components/pages/metadata";
import {
  contact,
  faq,
  organization,
  rolesListedOn,
  type FaqItem,
  type Insight,
  type Role,
} from "@/content/site";

/**
 * schema.org builders. Only facts the site already states go in here.
 * No Review markup: the site has no reviews.
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
        address: {
          "@type": "PostalAddress",
          addressLocality: "San Francisco",
          addressCountry: "US",
        },
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

const cityCountry: Record<string, { code: string; name: string }> = {
  "San Francisco": { code: "US", name: "United States" },
  Austin: { code: "US", name: "United States" },
  "New York": { code: "US", name: "United States" },
  Toronto: { code: "CA", name: "Canada" },
  Vancouver: { code: "CA", name: "Canada" },
  "Mexico City": { code: "MX", name: "Mexico" },
  "São Paulo": { code: "BR", name: "Brazil" },
  Bogotá: { code: "CO", name: "Colombia" },
  London: { code: "GB", name: "United Kingdom" },
  Berlin: { code: "DE", name: "Germany" },
  Amsterdam: { code: "NL", name: "Netherlands" },
  Dublin: { code: "IE", name: "Ireland" },
};

function plusDays(iso: string, days: number) {
  const date = new Date(`${iso}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** "$210,000–$245,000" or "$850–$980 / day" when both ends are present. */
function baseSalary(salary: string) {
  const numbers = salary.match(/\d[\d,]*/g)?.map((value) => Number(value.replace(/,/g, "")));
  if (!numbers || numbers.length < 2 || numbers.some((value) => !Number.isFinite(value))) return undefined;
  return {
    "@type": "MonetaryAmount",
    currency: "USD",
    value: {
      "@type": "QuantitativeValue",
      minValue: numbers[0],
      maxValue: numbers[1],
      unitText: /\/\s*day/i.test(salary) ? "DAY" : "YEAR",
    },
  };
}

export function jobPosting(role: Role) {
  const country = cityCountry[role.city];
  const salary = baseSalary(role.salary);
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: `${role.summary} ${role.engagement}, ${role.workMode}, ${role.city}. Salary: ${role.salary}.`,
    url: abs(`/roles/${role.slug}`),
    datePosted: rolesListedOn,
    validThrough: plusDays(rolesListedOn, 90),
    employmentType: role.engagement === "Permanent" ? "FULL_TIME" : "CONTRACTOR",
    directApply: false,
    hiringOrganization: { "@id": orgId },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: role.city,
        ...(country ? { addressCountry: country.code } : {}),
      },
    },
    ...(role.workMode === "Remote" && country
      ? {
          jobLocationType: "TELECOMMUTE",
          applicantLocationRequirements: { "@type": "Country", name: country.name },
        }
      : {}),
    ...(salary ? { baseSalary: salary } : {}),
  };
}

/** "12 September 2026" -> "2026-09-12" (UTC, so the date never shifts). */
export function isoDate(label: string): string | undefined {
  const parsed = Date.parse(`${label} UTC`);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString().slice(0, 10);
}
