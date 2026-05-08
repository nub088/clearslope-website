import { SITE_NAME, SITE_URL } from "../data/site";

const DEFAULT_OG = "/img/og.webp";

export type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  ogImage?: string;
};

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  ogType: "website" | "article";
  ogImage: string;
  ogImageAbsolute: string;
};

export function buildPageMeta(input: PageMetaInput): PageMeta {
  const fullTitle = `${input.title} — ${SITE_NAME}`;
  const ogType = input.ogType ?? "website";
  const ogImage = input.ogImage ?? DEFAULT_OG;
  const canonical = new URL(input.path, SITE_URL).toString();
  const ogImageAbsolute = new URL(ogImage, SITE_URL).toString();
  return {
    title: fullTitle,
    description: input.description,
    canonical,
    ogType,
    ogImage,
    ogImageAbsolute,
  };
}
