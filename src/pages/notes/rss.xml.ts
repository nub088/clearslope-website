import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
} from "../../data/site";

export async function GET(context: { site?: URL }) {
  const all = (await getCollection("notes")).filter((e) => !e.data.draft);
  return rss({
    title: `${SITE_NAME}: Notes`,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items: all.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.publishDate,
      link: `/notes/${e.id}/`,
    })),
  });
}
