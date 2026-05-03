# Clear Slope SEO Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert `clearslopedigital.com` from a thin single-page Astro site into a multi-page, schema-correct, content-collection-driven property per `docs/superpowers/specs/2026-05-03-clearslope-seo-design.md`.

**Architecture:** Astro 6 multi-page static site. Markdown Content Collections back the three content surfaces (services, notes, work). Pure-TS modules in `src/lib/` build JSON-LD and per-page meta tags from typed data sources in `src/data/`. Shared Astro components in `src/components/seo/`, `src/components/author/`, `src/components/forms/`, and `src/components/cta/` consume those builders. Existing single-page components (Hero, Process, FinalCTA, Work) are decomposed: parts that ship to the new home page get refactored, the rest are deleted.

**Tech Stack:** Astro 6, TypeScript (strict), Tailwind v4, Astro Content Collections (zod-typed frontmatter), Vitest for unit tests on builders, `@astrojs/sitemap` (already installed), `@astrojs/rss` (to add), Cal.com inline embed (`@calcom/embed-snippet`), Web3Forms (already wired in `ContactForm.astro`).

**Pre-flight:** Project root is `/home/user/Projects/Clearslope website design/`. Git initialized at commit `4e6e26d`. Optimized photo (`mo-habib.jpeg` + variants) and logo (`logo-horizontal.png` + variants) already exist in `public/img/`.

---

## File map (created or modified)

**New `src/data/`:**
- `src/data/site.ts` — Org/LocalBusiness data, GBP info, sameAs, area served
- `src/data/author.ts` — Person data for Mo Habib
- `src/data/nav.ts` — Header/footer nav link sets

**New `src/lib/`:**
- `src/lib/schema.ts` — Pure functions returning JSON-LD objects (Organization, LocalBusiness, Person, Article, Service, FAQPage, BreadcrumbList, CollectionPage, WebSite)
- `src/lib/seo.ts` — Pure functions building per-page title/description/canonical/OG/Twitter meta props
- `src/lib/reading-time.ts` — Word-count → minutes calculator (used in note frontmatter)

**New `src/lib/__tests__/`:**
- `src/lib/__tests__/schema.test.ts`
- `src/lib/__tests__/seo.test.ts`
- `src/lib/__tests__/reading-time.test.ts`

**New `src/content/`:**
- `src/content/config.ts` — Collection definitions (services, notes, work) with zod schemas
- `src/content/services/ai-voice-agent.md`
- `src/content/services/agentic-workflows.md`
- `src/content/services/local-seo.md`
- `src/content/work/pest-control-vancouver.md`
- `src/content/notes/<6 slugs>.md` (scaffolded with frontmatter + outline; content fills are a separate manual pass)

**New `src/components/seo/`:**
- `src/components/seo/PageMeta.astro` — Renders `<title>`, meta, OG, Twitter from `seo.ts` output
- `src/components/seo/JsonLd.astro` — Renders one or many JSON-LD blocks

**New `src/components/author/`:**
- `src/components/author/AuthorByline.astro` — Top-of-post compact byline
- `src/components/author/AuthorBox.astro` — End-of-post richer block

**New `src/components/forms/`:**
- `src/components/forms/NewsletterForm.astro` — Single-input newsletter form posting to existing Web3Forms endpoint

**New `src/components/cta/`:**
- `src/components/cta/CalEmbed.astro` — Inline Cal.com embed

**New `src/components/`:**
- `src/components/Breadcrumbs.astro` — Visual breadcrumb component (paired with BreadcrumbList JSON-LD)
- `src/components/PostCard.astro` — Reused on `/notes/`, home, related-posts blocks
- `src/components/ServiceCard.astro` — Reused on `/services/` index and home
- `src/components/PageHero.astro` — Standardized inner-page hero (used on `/about`, `/services/*`, `/work/*`, `/notes/*`)

**New `src/layouts/`:**
- `src/layouts/Page.astro` — Generic page layout (replaces direct Base usage on most pages)
- `src/layouts/Note.astro` — Layout for `/notes/[slug]`
- `src/layouts/Work.astro` — Layout for `/work/[slug]`
- `src/layouts/Service.astro` — Layout for `/services/[slug]`

**Modified:**
- `src/layouts/Base.astro` — Strip ProfessionalService schema; accept SEO props from `seo.ts`; render `PageMeta` and `JsonLd`
- `src/components/Nav.astro` — Add Services / Work / Notes / About / Book links
- `src/components/Footer.astro` — Add column structure, NewsletterForm, About + Services + LinkedIn links, NAP block
- `src/components/Hero.astro` — Refactor to accept props (used as the new home hero)
- `src/components/ContactForm.astro` — Move to `src/components/forms/ContactForm.astro` (relocate, no logic change); refactor `ACCESS_KEY` constant out to `src/data/site.ts`
- `astro.config.mjs` — Configure trailing-slash policy, sitemap options
- `public/robots.txt` — Already correct, no change

**New `src/pages/`:**
- `src/pages/index.astro` (rewrite)
- `src/pages/about.astro`
- `src/pages/book.astro`
- `src/pages/services/index.astro`
- `src/pages/services/[slug].astro`
- `src/pages/work/index.astro`
- `src/pages/work/[slug].astro`
- `src/pages/notes/index.astro`
- `src/pages/notes/[slug].astro`
- `src/pages/notes/rss.xml.ts`

**Deleted:**
- `src/components/Process.astro` — content not in new spec
- `src/components/FinalCTA.astro` — replaced by per-page CTAs and `/book/`
- `src/components/Work.astro` (the old one) — superseded by `/work/` collection
- `src/pages/demo.astro` — out of scope for SEO redesign (keep if user wants; plan will ask before deleting)

---

## Phase 0: Setup (manual, user-side)

### Task 0.1: Confirm or create Cal.com account + event

**Files:** none (external)

- [ ] **Step 1:** Visit `https://cal.com/signup` if no account exists
- [ ] **Step 2:** Create a 30-minute event type named `discovery-call`. Set availability, buffer time, confirmation email content
- [ ] **Step 3:** Copy the public URL (will be `cal.com/<username>/discovery-call` or `cal.com/<team>/discovery-call`)
- [ ] **Step 4:** Record the URL — it will be needed verbatim in Task 6.4 (`src/data/site.ts`). If skipped, the embed will use a placeholder URL string `cal.com/clearslopedigital/discovery-call` and a TODO comment will be left in the file

### Task 0.2: Resolve GBP canonical URL

**Files:** none (external)

- [ ] **Step 1:** Open `https://share.google/oNMYi72DmwCdF77so` in a browser
- [ ] **Step 2:** Copy the resolved Google Maps URL from the address bar (form: `https://www.google.com/maps/place/...`)
- [ ] **Step 3:** Record the URL — it will be added to the `sameAs` array in `src/data/site.ts` (Task 6.4)

### Task 0.3: Decide apex vs. www canonical

**Files:** none (decision, applied in Task 25.1)

- [ ] **Step 1:** Pick one: apex (`clearslopedigital.com`) or www (`www.clearslopedigital.com`). Default for plan: **apex** with a 301 from www → apex (apex is shorter and matches the existing `astro.config.mjs` `site` value)
- [ ] **Step 2:** Note your DNS provider — DNS configuration is handled separately from this code change

---

## Phase 1: Test infrastructure + dependencies

### Task 1.1: Install Vitest + RSS integration

**Files:**
- Modify: `package.json`

- [ ] **Step 1:** Install dev dependencies

```bash
cd "/home/user/Projects/Clearslope website design"
npm install --save-dev vitest@^2 @vitest/coverage-v8@^2
npm install --save @astrojs/rss@^4
```

- [ ] **Step 2:** Add `test` and `test:run` scripts to `package.json`

Replace the `"scripts"` block with:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test": "vitest",
  "test:run": "vitest run",
  "test:coverage": "vitest run --coverage"
}
```

- [ ] **Step 3:** Verify install

```bash
npx vitest --version
```

Expected: prints a version number, no errors.

- [ ] **Step 4:** Commit

```bash
git add package.json package-lock.json
git commit -m "chore: add vitest and @astrojs/rss"
```

### Task 1.2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1:** Create `vitest.config.ts` with:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/__tests__/**/*.test.ts"],
    globals: false,
    environment: "node",
  },
});
```

- [ ] **Step 2:** Run vitest to confirm config loads (will report no test files yet, which is fine)

```bash
npm run test:run
```

Expected: `No test files found, exiting with code 1` is acceptable for now. Config errors would be loud (TypeScript/ESM errors).

- [ ] **Step 3:** Commit

```bash
git add vitest.config.ts
git commit -m "chore: configure vitest"
```

---

## Phase 2: Shared data modules

### Task 2.1: Create `src/data/site.ts`

**Files:**
- Create: `src/data/site.ts`

- [ ] **Step 1:** Create the file with site-level constants. Replace `<CAL_URL>` with the URL from Task 0.1, or leave the default placeholder. Replace `<GBP_URL>` with the URL from Task 0.2, or leave the placeholder.

```ts
export const SITE_URL = "https://clearslopedigital.com";
export const SITE_NAME = "Clear Slope Digital";
export const SITE_TAGLINE =
  "AI voice agents, agentic workflows, and local SEO for service businesses.";

export const SITE_DESCRIPTION =
  "Clear Slope Digital builds AI voice agents, agentic workflows, and local SEO systems for service businesses across Canada and the US.";

export const ORG_ID = `${SITE_URL}/#organization`;

export const ORG_ADDRESS = {
  addressLocality: "Vancouver",
  addressRegion: "BC",
  addressCountry: "CA",
} as const;

export const ORG_AREA_SERVED = ["CA", "US"] as const;

export const ORG_SAME_AS = [
  "https://www.linkedin.com/company/clearslopedigital/",
  // TODO: replace with the canonical Google Maps place URL resolved from
  //   https://share.google/oNMYi72DmwCdF77so (Task 0.2)
  "https://www.google.com/maps/place/CLEAR_SLOPE_DIGITAL_PLACEHOLDER",
] as const;

export const CAL_URL = "cal.com/clearslopedigital/discovery-call";
// TODO: replace with the actual Cal.com event URL once Task 0.1 is complete.

export const WEB3FORMS_ACCESS_KEY = "71da2716-4185-43b8-978d-a1978c193628";

export const LOGO_URL = `${SITE_URL}/img/logo-horizontal.png`;

export const NAV_LINKS = [
  { href: "/services/", label: "Services" },
  { href: "/work/", label: "Work" },
  { href: "/notes/", label: "Notes" },
  { href: "/about/", label: "About" },
] as const;
```

- [ ] **Step 2:** Verify TypeScript compiles

```bash
npx astro check
```

Expected: no errors related to `src/data/site.ts` (existing project errors, if any, are tolerated unless they reference this file).

- [ ] **Step 3:** Commit

```bash
git add src/data/site.ts
git commit -m "feat: add site-level data module"
```

### Task 2.2: Create `src/data/author.ts`

**Files:**
- Create: `src/data/author.ts`

- [ ] **Step 1:** Create the file:

```ts
import { SITE_URL, ORG_ID, ORG_ADDRESS } from "./site";

export const AUTHOR_ID = `${SITE_URL}/about/#person`;

export const AUTHOR = {
  id: AUTHOR_ID,
  name: "Mo Habib",
  jobTitle: "Founder, Clear Slope Digital",
  url: `${SITE_URL}/about/`,
  image: `${SITE_URL}/img/mo-habib.jpeg`,
  imagePath64: "/img/mo-habib-64.webp",
  imagePath160: "/img/mo-habib-160.webp",
  imagePath400: "/img/mo-habib-400.webp",
  worksForId: ORG_ID,
  address: ORG_ADDRESS,
  sameAs: ["https://www.linkedin.com/company/clearslopedigital/"] as const,
  knowsAbout: [
    "AI voice agents",
    "Agentic workflows",
    "Local SEO",
    "Service-business operations",
    "LLM application engineering",
    "Conversion rate optimization",
  ] as const,
  shortBio:
    "Mo Habib builds AI voice agents, agentic workflows, and local SEO systems for service businesses across Canada and the US. Mechanical engineer turned founder, working solo and direct.",
} as const;
```

- [ ] **Step 2:** Commit

```bash
git add src/data/author.ts
git commit -m "feat: add author data module"
```

---

## Phase 3: Pure libraries (TDD)

### Task 3.1: `reading-time.ts` — write failing test

**Files:**
- Create: `src/lib/__tests__/reading-time.test.ts`

- [ ] **Step 1:** Create the test file:

```ts
import { describe, expect, it } from "vitest";
import { readingTimeMinutes } from "../reading-time";

