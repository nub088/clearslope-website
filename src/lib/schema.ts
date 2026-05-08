import {
  ORG_ADDRESS,
  ORG_AREA_SERVED,
  ORG_ID,
  ORG_SAME_AS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  LOGO_URL,
} from "../data/site";
import { AUTHOR, AUTHOR_ID } from "../data/author";

export function buildOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"] as const,
    "@id": ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: LOGO_URL,
    image: LOGO_URL,
    slogan: SITE_TAGLINE,
    founder: { "@id": AUTHOR_ID },
    address: {
      "@type": "PostalAddress" as const,
      ...ORG_ADDRESS,
    },
    areaServed: [...ORG_AREA_SERVED],
    sameAs: [...ORG_SAME_AS],
  };
}

export function buildPerson() {
  return {
    "@context": "https://schema.org",
    "@type": "Person" as const,
    "@id": AUTHOR.id,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    worksFor: { "@id": AUTHOR.worksForId },
    url: AUTHOR.url,
    sameAs: [...AUTHOR.sameAs],
    address: { "@type": "PostalAddress" as const, ...AUTHOR.address },
    knowsAbout: [...AUTHOR.knowsAbout],
    image: AUTHOR.image,
  };
}

type ArticleInput = {
  headline: string;
  description: string;
  slug: string;
  datePublished: string;
  dateModified: string;
  image: string;
};

export function buildArticle(a: ArticleInput) {
  const url = new URL(a.slug, SITE_URL).toString();
  return {
    "@context": "https://schema.org",
    "@type": "Article" as const,
    headline: a.headline,
    description: a.description,
    image: a.image,
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    author: { "@id": AUTHOR.id },
    publisher: { "@id": ORG_ID },
    mainEntityOfPage: url,
  };
}

type ServiceInput = {
  name: string;
  description: string;
  slug: string;
  serviceType: string;
};

export function buildService(s: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service" as const,
    name: s.name,
    description: s.description,
    serviceType: s.serviceType,
    provider: { "@id": ORG_ID },
    areaServed: [...ORG_AREA_SERVED],
    url: new URL(s.slug, SITE_URL).toString(),
  };
}

type FaqItem = { q: string; a: string };

export function buildFaqPage(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: items.map((it) => ({
      "@type": "Question" as const,
      name: it.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: it.a,
      },
    })),
  };
}

type Crumb = { name: string; path: string };

export function buildBreadcrumbs(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList" as const,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem" as const,
      position: i + 1,
      name: c.name,
      item: new URL(c.path, SITE_URL).toString(),
    })),
  };
}

export function buildWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite" as const,
    name: SITE_NAME,
    url: SITE_URL,
    publisher: { "@id": ORG_ID },
  };
}

type CollectionPageInput = {
  name: string;
  slug: string;
  description: string;
};

export function buildCollectionPage(c: CollectionPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage" as const,
    name: c.name,
    description: c.description,
    url: new URL(c.slug, SITE_URL).toString(),
  };
}
