import { siteUrl } from "@/components/pages/metadata";
import {
  contact,
  contentUpdatedOn,
  faq,
  organization,
  people,
  regions,
  rolesListedOn,
  salaryBands,
  type Insight,
  type Role,
} from "@/content/site";
import { trainingRegion, type TrainingRole } from "@/content/ai-training";

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
        ...(organization.sameAs.length > 0 ? { sameAs: [...organization.sameAs] } : {}),
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          email: contact.email,
          availableLanguage: ["English"],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Recruitment services",
          itemListElement: organization.services.map((service) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: service.name,
              url: abs(service.path),
              provider: { "@id": orgId },
            },
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
        dateModified: contentUpdatedOn,
      },
    ],
  };
}

export function faqPage(items: readonly { question: string; answer: string }[] = faq) {
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
    image: abs(`/insights/${insight.slug}/opengraph-image`),
    author: { "@id": orgId },
    publisher: { "@id": orgId },
  };
}

/** The consultants on /about, each addressable as /about#id. */
export function desk() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "The BridgeWide desk",
    itemListElement: people.map((person, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        "@id": abs(`/about#${person.id}`),
        url: abs(`/about#${person.id}`),
        name: person.name,
        jobTitle: person.role,
        image: abs(person.image),
        worksFor: { "@id": orgId },
        knowsAbout: person.focus,
      },
    })),
  };
}

/** The salary guide as a Dataset: one measured value per discipline and region. */
export function salaryDataset() {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `BridgeWide engineering salary guide, ${salaryBands.edition}`,
    description: `${salaryBands.basis}. Low, median, and high base salary for ${salaryBands.disciplines
      .map((discipline) => discipline.label.toLowerCase())
      .join(", ")} engineers in ${regions.map((region) => region.name).join(", ")}.`,
    url: abs("/salary-guide"),
    creator: { "@id": orgId },
    publisher: { "@id": orgId },
    dateModified: contentUpdatedOn,
    inLanguage: "en",
    isAccessibleForFree: true,
    spatialCoverage: regions.map((region) => ({ "@type": "Place", name: region.name })),
    variableMeasured: salaryBands.disciplines.flatMap((discipline) =>
      regions.map((region) => {
        const band = discipline.bands[region.slug];
        return {
          "@type": "PropertyValue",
          name: `${discipline.label} engineer base salary, ${region.name}`,
          minValue: band.low,
          maxValue: band.high,
          value: band.median,
          unitText: "USD per year",
          description: `Median ${band.median} USD`,
        };
      }),
    ),
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

const trainingCountry: Partial<Record<TrainingRole["region"], string>> = {
  usa: "United States",
  canada: "Canada",
};

/**
 * An AI-training listing as a remote, hourly JobPosting. The platform pays
 * the person; BridgeWide is the hiring organization only in the sense that
 * it makes the introduction, so `directApply` stays false.
 */
export function trainingJobPosting(role: TrainingRole) {
  const region = trainingRegion(role.region);
  const country = trainingCountry[role.region];
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: `${role.summary} Remote, paid in USD by the platform. Region: ${region?.name ?? role.region}.`,
    url: abs(`/ai-training/jobs/${role.slug}`),
    datePosted: contentUpdatedOn,
    validThrough: plusDays(contentUpdatedOn, 90),
    employmentType: "CONTRACTOR",
    directApply: false,
    hiringOrganization: { "@id": orgId },
    jobLocationType: "TELECOMMUTE",
    ...(country
      ? { applicantLocationRequirements: { "@type": "Country", name: country } }
      : {}),
    baseSalary: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: role.payMin,
        maxValue: role.payMax,
        unitText: "HOUR",
      },
    },
  };
}

/** "12 September 2026" -> "2026-09-12" (UTC, so the date never shifts). */
export function isoDate(label: string): string | undefined {
  const parsed = Date.parse(`${label} UTC`);
  if (Number.isNaN(parsed)) return undefined;
  return new Date(parsed).toISOString().slice(0, 10);
}