describe("readingTimeMinutes", () => {
  it("returns 1 for empty content", () => {
    expect(readingTimeMinutes("")).toBe(1);
  });

  it("rounds up partial minutes (200 words at 225 wpm = 1)", () => {
    const text = Array(200).fill("word").join(" ");
    expect(readingTimeMinutes(text)).toBe(1);
  });

  it("returns 7 for ~1500 words at 225 wpm", () => {
    const text = Array(1500).fill("word").join(" ");
    expect(readingTimeMinutes(text)).toBe(7);
  });

  it("counts whitespace-separated tokens, ignoring markdown punctuation", () => {
    const text = "## Heading\n\nSome **bold** text and a [link](/x).";
    expect(readingTimeMinutes(text)).toBe(1);
  });
});
```

- [ ] **Step 2:** Run, expect failure

```bash
npm run test:run
```

Expected: error `Failed to resolve import "../reading-time"`.

### Task 3.2: `reading-time.ts` — implement

**Files:**
- Create: `src/lib/reading-time.ts`

- [ ] **Step 1:** Create the implementation:

```ts
const WORDS_PER_MINUTE = 225;

export function readingTimeMinutes(markdown: string): number {
  if (!markdown) return 1;
  const stripped = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[`*_~#>\[\]\(\)!]/g, " ");
  const words = stripped.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}
```

- [ ] **Step 2:** Run, expect pass

```bash
npm run test:run
```

Expected: 4 tests pass.

- [ ] **Step 3:** Commit

```bash
git add src/lib/reading-time.ts src/lib/__tests__/reading-time.test.ts
git commit -m "feat: add reading-time calculator"
```

### Task 3.3: `schema.ts` — write failing test for Organization + LocalBusiness

**Files:**
- Create: `src/lib/__tests__/schema.test.ts`

- [ ] **Step 1:** Create the test file with the first test only:

```ts
import { describe, expect, it } from "vitest";
import { buildOrganization } from "../schema";

describe("buildOrganization", () => {
  it("emits Organization + LocalBusiness with linked @id", () => {
    const node = buildOrganization();
    expect(node["@context"]).toBe("https://schema.org");
    expect(node["@type"]).toEqual(["Organization", "LocalBusiness"]);
    expect(node["@id"]).toBe("https://clearslopedigital.com/#organization");
    expect(node.name).toBe("Clear Slope Digital");
    expect(node.url).toBe("https://clearslopedigital.com");
    expect(node.slogan).toContain("AI voice agents");
    expect(node.address.addressLocality).toBe("Vancouver");
    expect(node.areaServed).toEqual(["CA", "US"]);
    expect(node.sameAs).toContain(
      "https://www.linkedin.com/company/clearslopedigital/",
    );
    expect(node.founder["@id"]).toBe(
      "https://clearslopedigital.com/about/#person",
    );
  });
});
```

- [ ] **Step 2:** Run, expect failure

```bash
npm run test:run
```

Expected: `Failed to resolve import "../schema"`.

### Task 3.4: `schema.ts` — implement Organization

**Files:**
- Create: `src/lib/schema.ts`

- [ ] **Step 1:** Create the file with relative imports (works in both Astro and Vitest, no alias needed):

```ts
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
import { AUTHOR_ID } from "../data/author";

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
```

- [ ] **Step 2:** Run, expect pass

```bash
npm run test:run
```

Expected: `buildOrganization` test passes.

- [ ] **Step 3:** Commit

```bash
git add src/lib/schema.ts src/lib/__tests__/schema.test.ts
git commit -m "feat: add buildOrganization schema builder"
```

### Task 3.5: `schema.ts` — Person builder

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/lib/__tests__/schema.test.ts`

- [ ] **Step 1:** Append test to `src/lib/__tests__/schema.test.ts`:

```ts
import { buildPerson } from "../schema";

describe("buildPerson", () => {
  it("emits Person with worksFor link to organization", () => {
    const node = buildPerson();
    expect(node["@type"]).toBe("Person");
    expect(node["@id"]).toBe(
      "https://clearslopedigital.com/about/#person",
    );
    expect(node.name).toBe("Mo Habib");
    expect(node.jobTitle).toBe("Founder, Clear Slope Digital");
    expect(node.worksFor["@id"]).toBe(
      "https://clearslopedigital.com/#organization",
    );
    expect(node.knowsAbout).toContain("AI voice agents");
    expect(node.image).toContain("mo-habib");
  });
});
```

Update the existing import line at the top to combine: `import { buildOrganization, buildPerson } from "../schema";`.

- [ ] **Step 2:** Run, expect failure (`buildPerson` undefined).

- [ ] **Step 3:** Append to `src/lib/schema.ts`:

```ts
import { AUTHOR } from "../data/author";

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
```

The `import { AUTHOR_ID }` line from Task 3.4 already exists; keep it. Add the `AUTHOR` import alongside.

- [ ] **Step 4:** Run, expect pass.

- [ ] **Step 5:** Commit

```bash
git add src/lib/schema.ts src/lib/__tests__/schema.test.ts
git commit -m "feat: add buildPerson schema builder"
```

### Task 3.6: `schema.ts` — Article builder

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/lib/__tests__/schema.test.ts`

- [ ] **Step 1:** Append test:

```ts
import { buildArticle } from "../schema";

describe("buildArticle", () => {
  it("emits Article with author + publisher links and required fields", () => {
    const node = buildArticle({
      headline: "Test Headline",
      description: "A test article.",
      slug: "/notes/test/",
      datePublished: "2026-05-05",
      dateModified: "2026-05-05",
      image: "https://clearslopedigital.com/img/og.webp",
    });
    expect(node["@type"]).toBe("Article");
    expect(node.headline).toBe("Test Headline");
    expect(node.author["@id"]).toBe(
      "https://clearslopedigital.com/about/#person",
    );
    expect(node.publisher["@id"]).toBe(
      "https://clearslopedigital.com/#organization",
    );
    expect(node.mainEntityOfPage).toBe(
      "https://clearslopedigital.com/notes/test/",
    );
    expect(node.datePublished).toBe("2026-05-05");
  });
});
```

Update the top import: `import { buildOrganization, buildPerson, buildArticle } from "../schema";`.

- [ ] **Step 2:** Run, expect failure.

- [ ] **Step 3:** Append to `src/lib/schema.ts`:

```ts
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
```

- [ ] **Step 4:** Run, expect pass.

- [ ] **Step 5:** Commit

```bash
git add src/lib/schema.ts src/lib/__tests__/schema.test.ts
git commit -m "feat: add buildArticle schema builder"
```

### Task 3.7: `schema.ts` — Service + FAQPage builders

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/lib/__tests__/schema.test.ts`

- [ ] **Step 1:** Append tests:

```ts
import { buildService, buildFaqPage } from "../schema";

describe("buildService", () => {
  it("emits Service with provider link and serviceType", () => {
    const node = buildService({
      name: "AI Voice Agents for Service Businesses",
      description: "Custom-built voice agents.",
      slug: "/services/ai-voice-agent/",
      serviceType: "AI Voice Agent",
    });
    expect(node["@type"]).toBe("Service");
    expect(node.provider["@id"]).toBe(
      "https://clearslopedigital.com/#organization",
    );
    expect(node.serviceType).toBe("AI Voice Agent");
    expect(node.areaServed).toEqual(["CA", "US"]);
    expect(node.url).toBe(
      "https://clearslopedigital.com/services/ai-voice-agent/",
    );
  });
});

describe("buildFaqPage", () => {
  it("emits FAQPage with mainEntity Q/A pairs", () => {
    const node = buildFaqPage([
      { q: "What does it cost?", a: "Depends on scope." },
      { q: "How long?", a: "Usually 4 weeks." },
    ]);
    expect(node["@type"]).toBe("FAQPage");
    expect(node.mainEntity).toHaveLength(2);
    expect(node.mainEntity[0]["@type"]).toBe("Question");
    expect(node.mainEntity[0].acceptedAnswer["@type"]).toBe("Answer");
    expect(node.mainEntity[0].acceptedAnswer.text).toBe("Depends on scope.");
  });
});
```

Update the top import line accordingly.

- [ ] **Step 2:** Run, expect failure.

- [ ] **Step 3:** Append to `src/lib/schema.ts`:

```ts
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
```

- [ ] **Step 4:** Run, expect pass.

- [ ] **Step 5:** Commit

```bash
git add src/lib/schema.ts src/lib/__tests__/schema.test.ts
git commit -m "feat: add buildService and buildFaqPage builders"
```

### Task 3.8: `schema.ts` — BreadcrumbList + WebSite + CollectionPage

**Files:**
- Modify: `src/lib/schema.ts`
- Modify: `src/lib/__tests__/schema.test.ts`

- [ ] **Step 1:** Append tests:

```ts
import {
  buildBreadcrumbs,
  buildWebSite,
  buildCollectionPage,
} from "../schema";

describe("buildBreadcrumbs", () => {
  it("emits BreadcrumbList with positioned items", () => {
    const node = buildBreadcrumbs([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services/" },
      { name: "AI Voice Agent", path: "/services/ai-voice-agent/" },
    ]);
    expect(node["@type"]).toBe("BreadcrumbList");
    expect(node.itemListElement).toHaveLength(3);
    expect(node.itemListElement[0].position).toBe(1);
    expect(node.itemListElement[2].item).toBe(
      "https://clearslopedigital.com/services/ai-voice-agent/",
    );
  });
});

describe("buildWebSite", () => {
  it("emits WebSite with name and url", () => {
    const node = buildWebSite();
    expect(node["@type"]).toBe("WebSite");
    expect(node.name).toBe("Clear Slope Digital");
    expect(node.url).toBe("https://clearslopedigital.com");
    expect(node.publisher["@id"]).toBe(
      "https://clearslopedigital.com/#organization",
    );
  });
});

describe("buildCollectionPage", () => {
  it("emits CollectionPage with name and url", () => {
    const node = buildCollectionPage({
      name: "Notes",
      slug: "/notes/",
      description: "Posts from Mo.",
    });
    expect(node["@type"]).toBe("CollectionPage");
    expect(node.name).toBe("Notes");
    expect(node.url).toBe("https://clearslopedigital.com/notes/");
  });
});
```

Update the top import line.

- [ ] **Step 2:** Run, expect failure.

- [ ] **Step 3:** Append to `src/lib/schema.ts`:

```ts
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
```

- [ ] **Step 4:** Run, expect pass.

- [ ] **Step 5:** Commit

```bash
git add src/lib/schema.ts src/lib/__tests__/schema.test.ts
git commit -m "feat: add breadcrumb, website, and collection schema builders"
```

### Task 3.9: `seo.ts` — write failing test

**Files:**
- Create: `src/lib/__tests__/seo.test.ts`

- [ ] **Step 1:** Create:

```ts
import { describe, expect, it } from "vitest";
import { buildPageMeta } from "../seo";

describe("buildPageMeta", () => {
  it("formats title with site name suffix and clamps length", () => {
    const meta = buildPageMeta({
      title: "AI Voice Agents for Service Businesses",
      description:
        "Voice agents that capture missed calls during peak hours and after hours, qualify leads, and book the job.",
      path: "/services/ai-voice-agent/",
    });
    expect(meta.title).toBe(
      "AI Voice Agents for Service Businesses — Clear Slope Digital",
    );
    expect(meta.canonical).toBe(
      "https://clearslopedigital.com/services/ai-voice-agent/",
    );
    expect(meta.description.length).toBeGreaterThanOrEqual(70);
    expect(meta.description.length).toBeLessThanOrEqual(165);
  });

  it("uses provided ogType (article vs website)", () => {
    const meta = buildPageMeta({
      title: "x",
      description: "x",
      path: "/notes/foo/",
      ogType: "article",
    });
    expect(meta.ogType).toBe("article");
  });

  it("falls back to default OG image when none provided", () => {
    const meta = buildPageMeta({
      title: "x",
      description: "x",
      path: "/",
    });
    expect(meta.ogImage).toContain("/img/");
  });
});
```

- [ ] **Step 2:** Run, expect failure.

### Task 3.10: `seo.ts` — implement

**Files:**
- Create: `src/lib/seo.ts`

- [ ] **Step 1:** Create:

```ts
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
```

- [ ] **Step 2:** Run, expect pass.

- [ ] **Step 3:** Commit

```bash
git add src/lib/seo.ts src/lib/__tests__/seo.test.ts
git commit -m "feat: add buildPageMeta builder"
```

---

## Phase 4: Content Collections

### Task 4.1: Create content collection config

**Files:**
- Create: `src/content/config.ts`

- [ ] **Step 1:** Create:

```ts
import { defineCollection, z } from "astro:content";

const services = defineCollection({
  type: "content",
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
  type: "content",
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
  type: "content",
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
```

- [ ] **Step 2:** Verify with Astro

```bash
npx astro sync
```

Expected: completes without errors.

- [ ] **Step 3:** Commit

```bash
git add src/content/config.ts
git commit -m "feat: define services, notes, and work content collections"
```

---

## Phase 5: SEO components (Astro)

### Task 5.1: PageMeta component

**Files:**
- Create: `src/components/seo/PageMeta.astro`

- [ ] **Step 1:** Create:

```astro
---
import type { PageMeta } from "../../lib/seo";
interface Props { meta: PageMeta }
const { meta } = Astro.props;
---
<title>{meta.title}</title>
<meta name="description" content={meta.description} />
<link rel="canonical" href={meta.canonical} />

<meta property="og:type" content={meta.ogType} />
<meta property="og:title" content={meta.title} />
<meta property="og:description" content={meta.description} />
<meta property="og:image" content={meta.ogImageAbsolute} />
<meta property="og:url" content={meta.canonical} />
<meta property="og:site_name" content="Clear Slope Digital" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={meta.title} />
<meta name="twitter:description" content={meta.description} />
<meta name="twitter:image" content={meta.ogImageAbsolute} />
```

- [ ] **Step 2:** Commit

```bash
git add src/components/seo/PageMeta.astro
git commit -m "feat: add PageMeta component"
```

### Task 5.2: JsonLd component

**Files:**
- Create: `src/components/seo/JsonLd.astro`

- [ ] **Step 1:** Create:

```astro
---
interface Props { data: unknown | unknown[] }
const { data } = Astro.props;
const nodes = Array.isArray(data) ? data : [data];
---
{nodes.map((node) => (
  <script
    type="application/ld+json"
    set:html={JSON.stringify(node)}
    is:inline
  />
))}
```

- [ ] **Step 2:** Commit

```bash
git add src/components/seo/JsonLd.astro
git commit -m "feat: add JsonLd component"
```

### Task 5.3: Refactor Base.astro to consume PageMeta + JsonLd

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1:** Replace the entire file with:

```astro
---
import "../styles/global.css";
import PageMeta from "../components/seo/PageMeta.astro";
import JsonLd from "../components/seo/JsonLd.astro";
import type { PageMeta as PageMetaT } from "../lib/seo";

interface Props {
  meta: PageMetaT;
  schema?: unknown | unknown[];
}

const { meta, schema } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <meta name="theme-color" content="#ffffff" />
    <meta name="generator" content={Astro.generator} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <PageMeta meta={meta} />
    {schema ? <JsonLd data={schema} /> : null}
  </head>
  <body class="bg-bg text-ink antialiased">
    <slot />

    <script is:inline>
      (() => {
        if (typeof window === "undefined") return;
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const targets = document.querySelectorAll("[data-reveal], [data-reveal-stagger]");
        if (reduce || !("IntersectionObserver" in window)) {
          targets.forEach((el) => el.classList.add("is-revealed"));
          return;
        }
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("is-revealed");
                io.unobserve(e.target);
              }
            });
          },
          { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
        );
        targets.forEach((el) => io.observe(el));
      })();
    </script>
  </body>
