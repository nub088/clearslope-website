import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const services = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/services" }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    description: z.string().min(140).max(165),
    slug: z.string(),
    serviceType: z.string(),
    order: z.number(),
    faq: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .min(3)
      .max(10),
    relatedNotes: z.array(z.string()).default([]),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string().min(140).max(165),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cluster: z.enum(["pest-control", "voice-agent", "operator-pov"]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    image: z.string().optional(),
  }),
});

const work = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/work" }),
  schema: z.object({
    title: z.string(),
    h1: z.string(),
    description: z.string().min(140).max(165),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    clientLabel: z.string(),
    location: z.string(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
  }),
});

export const collections = { services, notes, work };
