# Clear Slope Digital — clearslopedigital.com

Astro + Tailwind v4 marketing site. Single landing page positioning Clear Slope Digital as an operator-led shop building **agentic workflows** (primary) and **local SEO** (secondary) for SMBs across Canada and the US.

## Stack

- **Astro 6** (static output)
- **Tailwind CSS v4** via the official Vite plugin (no separate config — design tokens live in `src/styles/global.css` under `@theme`)
- **IBM Plex Sans Variable** + **IBM Plex Mono** (self-hosted via `@fontsource`)
- **`@astrojs/sitemap`** for `sitemap-index.xml`
- Imagery: **Nano Banana Pro** for the hero, **Flash** for OG card

## Getting started

This project requires **Node 22+** (pinned in `.nvmrc`). With nvm:

```sh
nvm use            # picks up Node 22 from .nvmrc
npm install
npm run dev        # http://localhost:4321
```

## Commands

| Command           | Action                                            |
|-------------------|---------------------------------------------------|
| `npm run dev`     | Local dev server at `localhost:4321`              |
| `npm run build`   | Production build to `./dist/`                     |
| `npm run preview` | Preview the production build locally              |

## Project layout

```
.
├── astro.config.mjs        # site URL + sitemap + tailwind plugin
├── public/
│   ├── img/                # generated hero + OG live here
│   ├── favicon.svg         # hand-coded ↗ glyph in burnt orange
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Nav.astro       # sticky header w/ wordmark + book-a-call
│   │   ├── Hero.astro      # headline + sub + CTA + visual
│   │   ├── HeroVisual.astro# inline SVG topo placeholder
│   │   ├── Services.astro  # two-card row (agentic / SEO)
│   │   ├── Process.astro   # Discovery → Build → Ship
│   │   ├── FinalCTA.astro  # closing book-a-call block
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Base.astro      # HTML shell, fonts, meta, JSON-LD
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css      # Tailwind v4 + design tokens
└── README.md
```

## Design system

Defined as `@theme` tokens in `src/styles/global.css`:

| Token              | Value                       | Used for                    |
|--------------------|-----------------------------|-----------------------------|
| `--color-bg`       | `#F9F4ED` (cream)           | Page background             |
| `--color-bg-deep`  | `#F1EAD9`                   | Section bands, primary card |
| `--color-ink`      | `#1F1F1F`                   | Headlines, body text        |
| `--color-ink-soft` | `#4A4A4A`                   | Secondary text              |
| `--color-orange`   | `#C25E25` (burnt orange)    | CTAs, accents, ↗ marks      |
| `--color-rule`     | `rgba(31,31,31,0.12)`       | 1px section dividers        |
| `--font-sans`      | IBM Plex Sans Variable      | Display + body              |
| `--font-mono`      | IBM Plex Mono               | Labels, captions, numerals  |

**Motifs**: `↗` glyph (used in nav, between process steps, before CTAs), mono numerals for ordered labels, generous whitespace, no gradients beyond the hero placeholder.

## Imagery

### Hero (`public/img/hero-slope.webp`)

Currently rendered as an inline SVG topographic placeholder in `src/components/HeroVisual.astro`. To replace with a generated hero:

1. Set `GEMINI_API_KEY` in a `.env` file at project root (or as an env var).
2. Generate via the `nano-banana:generate` skill with this prompt:

   > Abstract editorial illustration. Layered topographic contour lines in warm earth tones — cream `#F9F4ED`, burnt orange `#C25E25`, deep ink `#1F1F1F` — suggesting an ascending slope or mountain ridge viewed from a slightly elevated angle. Minimalist, textural, lots of negative space toward the upper-left, no text, no humans, no logos. Soft golden-hour light. Editorial magazine aesthetic.

3. Use **Nano Banana Pro**, **16:10** aspect, **2K** size. Generate 3–4 candidates.
4. Save the chosen output to `public/img/hero-slope.webp` (convert from PNG with `cwebp -q 85 in.png -o out.webp` or `sharp`).
5. Swap the SVG for an `<img>` in `src/components/Hero.astro`:
   ```astro
   <img src="/img/hero-slope.webp" alt="Abstract topographic slope" class="block w-full h-full object-cover" loading="eager" decoding="sync" />
   ```

### OG card (`public/img/og.webp`)

1200×630, generated with **Nano Banana Flash** — `CLEAR / SLOPE` wordmark over a small slope motif on cream. Referenced from `Base.astro` `og:image`.

### Favicon

`public/favicon.svg` is hand-coded — a burnt-orange `↗` glyph on cream. No regeneration needed.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings:
   - **Framework preset**: Astro
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: `22` (set as env var `NODE_VERSION=22`)
4. After the first deploy, add `clearslopedigital.com` and `www.clearslopedigital.com` as custom domains in **Pages → Custom domains**. Cloudflare will provision the TLS cert automatically.
5. Update DNS at your registrar to point at Cloudflare's nameservers (or add a `CNAME` if your domain is already on Cloudflare).

## Contact form

The form in the Final CTA section posts to **Web3Forms** (free, no signup until you want to collect submissions, no backend needed for a static site).

**To activate it:**

1. Go to [web3forms.com](https://web3forms.com), enter the email you want submissions delivered to, and Web3Forms instantly mails you an access key.
2. Open `src/components/ContactForm.astro` and replace the `ACCESS_KEY` constant at the top:
   ```ts
   const ACCESS_KEY = "your-real-access-key-here";
   ```
3. Rebuild + redeploy.

The form has a hidden honeypot field (`botcheck`) for basic spam filtering and falls back to a normal form POST if JS is disabled. With JS, it submits via `fetch()` and shows an inline thank-you state without a page reload.

Until you swap the key, submissions will fail silently — the form UI works but Web3Forms will reject the request. If you want to switch to Formspree, Cloudflare Pages Functions, or another endpoint, only the form `action` URL and the `<script>` block in `ContactForm.astro` need updating.

## Animations

Subtle motion only, all CSS-driven and respecting `prefers-reduced-motion`:

- **On load**: hero kicker → headline → subhead → CTAs cascade up; the orange underline under "systems" draws in; topo contour lines draw in sequentially.
- **On scroll**: section headings and card grids fade-and-rise as they enter the viewport (IntersectionObserver lives in `src/layouts/Base.astro`).
- **On hover**: service cards lift, ↗ glyphs shift slightly toward their direction, primary buttons get a 1px upward nudge.

Reduced-motion users get the layout instantly with no animation. To tune timings, see the keyframes block in `src/styles/global.css`.

## What's not included (yet)

- Generated hero + OG images (blocked on `GEMINI_API_KEY`)
- Booking integration — `book-a-call` links currently anchor to `#book` and the Final CTA section. Swap in a Cal.com / SavvyCal / Calendly URL when ready.
- Web3Forms access key (placeholder in `ContactForm.astro`)
- Analytics — drop in Plausible/Fathom snippet in `Base.astro` when deployed.
- Blog — Astro content collections are easy to add later under `src/content/`.

## License

Proprietary. © Clear Slope Digital.