</html>
```

The old `localBusiness` const is removed — schema now flows through the `schema` prop, populated per-page.

- [ ] **Step 2:** Commit (don't expect build to pass yet — `index.astro` still uses old API. Next task fixes it.)

```bash
git add src/layouts/Base.astro
git commit -m "refactor: Base accepts meta + schema props"
```

---

## Phase 6: Page layouts

### Task 6.1: Page layout

**Files:**
- Create: `src/layouts/Page.astro`

- [ ] **Step 1:** Create:

```astro
---
import Base from "./Base.astro";
import Nav from "../components/Nav.astro";
import Footer from "../components/Footer.astro";
import type { PageMeta } from "../lib/seo";

interface Props {
  meta: PageMeta;
  schema?: unknown | unknown[];
}

const { meta, schema } = Astro.props;
---
<Base meta={meta} schema={schema}>
  <Nav />
  <main>
    <slot />
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2:** Commit

```bash
git add src/layouts/Page.astro
git commit -m "feat: add Page layout"
```

---

## Phase 7: Shared building-block components

### Task 7.1: Update Nav with full link set

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1:** Replace contents with:

```astro
---
import { NAV_LINKS } from "../data/site";
const path = Astro.url.pathname;
const isActive = (href: string) =>
  href === "/" ? path === "/" : path.startsWith(href);
---
<header class="sticky top-0 z-40 bg-bg/85 backdrop-blur-md border-b border-rule">
  <div class="container-page flex items-center justify-between h-16">
    <a href="/" class="group flex items-baseline gap-1.5 font-mono text-[0.875rem] tracking-[0.04em] uppercase text-ink hover:text-accent transition-colors">
      <span class="font-medium">Clear</span>
      <span class="text-accent">/</span>
      <span class="font-medium">Slope</span>
    </a>

    <nav class="hidden md:flex items-center gap-6">
      {NAV_LINKS.map((l) => (
        <a
          href={l.href}
          class:list={[
            "link-mono hover:text-accent",
            isActive(l.href) && "text-accent",
          ]}
        >
          {l.label}
        </a>
      ))}
      <a
        href="/book/"
        class="link-mono inline-flex items-center gap-1.5 text-accent hover:text-accent-hover"
      >
        <span>Book a call</span>
        <span aria-hidden="true">↗</span>
      </a>
    </nav>

    <a
      href="/book/"
      class="md:hidden link-mono inline-flex items-center gap-1.5 text-accent"
    >
      <span>Book</span>
      <span aria-hidden="true">↗</span>
    </a>
  </div>
</header>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/Nav.astro
git commit -m "feat: Nav uses full link set from site data"
```

### Task 7.2: NewsletterForm component

**Files:**
- Create: `src/components/forms/NewsletterForm.astro`

- [ ] **Step 1:** Create:

```astro
---
import { WEB3FORMS_ACCESS_KEY } from "../../data/site";
interface Props { variant?: "inline" | "stacked" }
const { variant = "inline" } = Astro.props;
---
<form
  data-newsletter-form
  action="https://api.web3forms.com/submit"
  method="POST"
  novalidate
  class:list={[
    variant === "inline"
      ? "flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
      : "flex flex-col gap-3",
  ]}
>
  <input type="hidden" name="access_key" value={WEB3FORMS_ACCESS_KEY} />
  <input
    type="hidden"
    name="subject"
    value="Newsletter signup — clearslopedigital.com"
  />
  <input type="hidden" name="from_name" value="Newsletter signup" />
  <input
    type="checkbox"
    name="botcheck"
    class="hidden"
    tabindex="-1"
    autocomplete="off"
  />

  <div class="flex flex-col gap-2 flex-1">
    <label for="newsletter-email" class="mono-label">Email</label>
    <input
      id="newsletter-email"
      name="email"
      type="email"
      required
      autocomplete="email"
      class="cs-input"
      placeholder="you@yourbusiness.com"
    />
  </div>

  <button
    type="submit"
    data-newsletter-submit
    class="cta-primary-large group hover:bg-accent-hover hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
  >
    <span data-newsletter-button-label>Subscribe</span>
    <span aria-hidden="true">↗</span>
  </button>
</form>

<p data-newsletter-status class="mono-label mt-3" role="status" aria-live="polite">
  ~2 posts/month. No tracking, no spam.
</p>

<script is:inline>
  (() => {
    const form = document.querySelector("[data-newsletter-form]");
    if (!form) return;
    const status = form.parentElement.querySelector("[data-newsletter-status]");
    const button = form.querySelector("[data-newsletter-submit]");
    const label = form.querySelector("[data-newsletter-button-label]");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const botcheck = form.querySelector('input[name="botcheck"]');
      if (botcheck && botcheck.checked) return;

      const email = form.querySelector('input[name="email"]');
      if (!email.checkValidity()) {
        email.focus();
        status.textContent = "Enter a valid email.";
        return;
      }

      button.disabled = true;
      label.textContent = "Sending…";

      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: new FormData(form),
        });
        const json = await res.json().catch(() => ({}));
        if (res.ok && json.success) {
          form.hidden = true;
          status.textContent = "Subscribed. Talk soon.";
        } else {
          status.textContent = (json && json.message) || "Could not send.";
          button.disabled = false;
          label.textContent = "Subscribe";
        }
      } catch {
        status.textContent = "Network error. Try again.";
        button.disabled = false;
        label.textContent = "Subscribe";
      }
    });
  })();
</script>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/forms/NewsletterForm.astro
git commit -m "feat: add NewsletterForm posting to Web3Forms"
```

### Task 7.3: Move ContactForm into forms/ subdir

**Files:**
- Create: `src/components/forms/ContactForm.astro` (moved)
- Delete: `src/components/ContactForm.astro`

- [ ] **Step 1:** Move the file:

```bash
git mv src/components/ContactForm.astro src/components/forms/ContactForm.astro
```

- [ ] **Step 2:** Update its `ACCESS_KEY` to import from site data. Open `src/components/forms/ContactForm.astro` and replace the frontmatter:

```astro
---
import { WEB3FORMS_ACCESS_KEY } from "../../data/site";
const ACCESS_KEY = WEB3FORMS_ACCESS_KEY;
---
```

(Drop the leading comment block about replacing the key — the key now lives in `src/data/site.ts`.)

- [ ] **Step 3:** Update the only existing import in `src/components/FinalCTA.astro` (will be deleted in Task 13.1, but until then must stay valid). Open `src/components/FinalCTA.astro` and change:

```astro
import ContactForm from "./ContactForm.astro";
```

to:

```astro
import ContactForm from "./forms/ContactForm.astro";
```

- [ ] **Step 4:** Verify build still compiles

```bash
npx astro build
```

Expected: build succeeds. (May fail later when `index.astro` is rewritten — but at this checkpoint it should still build.)

- [ ] **Step 5:** Commit

```bash
git add -A
git commit -m "refactor: move ContactForm to forms/ subdir, share Web3Forms key"
```

### Task 7.4: AuthorByline component

**Files:**
- Create: `src/components/author/AuthorByline.astro`

- [ ] **Step 1:** Create:

```astro
---
import { AUTHOR } from "../../data/author";
interface Props {
  publishDate: Date;
  readingMinutes: number;
}
const { publishDate, readingMinutes } = Astro.props;
const formatted = publishDate.toLocaleDateString("en-CA", {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});
---
<div class="flex items-center gap-3 py-4 border-y border-rule">
  <img
    src={AUTHOR.imagePath64}
    width="32"
    height="32"
    alt={AUTHOR.name}
    class="rounded-full"
    loading="eager"
    decoding="async"
  />
  <div class="flex flex-col">
    <span class="text-ink font-medium" style="font-size: 0.95rem;">
      By <a href="/about/" class="hover:text-accent">{AUTHOR.name}</a> · {AUTHOR.jobTitle}
    </span>
    <span class="mono-label">
      Published {formatted} · {readingMinutes} min read
    </span>
  </div>
</div>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/author/AuthorByline.astro
git commit -m "feat: add AuthorByline component"
```

### Task 7.5: AuthorBox component

**Files:**
- Create: `src/components/author/AuthorBox.astro`

- [ ] **Step 1:** Create:

```astro
---
import { AUTHOR } from "../../data/author";
---
<aside class="mt-16 p-8 md:p-10 rounded-sm border border-rule-strong bg-bg-deep">
  <div class="flex flex-col md:flex-row gap-6 items-start">
    <img
      src={AUTHOR.imagePath160}
      width="80"
      height="80"
      alt={AUTHOR.name}
      class="rounded-full shrink-0"
      loading="lazy"
      decoding="async"
    />
    <div class="flex-1">
      <h3
        class="font-sans font-medium text-ink"
        style="font-size: var(--text-h3); line-height: var(--text-h3--line-height); letter-spacing: var(--text-h3--letter-spacing);"
      >
        <a href="/about/" class="hover:text-accent">{AUTHOR.name}</a>
      </h3>
      <p class="mono-label mt-1">{AUTHOR.jobTitle}</p>
      <p class="text-ink-soft mt-4 leading-relaxed" style="font-size: var(--text-body);">
        {AUTHOR.shortBio}
      </p>
      <div class="mt-6 flex flex-wrap items-center gap-5">
        <a
          href="/book/"
          class="cta-primary-large group hover:bg-accent-hover hover:-translate-y-px"
        >
          Book a discovery call
          <span aria-hidden="true">↗</span>
        </a>
        <a
          href={AUTHOR.sameAs[0]}
          rel="noopener"
          target="_blank"
          class="link-mono inline-flex items-center gap-1.5 hover:text-accent"
        >
          <span>LinkedIn</span>
          <span class="text-accent">↗</span>
        </a>
      </div>
    </div>
  </div>
</aside>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/author/AuthorBox.astro
git commit -m "feat: add AuthorBox component"
```

### Task 7.6: CalEmbed component

**Files:**
- Create: `src/components/cta/CalEmbed.astro`

- [ ] **Step 1:** Create:

```astro
---
import { CAL_URL } from "../../data/site";
interface Props { variant?: "inline" | "compact" }
const { variant = "inline" } = Astro.props;
const minHeight = variant === "compact" ? "640px" : "780px";
---
<div
  data-cal-target
  class="w-full"
  style={`min-height:${minHeight};`}
></div>

<script is:inline define:vars={{ calLink: CAL_URL }}>
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () {
      let cal = C.Cal;
      let ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments); };
        const namespace = ar[1];
        api.q = api.q || [];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", "discovery-call", { origin: "https://app.cal.com" });
  Cal.ns["discovery-call"]("inline", {
    elementOrSelector: "[data-cal-target]",
    config: { layout: "month_view" },
    calLink: calLink,
  });
  Cal.ns["discovery-call"]("ui", {
    hideEventTypeDetails: false,
    layout: "month_view",
  });
</script>
```

`define:vars` injects the `calLink` const into the inline script at build time, so the URL from `src/data/site.ts` flows through cleanly without DOM-attribute round-tripping.

- [ ] **Step 2:** Commit

```bash
git add src/components/cta/CalEmbed.astro
git commit -m "feat: add CalEmbed component"
```

### Task 7.7: Breadcrumbs component

**Files:**
- Create: `src/components/Breadcrumbs.astro`

- [ ] **Step 1:** Create:

```astro
---
type Crumb = { name: string; path: string };
interface Props { items: Crumb[] }
const { items } = Astro.props;
---
<nav aria-label="Breadcrumb" class="mb-6">
  <ol class="flex flex-wrap items-center gap-2 mono-label">
    {items.map((c, i) => (
      <li class="flex items-center gap-2">
        {i < items.length - 1 ? (
          <a href={c.path} class="hover:text-accent">{c.name}</a>
        ) : (
          <span class="text-ink">{c.name}</span>
        )}
        {i < items.length - 1 && <span class="text-ink-soft">/</span>}
      </li>
    ))}
  </ol>
</nav>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/Breadcrumbs.astro
git commit -m "feat: add Breadcrumbs component"
```

### Task 7.8: PageHero component

**Files:**
- Create: `src/components/PageHero.astro`

- [ ] **Step 1:** Create:

```astro
---
interface Props {
  eyebrow?: string;
  h1: string;
  lede?: string;
}
const { eyebrow, h1, lede } = Astro.props;
---
<section class="pt-12 pb-12 md:pt-16 md:pb-16 border-b border-rule">
  <div class="container-page">
    {eyebrow && (
      <div class="flex items-center gap-3 mb-6">
        <span class="mono-label">{eyebrow}</span>
        <span class="h-px w-12 bg-rule"></span>
      </div>
    )}
    <h1
      class="font-sans font-semibold tracking-tight text-ink max-w-[28ch]"
      style="font-size: var(--text-display); line-height: var(--text-display--line-height); letter-spacing: var(--text-display--letter-spacing);"
    >
      <slot name="h1">{h1}</slot>
    </h1>
    {lede && (
      <p
        class="mt-8 max-w-[60ch] text-ink-soft leading-relaxed"
        style="font-size: var(--text-body); line-height: var(--text-body--line-height);"
      >
        {lede}
      </p>
    )}
    <slot />
  </div>
</section>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/PageHero.astro
git commit -m "feat: add PageHero component"
```

### Task 7.9: PostCard component

**Files:**
- Create: `src/components/PostCard.astro`

- [ ] **Step 1:** Create:

```astro
---
interface Props {
  href: string;
  title: string;
  description: string;
  publishDate: Date;
  readingMinutes: number;
  cluster: "pest-control" | "voice-agent" | "operator-pov";
}
const { href, title, description, publishDate, readingMinutes, cluster } =
  Astro.props;
const labels: Record<string, string> = {
  "pest-control": "Pest Control",
  "voice-agent": "Voice Agents",
  "operator-pov": "Operator POV",
};
const formatted = publishDate.toLocaleDateString("en-CA", {
  year: "numeric",
  month: "short",
  day: "numeric",
});
---
<article class="group flex flex-col p-6 md:p-8 rounded-sm border border-rule-strong bg-bg-deep hover:border-accent/40 lift-on-hover hover:-translate-y-1">
  <div class="flex items-baseline justify-between mb-4">
    <span class="mono-label !text-accent">{labels[cluster]}</span>
    <span class="mono-label">{readingMinutes} min</span>
  </div>
  <h3
    class="font-sans font-medium text-ink mb-3"
    style="font-size: var(--text-h3); line-height: var(--text-h3--line-height); letter-spacing: var(--text-h3--letter-spacing);"
  >
    <a href={href} class="hover:text-accent">{title}</a>
  </h3>
  <p class="text-ink-soft leading-relaxed mb-6" style="font-size: var(--text-body);">
    {description}
  </p>
  <div class="mt-auto flex items-center justify-between">
    <span class="mono-label">{formatted}</span>
    <a
      href={href}
      class="link-mono inline-flex items-center gap-1.5 group-hover:text-accent"
    >
      <span>Read</span>
      <span aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
    </a>
  </div>
</article>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/PostCard.astro
git commit -m "feat: add PostCard component"
```

### Task 7.10: ServiceCard component

**Files:**
- Create: `src/components/ServiceCard.astro`

- [ ] **Step 1:** Create:

```astro
---
interface Props {
  href: string;
  num: string;
  title: string;
  body: string;
  outcomes: string[];
}
const { href, num, title, body, outcomes } = Astro.props;
---
<article class="group flex flex-col p-8 md:p-10 rounded-sm border border-rule-strong bg-bg-deep hover:border-accent/40 lift-on-hover hover:-translate-y-1">
  <div class="flex items-baseline justify-between mb-6">
    <span class="mono-label !text-accent">{num}</span>
  </div>
  <h3
    class="font-sans font-medium text-ink mb-5"
    style="font-size: var(--text-h3); line-height: var(--text-h3--line-height); letter-spacing: var(--text-h3--letter-spacing);"
  >
    <a href={href} class="hover:text-accent">{title}</a>
  </h3>
  <p class="text-ink-soft leading-relaxed mb-8" style="font-size: var(--text-body);">
    {body}
  </p>
  <ul class="flex flex-col gap-2 mb-10 pt-6 border-t border-rule">
    {outcomes.map((o) => (
      <li class="flex items-start gap-3 text-ink" style="font-size: var(--text-body);">
        <span class="text-accent mt-[2px] shrink-0">↗</span>
        <span>{o}</span>
      </li>
    ))}
  </ul>
  <a
    href={href}
    class="link-mono inline-flex items-center gap-1.5 mt-auto self-start group-hover:text-accent"
  >
    <span>Read more</span>
    <span aria-hidden="true" class="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
  </a>
</article>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/ServiceCard.astro
git commit -m "feat: add ServiceCard component"
```

### Task 7.11: Footer with newsletter + nav columns + NAP

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1:** Replace the file with:

```astro
---
import NewsletterForm from "./forms/NewsletterForm.astro";
import { NAV_LINKS, ORG_ADDRESS, SITE_NAME } from "../data/site";
import { AUTHOR } from "../data/author";
const year = new Date().getFullYear();
---
<footer class="border-t border-rule pt-16 pb-12 mt-24">
  <div class="container-page grid grid-cols-1 md:grid-cols-12 gap-10">
    <div class="md:col-span-5">
      <a href="/" class="flex items-baseline gap-1.5 font-mono text-[0.875rem] tracking-[0.04em] uppercase text-ink hover:text-accent transition-colors">
        <span class="font-medium">Clear</span>
        <span class="text-accent">/</span>
        <span class="font-medium">Slope</span>
      </a>
      <p class="mt-4 text-ink-soft max-w-[42ch] leading-relaxed" style="font-size: var(--text-body);">
        AI voice agents, agentic workflows, and local SEO for service businesses across Canada and the US.
      </p>
      <p class="mt-4 mono-label">
        {ORG_ADDRESS.addressLocality}, {ORG_ADDRESS.addressRegion}, {ORG_ADDRESS.addressCountry}
      </p>
    </div>

    <nav class="md:col-span-3 flex flex-col gap-3">
      <span class="mono-label">Site</span>
      {NAV_LINKS.map((l) => (
        <a href={l.href} class="text-ink hover:text-accent" style="font-size: var(--text-body);">
          {l.label}
        </a>
      ))}
      <a href="/book/" class="text-ink hover:text-accent" style="font-size: var(--text-body);">
        Book a call
      </a>
      <a href={AUTHOR.sameAs[0]} rel="noopener" target="_blank" class="text-ink hover:text-accent" style="font-size: var(--text-body);">
        LinkedIn
      </a>
    </nav>

    <div class="md:col-span-4">
      <span class="mono-label block mb-3">Newsletter</span>
      <NewsletterForm variant="stacked" />
    </div>
  </div>

  <div class="container-page mt-12 pt-8 border-t border-rule flex flex-wrap items-center justify-between gap-4 mono-label">
    <span>© {year} {SITE_NAME}</span>
    <span>Built with Astro</span>
  </div>
</footer>
```

- [ ] **Step 2:** Commit

```bash
git add src/components/Footer.astro
git commit -m "feat: Footer with newsletter, nav columns, NAP"
```

---

## Phase 8: Service pages

### Task 8.1: Scaffold service markdown — ai-voice-agent

**Files:**
- Create: `src/content/services/ai-voice-agent.md`

- [ ] **Step 1:** Create:

```md
---
title: "AI Voice Agents for Service Businesses"
h1: "AI Voice Agents for Service Businesses"
description: "AI voice agents that capture missed calls during peak hours and after hours, qualify leads, and book the job. Built custom for your service business."
slug: "ai-voice-agent"
serviceType: "AI Voice Agent"
order: 1
faq:
  - q: "How is this different from a generic answering service?"
    a: "An answering service forwards messages. A voice agent qualifies the lead, answers FAQs in your voice, and books the job into your calendar — all without a human in the loop."
  - q: "What does it cost?"
    a: "Fixed monthly fee scoped to your call volume and integration needs. No per-lead fees. Pricing is discussed on the discovery call once we understand the scope."
  - q: "How long does it take to build?"
    a: "Typically 3-5 weeks from kickoff. Most of that is integration and voice tuning, not training."
  - q: "What happens when the agent gets stuck?"
    a: "Configurable. We can route to voicemail, your cell, or a human dispatcher. Most operators choose a graceful handoff with full context."
  - q: "Will customers know it's AI?"
    a: "We don't deceive callers. The agent introduces itself naturally. In our experience, customers care about getting their problem solved, not who solves it."
relatedNotes:
  - "how-pest-control-operators-lose-revenue-to-missed-calls"
  - "when-an-ai-voice-agent-actually-pays-for-itself"
  - "what-an-ai-voice-agent-cannot-do-and-shouldnt-pretend-to"
---

## The problem

[CONTENT TODO — pull pain framing from spec section 3A. Anchor with the All Greens 1,346 classified calls proof point. ~250 words.]

## How it works

[CONTENT TODO — describe intake, qualification, booking handoff. Mechanism, not features. ~300 words.]

## Where it fits

[CONTENT TODO — industries (pest control, HVAC, plumbing, roofing, cleaning, etc.), company-size signals (call volume, owner-operator vs. dispatcher). ~200 words.]

## What you get

[CONTENT TODO — concrete deliverables list. ~150 words.]
```

- [ ] **Step 2:** Verify the collection schema accepts it

```bash
npx astro sync
```

Expected: no validation errors.

- [ ] **Step 3:** Commit

```bash
git add src/content/services/ai-voice-agent.md
git commit -m "content: scaffold ai-voice-agent service page"
```

### Task 8.2: Scaffold service markdown — agentic-workflows

**Files:**
- Create: `src/content/services/agentic-workflows.md`

- [ ] **Step 1:** Create with the same shape as 8.1:

```md
---
title: "Agentic Workflows: Custom AI That Runs Your Back Office"
h1: "Agentic Workflows: Custom AI That Runs Your Back Office"
description: "Custom-built AI workflows that automate review requests, follow-ups, scheduling, and reporting across your CRM, email, and calendar — without changing how you work."
slug: "agentic-workflows"
serviceType: "Agentic Workflow"
order: 2
faq:
  - q: "What's an agentic workflow?"
    a: "A workflow that uses AI to make decisions across multiple tools. Reading an email and writing a reply is one step; deciding what to do based on the email and acting across three systems is a workflow."
  - q: "What kinds of tasks do you automate?"
    a: "Review requests, customer follow-up, lead scoring, scheduling, reporting, content generation, internal triage. We scope to one workflow per engagement to keep delivery clean."
  - q: "What stack do you build on?"
    a: "Whatever you already use. The agent layer is custom; the connections plug into your existing CRM, email, and scheduling tools."
  - q: "What if I want to change the workflow later?"
    a: "Built to change. You own the code. We document each agent and provide a runbook for tuning prompts and routing."
  - q: "Can you maintain it after handoff?"
    a: "Optional ongoing support is available. Most operators take maintenance for the first 90 days, then move to ad-hoc."
relatedNotes:
  - "the-three-questions-i-ask-before-taking-on-a-service-business"
---

## The problem

[CONTENT TODO — manual ops, copy-paste between tools, owners doing $20/hour work. ~250 words.]

## How it works

[CONTENT TODO — orchestration, tool use, human-in-loop. ~300 words.]

## Where it fits

[CONTENT TODO — industries with high admin overhead. ~200 words.]

## What you get

[CONTENT TODO — concrete deliverables. ~150 words.]
```

- [ ] **Step 2:** Verify with `npx astro sync`. Commit:

```bash
git add src/content/services/agentic-workflows.md
git commit -m "content: scaffold agentic-workflows service page"
```

### Task 8.3: Scaffold service markdown — local-seo

**Files:**
- Create: `src/content/services/local-seo.md`

- [ ] **Step 1:** Create:

```md
---
title: "Local SEO for Service Businesses"
h1: "Local SEO for Service Businesses"
description: "Technical, content, and on-page SEO for service businesses that want to stop renting leads. Built to rank for the queries your customers actually search."
slug: "local-seo"
serviceType: "Local SEO"
order: 3
faq:
  - q: "How is this different from what a typical SEO agency does?"
    a: "Most local SEO is template citation building. We do the technical work, write content anchored to real customer language, and structure it for Google's entity graph."
  - q: "How long until I see results?"
    a: "Initial technical and on-page wins surface in 4-8 weeks. Content-driven rankings take 3-6 months. We'll set baseline measurements before starting."
  - q: "Do you guarantee rankings?"
    a: "No. Anyone who guarantees rankings is either lying or naive about how Google works. We guarantee work quality and transparency."
  - q: "Why fixed fee instead of pay-per-lead?"
    a: "Pay-per-lead aligns the agency with their own margin, not your business. Fixed fee aligns us with your long-term ranking, which is what compounds."
  - q: "What do I own at the end?"
    a: "All of it. Content, technical changes, GBP optimizations — they live on your domain and your profile. No lock-in."
relatedNotes:
  - "pest-control-seo-the-phonebook-effect-is-not-enough"
  - "why-i-charge-fixed-fees-not-pay-per-lead"
---

## The problem

[CONTENT TODO — the "phonebook effect" floor. Most SMBs invisible on Maps/SERP, paying for ads they could earn organically. ~300 words.]

## What we actually do

[CONTENT TODO — audit, technical fixes, on-page, GBP optimization, schema, content. ~400 words.]

## Pricing posture

[CONTENT TODO — anonymized comparison to "a national pay-per-lead agency charging $700 setup + $219/month" without naming SearchKings. Per spec naming convention. ~200 words.]

## What you get

[CONTENT TODO — concrete deliverables. ~150 words.]
```

- [ ] **Step 2:** Verify with `npx astro sync`. Commit:

```bash
git add src/content/services/local-seo.md
git commit -m "content: scaffold local-seo service page"
```

### Task 8.4: Service detail layout

**Files:**
- Create: `src/layouts/Service.astro`

- [ ] **Step 1:** Create:

```astro
---
import Page from "./Page.astro";
import PageHero from "../components/PageHero.astro";
import Breadcrumbs from "../components/Breadcrumbs.astro";
import CalEmbed from "../components/cta/CalEmbed.astro";
import { buildPageMeta } from "../lib/seo";
import {
  buildService,
  buildFaqPage,
  buildBreadcrumbs,
} from "../lib/schema";
import type { CollectionEntry } from "astro:content";

interface Props {
  entry: CollectionEntry<"services">;
}
const { entry } = Astro.props;
const data = entry.data;
const path = `/services/${data.slug}/`;

const meta = buildPageMeta({
  title: data.title,
  description: data.description,
  path,
  ogType: "website",
});
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services/" },
  { name: data.title, path },
];
const schema = [
  buildService({
    name: data.h1,
    description: data.description,
    slug: path,
    serviceType: data.serviceType,
  }),
  buildFaqPage(data.faq),
  buildBreadcrumbs(crumbs),
];
const { Content } = await entry.render();
---
<Page meta={meta} schema={schema}>
  <PageHero eyebrow="Service" h1={data.h1} lede={data.description}>
    <div class="mt-10 flex flex-wrap items-center gap-5">
      <a href="/book/" class="cta-primary-large hover:bg-accent-hover hover:-translate-y-px">
        Book a discovery call
        <span aria-hidden="true">↗</span>
      </a>
      <a href="#faq" class="link-mono inline-flex items-center gap-1.5 hover:text-accent">
        <span>Skip to FAQ</span>
        <span class="text-accent">↓</span>
      </a>
    </div>
  </PageHero>

  <article class="container-page grid grid-cols-1 lg:grid-cols-12 gap-10 py-16 md:py-20">
    <div class="lg:col-span-2">
      <Breadcrumbs items={crumbs} />
    </div>
    <div class="lg:col-span-8 prose-content">
      <Content />

      <section id="faq" class="mt-16">
        <h2
          class="font-sans font-medium text-ink mb-8"
          style="font-size: var(--text-h2); line-height: var(--text-h2--line-height); letter-spacing: var(--text-h2--letter-spacing);"
        >
          Frequently asked questions
        </h2>
        <dl class="flex flex-col gap-6">
          {data.faq.map((it) => (
            <div class="border-t border-rule pt-6">
              <dt
                class="font-sans font-medium text-ink mb-3"
                style="font-size: var(--text-h3);"
              >
                {it.q}
              </dt>
              <dd class="text-ink-soft leading-relaxed" style="font-size: var(--text-body);">
                {it.a}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  </article>

  <section class="container-page py-16 md:py-20 border-t border-rule">
    <h2
      class="font-sans font-medium text-ink mb-10"
      style="font-size: var(--text-h2); line-height: var(--text-h2--line-height);"
    >
      Book a call
    </h2>
    <CalEmbed variant="compact" />
  </section>
</Page>

<style is:global>
  .prose-content h2 {
    font-family: var(--font-sans);
    font-weight: 500;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    font-size: var(--text-h2);
    line-height: var(--text-h2--line-height);
    letter-spacing: var(--text-h2--letter-spacing);
  }
  .prose-content h3 {
    font-family: var(--font-sans);
    font-weight: 500;
    margin-top: 1.75rem;
    margin-bottom: 0.75rem;
    font-size: var(--text-h3);
    line-height: var(--text-h3--line-height);
    letter-spacing: var(--text-h3--letter-spacing);
  }
  .prose-content p {
    color: var(--color-ink-soft);
    line-height: 1.65;
    font-size: var(--text-body);
    margin-bottom: 1rem;
  }
  .prose-content ul, .prose-content ol {
    margin-left: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-ink-soft);
  }
  .prose-content a {
    color: var(--color-accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 3px;
  }
  .prose-content a:hover {
    color: var(--color-accent-hover);
  }
</style>
```

- [ ] **Step 2:** Commit

```bash
git add src/layouts/Service.astro
git commit -m "feat: add Service layout"
```

### Task 8.5: Service dynamic route

**Files:**
- Create: `src/pages/services/[slug].astro`

- [ ] **Step 1:** Create:

```astro
---
import { getCollection } from "astro:content";
import Service from "../../layouts/Service.astro";

export async function getStaticPaths() {
  const entries = await getCollection("services");
  return entries.map((entry) => ({
    params: { slug: entry.data.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---
<Service entry={entry} />
```

- [ ] **Step 2:** Build to verify

```bash
npx astro build
```

Expected: pages generated for `/services/ai-voice-agent/`, `/services/agentic-workflows/`, `/services/local-seo/`.

- [ ] **Step 3:** Commit

```bash
git add src/pages/services/[slug].astro
git commit -m "feat: add /services/[slug] route"
```

### Task 8.6: Services index page

**Files:**
- Create: `src/pages/services/index.astro`

- [ ] **Step 1:** Create:

```astro
---
import Page from "../../layouts/Page.astro";
import PageHero from "../../components/PageHero.astro";
import ServiceCard from "../../components/ServiceCard.astro";
import { getCollection } from "astro:content";
import { buildPageMeta } from "../../lib/seo";
import { buildBreadcrumbs, buildCollectionPage } from "../../lib/schema";

const entries = (await getCollection("services")).sort(
  (a, b) => a.data.order - b.data.order,
);

const meta = buildPageMeta({
  title: "Services",
  description:
    "AI voice agents, agentic workflows, and local SEO for service businesses across Canada and the US. Custom-built, fixed fee, no per-lead pricing.",
  path: "/services/",
});
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services/" },
];
const schema = [
  buildCollectionPage({
    name: "Services",
    description: meta.description,
    slug: "/services/",
  }),
  buildBreadcrumbs(crumbs),
];
const numbers = ["01", "02", "03"];
---
<Page meta={meta} schema={schema}>
  <PageHero
    eyebrow="Services"
    h1="Three services. One operator."
    lede="Voice agents, workflows, and local SEO. Built custom, scoped to your business, billed on a fixed fee."
  />
  <section class="container-page py-16 md:py-20">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
      {entries.map((e, i) => (
        <ServiceCard
          href={`/services/${e.data.slug}/`}
          num={numbers[i]}
          title={e.data.h1}
          body={e.data.description}
          outcomes={e.data.faq.slice(0, 3).map((f) => f.q)}
        />
      ))}
    </div>
  </section>
</Page>
```

- [ ] **Step 2:** Build to verify

```bash
npx astro build
```

- [ ] **Step 3:** Commit

```bash
git add src/pages/services/index.astro
git commit -m "feat: add /services/ index page"
```

---

## Phase 9: Notes (blog) pages

### Task 9.1: Scaffold the 6 blog posts

**Files:** (all create)
- `src/content/notes/how-pest-control-operators-lose-revenue-to-missed-calls.md`
- `src/content/notes/pest-control-seo-the-phonebook-effect-is-not-enough.md`
- `src/content/notes/when-an-ai-voice-agent-actually-pays-for-itself.md`
- `src/content/notes/what-an-ai-voice-agent-cannot-do-and-shouldnt-pretend-to.md`
- `src/content/notes/why-i-charge-fixed-fees-not-pay-per-lead.md`
- `src/content/notes/the-three-questions-i-ask-before-taking-on-a-service-business.md`

- [ ] **Step 1:** Create file 1, `how-pest-control-operators-lose-revenue-to-missed-calls.md`:

```md
---
title: "How Pest Control Operators Lose Revenue to Missed Calls"
description: "A data-driven look at how missed calls quietly drain pest control businesses, anchored to a Metro Vancouver operator's 1,346-call dataset."
publishDate: 2026-05-12
cluster: pest-control
featured: true
---

## The math nobody runs

[CONTENT TODO — open with the framing of the 1,346 classified calls dataset, anonymized. What % of calls go to voicemail. What's the dollar value of a recovered call. ~400 words.]

## Why this happens to good operators

[CONTENT TODO — peak hours, after hours, dispatcher overload, summer surge. ~400 words.]

## What recovers the calls

[CONTENT TODO — three options ordered by cost: hire, answering service, voice agent. ~400 words.]

## What we did for one Metro Vancouver operator

[CONTENT TODO — anonymized case-study summary linking to /work/pest-control-vancouver/. ~300 words.]

## Where to start if you suspect this is happening to you

[CONTENT TODO — concrete steps, including measuring baseline. CTA to discovery call. ~300 words.]
```

- [ ] **Step 2:** Create file 2, `pest-control-seo-the-phonebook-effect-is-not-enough.md`:

```md
---
title: "Pest Control SEO: The Phonebook Effect Is Not Enough"
description: "Why showing up in Google Maps is the floor of local SEO for pest control, not the ceiling. The technical and content work that actually moves rankings."
publishDate: 2026-05-26
cluster: pest-control
---

## The phonebook effect

[CONTENT TODO — define the floor: branded queries, navigational searches. Why most operators stop here and call it SEO. ~400 words.]

## What ranks above the floor

[CONTENT TODO — service-area pages, seasonal queries (carpenter ants in spring, rodents in fall), review velocity, local content. ~600 words.]

## A pest-control-specific checklist

[CONTENT TODO — 10-12 concrete items: GBP optimization, schema, citation consistency, service-area landing pages, local content, link patterns. ~600 words.]

## What we audit before taking the work

[CONTENT TODO — what we look for, what disqualifies. Builds trust + filters leads. ~400 words.]
```

- [ ] **Step 3:** Create file 3, `when-an-ai-voice-agent-actually-pays-for-itself.md`:

```md
---
title: "When an AI Voice Agent Actually Pays for Itself"
description: "A unit-economics breakdown of when a custom AI voice agent makes financial sense, versus an answering service or a part-time receptionist."
publishDate: 2026-06-09
cluster: voice-agent
---

## The three numbers that matter

[CONTENT TODO — average ticket size, missed-call rate, conversion-on-pickup. ~300 words.]

## Run the math

[CONTENT TODO — formula and worked example. ~500 words.]

## When it doesn't pay yet

[CONTENT TODO — honest disqualifiers: low call volume, low ticket, fully-staffed front office. ~300 words.]

## Compared to alternatives

[CONTENT TODO — answering service (~$50-200/mo, but no qualification), part-time receptionist ($1500-3500/mo). ~400 words.]
```

- [ ] **Step 4:** Create file 4, `what-an-ai-voice-agent-cannot-do-and-shouldnt-pretend-to.md`:

```md
---
title: "What an AI Voice Agent Cannot Do (And Shouldn't Pretend To)"
description: "Honest limitations of AI voice agents: emotional escalation, complex disambiguation, and edge cases. What we route to humans and why."
publishDate: 2026-06-23
cluster: voice-agent
---

## What it does well

[CONTENT TODO — booking, qualification, FAQ, after-hours. ~250 words.]

## What it does poorly

[CONTENT TODO — emotional callers, complex disambiguation, novel situations. ~400 words.]

## Where we route to humans

[CONTENT TODO — design pattern: graceful handoff with full context. ~350 words.]

## Why we don't deceive callers

[CONTENT TODO — operator POV. The agent introduces itself naturally. ~300 words.]
```

- [ ] **Step 5:** Create file 5, `why-i-charge-fixed-fees-not-pay-per-lead.md`:

```md
---
title: "Why I Charge Fixed Fees, Not Pay-Per-Lead"
description: "A founder's case for fixed-fee pricing in local SEO and AI work — and why pay-per-lead agencies are misaligned with the businesses they serve."
publishDate: 2026-07-07
cluster: operator-pov
featured: true
---

## What pay-per-lead actually optimizes for

[CONTENT TODO — agency margin, not your business. Anonymized comparison: "a national pay-per-lead agency charging $700 setup and $219/month for leads you don't own". ~500 words.]

## Why I'm fixed fee

[CONTENT TODO — alignment, ownership, no incentive to inflate ticket counts. ~400 words.]

## What that costs

[CONTENT TODO — honest about the tradeoff: bigger upfront commitment, no per-lead variable spend. ~300 words.]

## When pay-per-lead is the right choice

[CONTENT TODO — fairness check: it can work for very-low-volume operators or test markets. ~300 words.]
```

- [ ] **Step 6:** Create file 6, `the-three-questions-i-ask-before-taking-on-a-service-business.md`:

```md
---
title: "The Three Questions I Ask Before Taking On a Service Business"
description: "The qualifying filter I run on prospective clients: call volume baseline, owner involvement in operations, and willingness to be named in content."
publishDate: 2026-07-21
cluster: operator-pov
---

## Question one: what does your call data look like?

[CONTENT TODO — why baseline matters, what good looks like, what disqualifies. ~400 words.]

## Question two: are you in the business or above it?

[CONTENT TODO — why owner-operator buy-in matters more than budget. ~400 words.]

## Question three: can I anonymize you in writing?

[CONTENT TODO — case study posture, how anonymization works in practice. ~300 words.]

## Why I run this filter

[CONTENT TODO — operator POV: small client roster, every engagement matters. ~300 words.]
```

- [ ] **Step 7:** Verify all six pass schema validation

```bash
npx astro sync
```

Expected: no errors.

- [ ] **Step 8:** Commit

```bash
git add src/content/notes/
git commit -m "content: scaffold first six notes posts"
```

### Task 9.2: Note layout

**Files:**
- Create: `src/layouts/Note.astro`

- [ ] **Step 1:** Create:

```astro
---
import Page from "./Page.astro";
import Breadcrumbs from "../components/Breadcrumbs.astro";
import AuthorByline from "../components/author/AuthorByline.astro";
import AuthorBox from "../components/author/AuthorBox.astro";
import NewsletterForm from "../components/forms/NewsletterForm.astro";
import { buildPageMeta } from "../lib/seo";
import { buildArticle, buildBreadcrumbs } from "../lib/schema";
import { readingTimeMinutes } from "../lib/reading-time";
import type { CollectionEntry } from "astro:content";

interface Props {
  entry: CollectionEntry<"notes">;
}
const { entry } = Astro.props;
const data = entry.data;
const path = `/notes/${entry.slug}/`;
const minutes = readingTimeMinutes(entry.body);

const meta = buildPageMeta({
  title: data.title,
  description: data.description,
  path,
  ogType: "article",
  ogImage: data.image,
});
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes/" },
  { name: data.title, path },
];
const schema = [
  buildArticle({
    headline: data.title,
    description: data.description,
    slug: path,
    datePublished: data.publishDate.toISOString().slice(0, 10),
    dateModified: (data.updatedDate ?? data.publishDate)
      .toISOString()
      .slice(0, 10),
    image: meta.ogImageAbsolute,
  }),
  buildBreadcrumbs(crumbs),
];

const { Content } = await entry.render();
---
<Page meta={meta} schema={schema}>
  <article class="container-page grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 pb-16 md:pt-16">
    <div class="lg:col-span-2">
      <Breadcrumbs items={crumbs} />
    </div>
    <div class="lg:col-span-8 max-w-[var(--container-prose)]">
      <h1
        class="font-sans font-semibold tracking-tight text-ink"
        style="font-size: var(--text-display); line-height: var(--text-display--line-height); letter-spacing: var(--text-display--letter-spacing);"
      >
        {data.title}
      </h1>
      <AuthorByline publishDate={data.publishDate} readingMinutes={minutes} />
      <div class="prose-content mt-12">
        <Content />
      </div>
      <AuthorBox />
      <section class="mt-16 border-t border-rule pt-12">
        <h3
          class="font-sans font-medium text-ink mb-4"
          style="font-size: var(--text-h3);"
        >
          Get new notes when they ship.
        </h3>
        <NewsletterForm />
      </section>
    </div>
  </article>
</Page>
```

- [ ] **Step 2:** Commit

```bash
git add src/layouts/Note.astro
git commit -m "feat: add Note layout"
```

### Task 9.3: Note dynamic route

**Files:**
- Create: `src/pages/notes/[slug].astro`

- [ ] **Step 1:** Create:

```astro
---
import { getCollection } from "astro:content";
import Note from "../../layouts/Note.astro";

export async function getStaticPaths() {
  const entries = (await getCollection("notes")).filter(
    (e) => !e.data.draft,
  );
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---
<Note entry={entry} />
```

- [ ] **Step 2:** Build

```bash
npx astro build
```

Expected: 6 note pages generated.

- [ ] **Step 3:** Commit

```bash
git add src/pages/notes/[slug].astro
git commit -m "feat: add /notes/[slug] route"
```

### Task 9.4: Notes index page

**Files:**
- Create: `src/pages/notes/index.astro`

- [ ] **Step 1:** Create:

```astro
---
import Page from "../../layouts/Page.astro";
import PageHero from "../../components/PageHero.astro";
import PostCard from "../../components/PostCard.astro";
import NewsletterForm from "../../components/forms/NewsletterForm.astro";
import { getCollection } from "astro:content";
import { buildPageMeta } from "../../lib/seo";
import { buildCollectionPage, buildBreadcrumbs } from "../../lib/schema";
import { readingTimeMinutes } from "../../lib/reading-time";

const all = (await getCollection("notes")).filter((e) => !e.data.draft);
all.sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
);

const meta = buildPageMeta({
  title: "Notes",
  description:
    "Field notes on AI voice agents, agentic workflows, and local SEO for service businesses. Two posts a month, no fluff.",
  path: "/notes/",
});
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Notes", path: "/notes/" },
];
const schema = [
  buildCollectionPage({
    name: "Notes",
    description: meta.description,
    slug: "/notes/",
  }),
  buildBreadcrumbs(crumbs),
];
---
<Page meta={meta} schema={schema}>
  <PageHero
    eyebrow="Notes"
    h1="Notes from the workshop."
    lede="Two posts a month on what's working — voice agents, workflows, local SEO, and the operator economics behind them."
  />
  <section class="container-page py-12">
    <div class="max-w-2xl">
      <NewsletterForm />
    </div>
  </section>
  <section class="container-page py-12 md:py-16">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {all.map((e) => (
        <PostCard
          href={`/notes/${e.slug}/`}
          title={e.data.title}
          description={e.data.description}
          publishDate={e.data.publishDate}
          readingMinutes={readingTimeMinutes(e.body)}
          cluster={e.data.cluster}
        />
      ))}
    </div>
  </section>
</Page>
```

- [ ] **Step 2:** Build & commit

```bash
npx astro build
git add src/pages/notes/index.astro
git commit -m "feat: add /notes/ index page"
```

### Task 9.5: Notes RSS feed

**Files:**
- Create: `src/pages/notes/rss.xml.ts`

- [ ] **Step 1:** Create:

```ts
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
    title: `${SITE_NAME} — Notes`,
    description: SITE_DESCRIPTION,
    site: context.site ?? SITE_URL,
    items: all.map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.publishDate,
      link: `/notes/${e.slug}/`,
    })),
  });
}
```

- [ ] **Step 2:** Build & verify

```bash
npx astro build && ls dist/notes/rss.xml
```

Expected: file exists.

- [ ] **Step 3:** Commit

```bash
git add src/pages/notes/rss.xml.ts
git commit -m "feat: add notes RSS feed"
```

### Task 9.6: Add RSS link to Base.astro head

**Files:**
- Modify: `src/layouts/Base.astro`

- [ ] **Step 1:** Add inside `<head>`, after the favicon link:

```astro
<link rel="alternate" type="application/rss+xml" title="Clear Slope Digital — Notes" href="/notes/rss.xml" />
```

- [ ] **Step 2:** Commit

```bash
git add src/layouts/Base.astro
git commit -m "feat: link RSS feed in head"
```

---

## Phase 10: Work / Case study

### Task 10.1: Scaffold the case study markdown

**Files:**
- Create: `src/content/work/pest-control-vancouver.md`

- [ ] **Step 1:** Read the source data file once before scaffolding:

```bash
cat "/home/user/Projects/Clients/All Greens Pest Control/Analysis/summary.txt" | head -100
```

This grounds the scaffold in defensible numbers.

- [ ] **Step 2:** Create:

```md
---
title: "How a Metro Vancouver pest control operator replaced a $700-setup, $219/month national pay-per-lead service with custom AI infrastructure"
h1: "How a Metro Vancouver pest control operator replaced a $700-setup, $219/month pay-per-lead service with custom AI infrastructure"
description: "A pest control operator in Metro Vancouver replaced a national pay-per-lead service with a custom AI voice agent and local SEO stack. Here's what the data showed."
publishDate: 2026-05-15
clientLabel: "Metro Vancouver pest control operator"
location: "Metro Vancouver, BC"
tags: ["AI Voice Agent", "Local SEO", "Agentic Workflow"]
---

## Context

[CONTENT TODO — operator profile (anonymized: "a Metro Vancouver pest control operator"), market, prior agency situation. Reference the prior agency only as "a national pay-per-lead agency charging $700 setup + $219/month". ~400 words.]

## The problem

[CONTENT TODO — call volume vs. revenue conversion. Anchor with the 1,346 classified calls dataset. What % went to voicemail. What recoverable revenue looked like. Only use numbers defensible from /home/user/Projects/Clients/All Greens Pest Control/Analysis/summary.txt. ~700 words.]

## What we built

[CONTENT TODO — three components: voice agent (intake, qualification, booking), agentic workflow (review requests, follow-up), local SEO stack (GBP, schema, content). ~600 words.]

## Results

[CONTENT TODO — call-classification numbers, leads recovered, time saved. Only metrics defensible from the source data. No projections, no "could have"s. ~600 words.]

## What we'd do differently

[CONTENT TODO — honest retrospection. ~300 words.]

## Frequently asked questions

[CONTENT TODO — 4-5 Q&As covering common prospect questions about a build like this. ~400 words.]
```

- [ ] **Step 3:** Verify with `npx astro sync`. Commit:

```bash
git add src/content/work/pest-control-vancouver.md
git commit -m "content: scaffold pest-control-vancouver case study"
```

### Task 10.2: Work layout

**Files:**
- Create: `src/layouts/Work.astro`

- [ ] **Step 1:** Create:

```astro
---
import Page from "./Page.astro";
import Breadcrumbs from "../components/Breadcrumbs.astro";
import AuthorByline from "../components/author/AuthorByline.astro";
import AuthorBox from "../components/author/AuthorBox.astro";
import CalEmbed from "../components/cta/CalEmbed.astro";
import { buildPageMeta } from "../lib/seo";
import { buildArticle, buildBreadcrumbs } from "../lib/schema";
import { readingTimeMinutes } from "../lib/reading-time";
import type { CollectionEntry } from "astro:content";

interface Props {
  entry: CollectionEntry<"work">;
}
const { entry } = Astro.props;
const data = entry.data;
const path = `/work/${entry.slug}/`;
const minutes = readingTimeMinutes(entry.body);

const meta = buildPageMeta({
  title: data.title,
  description: data.description,
  path,
  ogType: "article",
  ogImage: data.image,
});
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work/" },
  { name: data.clientLabel, path },
];
const schema = [
  buildArticle({
    headline: data.h1,
    description: data.description,
    slug: path,
    datePublished: data.publishDate.toISOString().slice(0, 10),
    dateModified: (data.updatedDate ?? data.publishDate)
      .toISOString()
      .slice(0, 10),
    image: meta.ogImageAbsolute,
  }),
  buildBreadcrumbs(crumbs),
];
const { Content } = await entry.render();
---
<Page meta={meta} schema={schema}>
  <article class="container-page grid grid-cols-1 lg:grid-cols-12 gap-10 pt-12 pb-16 md:pt-16">
    <div class="lg:col-span-2">
      <Breadcrumbs items={crumbs} />
    </div>
    <div class="lg:col-span-8 max-w-[var(--container-prose)]">
      <span class="mono-label !text-accent">Case study</span>
      <h1
        class="font-sans font-semibold tracking-tight text-ink mt-4"
        style="font-size: var(--text-display); line-height: var(--text-display--line-height); letter-spacing: var(--text-display--letter-spacing);"
      >
        {data.h1}
      </h1>
      <div class="mt-6 flex flex-wrap gap-3">
        {data.tags.map((tag) => (
          <span class="font-mono text-accent border border-accent/30 rounded-full px-3 py-0.5" style="font-size: var(--text-mono);">
            {tag}
          </span>
        ))}
      </div>
      <AuthorByline publishDate={data.publishDate} readingMinutes={minutes} />
      <div class="prose-content mt-12">
        <Content />
      </div>
      <AuthorBox />
    </div>
  </article>

  <section class="container-page py-16 md:py-20 border-t border-rule">
    <h2
      class="font-sans font-medium text-ink mb-10"
      style="font-size: var(--text-h2); line-height: var(--text-h2--line-height);"
    >
      Want a build like this?
    </h2>
    <CalEmbed variant="compact" />
  </section>
</Page>
```

- [ ] **Step 2:** Commit

```bash
git add src/layouts/Work.astro
git commit -m "feat: add Work layout"
```

### Task 10.3: Work dynamic route + index

**Files:**
- Create: `src/pages/work/[slug].astro`
- Create: `src/pages/work/index.astro`

- [ ] **Step 1:** Create `src/pages/work/[slug].astro`:

```astro
---
import { getCollection } from "astro:content";
import Work from "../../layouts/Work.astro";

export async function getStaticPaths() {
  const entries = await getCollection("work");
  return entries.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

const { entry } = Astro.props;
---
<Work entry={entry} />
```

- [ ] **Step 2:** Create `src/pages/work/index.astro`:

```astro
---
import Page from "../../layouts/Page.astro";
import PageHero from "../../components/PageHero.astro";
import { getCollection } from "astro:content";
import { buildPageMeta } from "../../lib/seo";
import { buildCollectionPage, buildBreadcrumbs } from "../../lib/schema";

const all = await getCollection("work");
all.sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
);

const meta = buildPageMeta({
  title: "Work",
  description:
    "Case studies from Clear Slope Digital builds — anonymized, specific, anchored to numbers we can defend.",
  path: "/work/",
});
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Work", path: "/work/" },
];
const schema = [
  buildCollectionPage({
    name: "Work",
    description: meta.description,
    slug: "/work/",
  }),
  buildBreadcrumbs(crumbs),
];
---
<Page meta={meta} schema={schema}>
  <PageHero
    eyebrow="Work"
    h1="What we've shipped."
    lede="Case studies, anonymized but specific. We name numbers we can back."
  />
  <section class="container-page py-12 md:py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
      {all.map((e) => (
        <a
          href={`/work/${e.slug}/`}
          class="group flex flex-col p-8 md:p-10 rounded-sm border border-rule-strong bg-bg-deep hover:border-accent/40 lift-on-hover hover:-translate-y-1"
        >
          <span class="mono-label !text-accent">Case study</span>
          <h3
            class="font-sans font-medium text-ink mt-3 mb-3"
            style="font-size: var(--text-h3); line-height: var(--text-h3--line-height); letter-spacing: var(--text-h3--letter-spacing);"
          >
            {e.data.clientLabel}
          </h3>
          <p class="mono-label mb-6">{e.data.location}</p>
          <p class="text-ink-soft leading-relaxed mb-6" style="font-size: var(--text-body);">
            {e.data.description}
          </p>
          <span class="link-mono inline-flex items-center gap-1.5 group-hover:text-accent mt-auto">
            <span>Read the case study</span>
            <span aria-hidden="true">→</span>
          </span>
        </a>
      ))}
    </div>
  </section>
</Page>
```

- [ ] **Step 3:** Build & commit

```bash
npx astro build
git add src/pages/work/
git commit -m "feat: add /work/ index and /work/[slug] route"
```

---

## Phase 11: About + Book pages + Home

### Task 11.1: About page

**Files:**
- Create: `src/pages/about.astro`

- [ ] **Step 1:** Create:

```astro
---
import Page from "../layouts/Page.astro";
import PageHero from "../components/PageHero.astro";
import { buildPageMeta } from "../lib/seo";
import { buildPerson, buildBreadcrumbs } from "../lib/schema";
import { AUTHOR } from "../data/author";
import { ORG_ADDRESS } from "../data/site";

const meta = buildPageMeta({
  title: "About Mo Habib",
  description:
    "Mo Habib is the founder of Clear Slope Digital. Mechanical engineer turned founder, building AI voice agents, workflows, and local SEO for service businesses across Canada and the US.",
  path: "/about/",
});
const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about/" },
];
const schema = [buildPerson(), buildBreadcrumbs(crumbs)];
---
<Page meta={meta} schema={schema}>
  <PageHero
    eyebrow="About"
    h1="About Mo Habib."
    lede={AUTHOR.shortBio}
  />
  <article class="container-page grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 md:py-16">
    <aside class="lg:col-span-3">
      <img
        src={AUTHOR.imagePath400}
        width="200"
        height="200"
        alt={AUTHOR.name}
        class="rounded-sm w-full max-w-[200px]"
        loading="eager"
        decoding="async"
      />
    </aside>
    <div class="lg:col-span-7 max-w-[var(--container-prose)] prose-content">
      <h2>Background</h2>
      <p>
        I'm a mechanical engineer who got tired of watching service businesses
        get sold cookie-cutter SEO and "AI" that was a chatbot in a trenchcoat.
        Engineering trains you to think in systems — inputs, transforms,
        outputs, failure modes. That's the same lens I bring to a small
        business: <em>where is revenue leaking, and what system would stop the leak?</em>
      </p>
      <p>
        I'm not going to pretend my degree taught me how to build voice agents
        or rank a pest control company. It didn't. It taught me how to take
        something apart, see how the parts fit, and put it back together so it
        works. The rest I learned by shipping.
      </p>

      <h2>What I work on</h2>
      <ul>
        <li><strong>AI voice agents</strong> that capture missed calls and qualify leads.</li>
        <li><strong>Agentic workflows</strong> that run review requests, follow-ups, scheduling, and reporting.</li>
        <li><strong>Local SEO</strong> built on technical fundamentals, not citation farms.</li>
      </ul>

      <h2>How I work</h2>
      <p>
        Founder-direct. Fixed fee. Small client roster. I anonymize clients in
        writing — your story might end up as "a Metro Vancouver pest control
        operator," but the numbers I cite about you are numbers I can defend.
      </p>

      <h2>Where to find me</h2>
      <p>
        Based in {ORG_ADDRESS.addressLocality}, {ORG_ADDRESS.addressRegion}.
        Working with service businesses across Canada and the US.
      </p>
      <ul>
        <li><a href={AUTHOR.sameAs[0]} target="_blank" rel="noopener">LinkedIn</a></li>
        <li><a href="/book/">Book a discovery call</a></li>
      </ul>
    </div>
  </article>
</Page>
```

- [ ] **Step 2:** Build & commit

```bash
npx astro build
git add src/pages/about.astro
git commit -m "feat: add /about page"
```

### Task 11.2: Book page

**Files:**
- Create: `src/pages/book.astro`

- [ ] **Step 1:** Create:

```astro
---
import Page from "../layouts/Page.astro";
import PageHero from "../components/PageHero.astro";
import CalEmbed from "../components/cta/CalEmbed.astro";
import { buildPageMeta } from "../lib/seo";
import { buildBreadcrumbs } from "../lib/schema";

const meta = buildPageMeta({
  title: "Book a discovery call",
  description:
    "Book a 30-minute discovery call with Mo Habib at Clear Slope Digital. We'll talk about what's worth automating or ranking in your service business.",
  path: "/book/",
});
const crumbs = [
  { name: "Home", path: "/" },
  { name: "Book", path: "/book/" },
];
const schema = [buildBreadcrumbs(crumbs)];
---
<Page meta={meta} schema={schema}>
  <PageHero
    eyebrow="Book"
    h1="Book a 30-minute discovery call."
    lede="Tell me about your business and what's worth automating or ranking. I'll reply within 24 hours if the call doesn't fit your schedule."
  />
  <section class="container-page py-12 md:py-16">
    <CalEmbed />
  </section>
</Page>
```

- [ ] **Step 2:** Build & commit

```bash
npx astro build
git add src/pages/book.astro
git commit -m "feat: add /book page with Cal embed"
```

### Task 11.3: Home page rewrite

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/components/Hero.astro` (refactor to take optional CTA props, point CTAs at `/book/`)

- [ ] **Step 1:** Update `src/components/Hero.astro` so the CTAs point to `/book/` and `/services/`:

In `src/components/Hero.astro`, change `const calLink = "#book";` to `const calLink = "/book/";` and change the `<a href="#services">` to `<a href="/services/">`. Update its trailing label text from `or see what we ship` to `or see what we ship →`. Leave the rest of the file untouched.

- [ ] **Step 2:** Replace `src/pages/index.astro` with:

```astro
---
import Page from "../layouts/Page.astro";
import Hero from "../components/Hero.astro";
import ServiceCard from "../components/ServiceCard.astro";
import PostCard from "../components/PostCard.astro";
import { getCollection } from "astro:content";
import { buildPageMeta } from "../lib/seo";
import {
  buildOrganization,
  buildWebSite,
  buildBreadcrumbs,
} from "../lib/schema";
import { readingTimeMinutes } from "../lib/reading-time";
import { SITE_TAGLINE } from "../data/site";

const services = (await getCollection("services")).sort(
  (a, b) => a.data.order - b.data.order,
);
const allNotes = (await getCollection("notes")).filter((e) => !e.data.draft);
allNotes.sort(
  (a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime(),
);
const featured = allNotes.slice(0, 3);
const work = await getCollection("work");

const meta = buildPageMeta({
  title: "Clear Slope Digital",
  description: SITE_TAGLINE,
  path: "/",
});
const crumbs = [{ name: "Home", path: "/" }];
const schema = [
  buildOrganization(),
  buildWebSite(),
  buildBreadcrumbs(crumbs),
];
const numbers = ["01", "02", "03"];
---
<Page meta={meta} schema={schema}>
  <Hero />

  <section id="services" class="py-24 md:py-32 border-t border-rule">
    <div class="container-page">
      <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
        <div class="flex items-center gap-3">
          <span class="mono-label">Services</span>
          <span class="h-px w-12 bg-rule"></span>
        </div>
        <h2
          class="font-sans font-medium text-ink max-w-[20ch]"
          style="font-size: var(--text-h2); line-height: var(--text-h2--line-height); letter-spacing: var(--text-h2--letter-spacing);"
        >
          Three services. One operator who actually ships.
        </h2>
      </header>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {services.map((s, i) => (
          <ServiceCard
            href={`/services/${s.data.slug}/`}
            num={numbers[i]}
            title={s.data.h1}
            body={s.data.description}
            outcomes={s.data.faq.slice(0, 3).map((f) => f.q)}
          />
        ))}
      </div>
    </div>
  </section>

  {work.length > 0 && (
    <section class="py-24 md:py-32 border-t border-rule">
      <div class="container-page">
        <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div class="flex items-center gap-3">
            <span class="mono-label">Work</span>
            <span class="h-px w-12 bg-rule"></span>
          </div>
          <h2
            class="font-sans font-medium text-ink max-w-[20ch]"
            style="font-size: var(--text-h2); line-height: var(--text-h2--line-height);"
          >
            What we've shipped.
          </h2>
        </header>
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
          {work.map((c) => (
            <a
              href={`/work/${c.slug}/`}
              class="group flex flex-col p-8 md:p-10 rounded-sm border border-rule-strong bg-bg-deep hover:border-accent/40 lift-on-hover hover:-translate-y-1"
            >
              <span class="mono-label !text-accent">Case study</span>
              <h3
                class="font-sans font-medium text-ink mt-3 mb-3"
                style="font-size: var(--text-h3);"
              >
                {c.data.clientLabel}
              </h3>
              <p class="mono-label mb-6">{c.data.location}</p>
              <p class="text-ink-soft leading-relaxed mb-6" style="font-size: var(--text-body);">
                {c.data.description}
              </p>
              <span class="link-mono inline-flex items-center gap-1.5 group-hover:text-accent mt-auto">
                <span>Read the case study</span>
                <span aria-hidden="true">→</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )}

  {featured.length > 0 && (
    <section class="py-24 md:py-32 border-t border-rule">
      <div class="container-page">
        <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div class="flex items-center gap-3">
            <span class="mono-label">Notes</span>
            <span class="h-px w-12 bg-rule"></span>
          </div>
          <h2
            class="font-sans font-medium text-ink max-w-[24ch]"
            style="font-size: var(--text-h2); line-height: var(--text-h2--line-height);"
          >
            Field notes from the workshop.
          </h2>
        </header>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {featured.map((e) => (
            <PostCard
              href={`/notes/${e.slug}/`}
              title={e.data.title}
              description={e.data.description}
              publishDate={e.data.publishDate}
              readingMinutes={readingTimeMinutes(e.body)}
              cluster={e.data.cluster}
            />
          ))}
        </div>
        <div class="mt-12">
          <a href="/notes/" class="link-mono inline-flex items-center gap-1.5 hover:text-accent">
            <span>All notes</span>
            <span class="text-accent">→</span>
          </a>
        </div>
      </div>
    </section>
  )}
</Page>
```

- [ ] **Step 3:** Build & verify

```bash
npx astro build
```

Expected: home page renders, includes services/work/notes sections.

- [ ] **Step 4:** Commit

```bash
git add src/pages/index.astro src/components/Hero.astro
git commit -m "feat: rewrite home page with services, work, and notes sections"
```

---

## Phase 12: Verification + cleanup

### Task 12.1: Delete obsolete components

**Files:**
- Delete: `src/components/Process.astro`
- Delete: `src/components/FinalCTA.astro`
- Delete: `src/components/Work.astro`
- Delete: `src/components/Services.astro`

**Note:** `Hero.astro`, `HeroVisual.astro`, and `Nav.astro` stay — they're used by the new home page.

- [ ] **Step 1:** Verify nothing imports them

```bash
grep -r "Process\.astro\|FinalCTA\.astro\|components/Work\.astro\|components/Services\.astro" src/ --include="*.astro" --include="*.ts" || echo "no imports"
```

Expected: `no imports`. (The new home/services/work pages use the layout-driven approach, not the old single-page components.)

- [ ] **Step 2:** Delete

```bash
git rm src/components/Process.astro src/components/FinalCTA.astro src/components/Work.astro src/components/Services.astro
```

- [ ] **Step 3:** Build to confirm nothing broke

```bash
npx astro build
```

- [ ] **Step 4:** Commit

```bash
git commit -m "chore: remove obsolete single-page components"
```

### Task 12.2: Decide fate of `/demo` route

**Files:** depends on user choice

- [ ] **Step 1:** Ask the user (out-of-band): keep `src/pages/demo.astro` and `src/components/DemoChat.astro` as a behind-the-scenes demo, or delete?
- [ ] **Step 2:** If keep — add `noindex` meta to the demo page so it doesn't pollute search:

In `src/pages/demo.astro`'s frontmatter, add to the head (you may need to wrap in a Page-style layout, or just inject a `<meta name="robots" content="noindex">` directly into its existing `<head>` block).

- [ ] **Step 3:** If delete:

```bash
git rm src/pages/demo.astro src/components/DemoChat.astro
npx astro build
git commit -m "chore: remove unused /demo page"
```

### Task 12.3: 301 redirects for legacy anchors

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1:** Open `astro.config.mjs` and add a `redirects` block:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://clearslopedigital.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  redirects: {
    '/services': '/services/',
    '/work': '/work/',
    '/notes': '/notes/',
    '/about': '/about/',
    '/book': '/book/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
```

The `trailingSlash: 'always'` makes Astro emit canonical URLs and redirects with trailing slashes — matches the patterns used throughout `seo.ts` and the schema builders.

- [ ] **Step 2:** Build & verify the sitemap

```bash
npx astro build
ls dist/sitemap-*.xml
cat dist/sitemap-0.xml | head -40
```

Expected: sitemap file exists, includes the new URLs with trailing slashes.

- [ ] **Step 3:** Commit

```bash
git add astro.config.mjs
git commit -m "chore: enforce trailing-slash policy and add legacy redirects"
```

### Task 12.4: Final test + build sweep

**Files:** none (verification only)

- [ ] **Step 1:** Run the test suite

```bash
npm run test:run
```

Expected: all tests pass.

- [ ] **Step 2:** Run a clean build

```bash
rm -rf dist .astro
npx astro build
```

Expected: build succeeds with no warnings about missing routes, broken imports, or schema validation failures.

- [ ] **Step 3:** Verify all expected routes are in the sitemap

```bash
grep -E "<loc>" dist/sitemap-0.xml | sort
```

Expected output (in some order):
```
<loc>https://clearslopedigital.com/</loc>
<loc>https://clearslopedigital.com/about/</loc>
<loc>https://clearslopedigital.com/book/</loc>
<loc>https://clearslopedigital.com/notes/</loc>
<loc>https://clearslopedigital.com/notes/how-pest-control-operators-lose-revenue-to-missed-calls/</loc>
<loc>https://clearslopedigital.com/notes/pest-control-seo-the-phonebook-effect-is-not-enough/</loc>
<loc>https://clearslopedigital.com/notes/the-three-questions-i-ask-before-taking-on-a-service-business/</loc>
<loc>https://clearslopedigital.com/notes/what-an-ai-voice-agent-cannot-do-and-shouldnt-pretend-to/</loc>
<loc>https://clearslopedigital.com/notes/when-an-ai-voice-agent-actually-pays-for-itself/</loc>
<loc>https://clearslopedigital.com/notes/why-i-charge-fixed-fees-not-pay-per-lead/</loc>
<loc>https://clearslopedigital.com/services/</loc>
<loc>https://clearslopedigital.com/services/agentic-workflows/</loc>
<loc>https://clearslopedigital.com/services/ai-voice-agent/</loc>
<loc>https://clearslopedigital.com/services/local-seo/</loc>
<loc>https://clearslopedigital.com/work/</loc>
<loc>https://clearslopedigital.com/work/pest-control-vancouver/</loc>
```

- [ ] **Step 4:** Spot-check schema on the home page

```bash
grep -A 2 "application/ld+json" dist/index.html | head -20
```

Expected: at least three `<script type="application/ld+json">` blocks (Organization, WebSite, BreadcrumbList).

- [ ] **Step 5:** Spot-check the case study page schema

```bash
grep -c "application/ld+json" dist/work/pest-control-vancouver/index.html
```

Expected: `2` (Article + BreadcrumbList).

- [ ] **Step 6:** Visually QA in dev server

```bash
npm run dev
```

Open `http://localhost:4321/` in a browser. Spot-check: home → services index → service detail → work index → case study → notes index → note detail → about → book. Each page should have correct H1, working CTAs (book link goes to `/book/`, footer newsletter form renders), and no console errors.

Stop the server with Ctrl+C when done.

- [ ] **Step 7:** Commit any tweaks made during the QA pass

```bash
git status
```

If anything was modified during QA, stage and commit with a descriptive message. Otherwise this step is a no-op.

---

## Phase 13: Content fill (separate manual pass)

**Note:** Tasks in this phase are content-writing tasks, not implementation tasks. They are listed for completeness but should be done by Mo (with AI assistance per spec section 3D) after the system is shipped. Each task is a `[CONTENT TODO]` marker in a markdown file from earlier phases.

### Task 13.1: Fill service page content

- [ ] **Step 1:** Open each `src/content/services/*.md` and replace each `[CONTENT TODO]` with prose to the word target indicated. Run `npm run dev` and read the rendered page, not the markdown source — voice is easier to hear in the rendered context.
- [ ] **Step 2:** Per service page, ensure: 2+ internal links to relevant `/notes/` posts and the case study; FAQ stays in sync with the markdown frontmatter (don't duplicate in body).
- [ ] **Step 3:** Build, then visually verify on dev server. Commit per page (one commit per filled service page).

### Task 13.2: Fill case study content

- [ ] **Step 1:** Review `/home/user/Projects/Clients/All Greens Pest Control/Analysis/summary.txt` and the SearchKings reference materials. Note which numbers are defensible and which are not.
- [ ] **Step 2:** Fill the case study `[CONTENT TODO]` blocks. Hard rule: every numeric claim must be traceable to the source file.
- [ ] **Step 3:** Build, verify, commit.

### Task 13.3: Fill blog post content (6 posts)

- [ ] **Step 1:** Per the cadence locked in spec section 3D, fill posts on the schedule. The scaffolding is already done — each post has section headers and a word target per section.
- [ ] **Step 2:** Each post must hit the quality bar from spec 3D: original data or POV, 2+ internal links, schema valid (will be valid as long as frontmatter is intact), no AI tells in voice.
- [ ] **Step 3:** Build & commit per post.

### Task 13.4: Fill About page narrative

- [ ] **Step 1:** Open `src/pages/about.astro`. The hardcoded narrative copy is already in place from Task 11.1 — review it as a draft, not a final.
- [ ] **Step 2:** Edit to your voice. Ensure the mechanical-engineering framing matches how you want to position it.
- [ ] **Step 3:** Build & commit.

---

## Self-review checklist (recorded; verify before declaring done)

### Spec coverage

| Spec section | Implementation tasks |
|--------------|----------------------|
| Section 1 — URL architecture | Tasks 8.5, 8.6, 9.3, 9.4, 10.3, 11.1, 11.2, 11.3 (all routes) |
| Section 2 — Per-page meta | Tasks 3.9, 3.10, 5.1, 5.3, used by every page layout |
| Section 2 — Schema (every page type) | Tasks 3.3–3.8, used by every layout |
| Section 2 — Sitemap, robots, RSS | Existing config + Task 9.5 |
| Section 2 — Trailing slash | Task 12.3 |
| Section 3A — Service pages | Tasks 8.1–8.6 |
| Section 3B — Case study | Tasks 10.1–10.3 |
| Section 3C — First 6 posts | Task 9.1 (scaffolds), 13.3 (content) |
| Section 3D — Cadence + frontmatter shape | Task 4.1, 9.1 |
| Section 4A — Person schema | Task 3.5 |
| Section 4B — About page | Task 11.1 |
| Section 4C — AuthorByline | Task 7.4 |
| Section 4D — AuthorBox | Task 7.5 |
| Section 4E — Headshot variants | Pre-existing (done during brainstorm) |
| Section 5A — Discovery call (Cal embed) | Tasks 0.1, 7.6, 11.2 |
| Section 5B — Newsletter (Web3Forms) | Task 7.2 |
| Section 5C — CTA placement (restrained) | Each layout deliberately follows the rules; footer-only newsletter site-wide |
| Open task — Cal account | Task 0.1 |
| Open task — GBP canonical | Task 0.2 |
| Open task — apex/www | Task 0.3 (decision), Task 12.3 (config) |
| Open task — git init | Already complete (commit 4e6e26d) |

No spec section is unaddressed.

### Type-consistency check (signatures used in later tasks)

- `buildPageMeta(...)` — defined Task 3.10, consumed Tasks 8.4, 9.2, 10.2, 11.1, 11.2, 11.3 ✓
- `buildOrganization()`, `buildWebSite()`, `buildPerson()`, `buildArticle(...)`, `buildService(...)`, `buildFaqPage(...)`, `buildBreadcrumbs(...)`, `buildCollectionPage(...)` — defined Tasks 3.4–3.8, consumed in layouts ✓
- `readingTimeMinutes(string)` — defined Task 3.2, consumed Tasks 9.2, 9.4, 10.2, 11.3 ✓
- `AUTHOR.imagePath64`, `AUTHOR.imagePath160`, `AUTHOR.imagePath400`, `AUTHOR.shortBio`, `AUTHOR.sameAs` — defined Task 2.2, consumed in author components and About page ✓
- Content collection schema (`services`, `notes`, `work`) — defined Task 4.1, consumed everywhere ✓

### Placeholder scan

`[CONTENT TODO]` markers exist in markdown files by design — they mark the content-fill pass (Phase 13). No code-level placeholders or TBDs.

---

**Plan complete and saved to `docs/superpowers/plans/2026-05-03-clearslope-seo-redesign.md`.**
