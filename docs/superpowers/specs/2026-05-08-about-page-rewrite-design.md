# About Page Rewrite — Design Spec

**Date:** 2026-05-08
**Scope:** Rewrite the Background section of `/about/`, update shortBio and meta description to reflect accurate positioning.

---

## What Changes and Why

The current Background section frames Mo's origin story as frustration with cookie-cutter SEO. This is inaccurate and undersells the actual positioning. The real story is:

- Engineering background → systems thinking
- Automated systems in financial markets → analytical rigor, comfort with automation at scale
- Agentic AI → natural evolution, genuine interest in the technology
- Service businesses → underserved market that doesn't yet understand what AI can actually do for them

Mo wants to be positioned as an **AI consultant** — someone who helps businesses understand and apply AI to save money, capture more leads, and reduce operating time. Not an SEO person who bolted on AI.

**Legal note:** "Professional Engineer" and "engineer" as a professional title are regulated in BC under the Engineers and Geoscientists Act. Copy must reference engineering as a field/background, not claim the title directly.

---

## Approved Copy

### `src/data/author.ts` — shortBio

```
Mo Habib builds AI voice agents, agentic workflows, and local SEO systems for service businesses across Canada and the US. Engineering background, systems thinker, working founder-direct.
```

### `src/pages/about.astro` — meta description

```
Mo Habib is the founder of Clear Slope Digital — helping service businesses understand and apply AI systems that save time, recover missed calls, and reduce operating costs.
```

### `src/pages/about.astro` — Background section (replaces current h2 + paragraphs)

```
My background is in engineering. After that I spent several years building automated
systems in financial markets. Both taught me the same thing: performance lives in the
details — in the edge cases, the failure modes, the feedback loops you only see when
you look closely enough.

When agentic AI arrived, the connection was immediate. Here was a class of technology
that could actually reduce the operating burden on a business — not just automate a
form or send a canned reply, but handle real decisions in real time.

Most businesses still don't know what that means in practice. They've heard about AI.
They haven't seen it save them four hours a day, recover missed calls, or run a
follow-up sequence without anyone touching a keyboard. That gap is where I work.
```

---

## Sections That Do Not Change

- **What I work on** — accurate as-is
- **How I work** — accurate as-is
- **Where to find me** — accurate as-is

---

## Files to Edit

| File | Change |
|------|--------|
| `src/data/author.ts` | Update `shortBio` string |
| `src/pages/about.astro` | Update meta description + rewrite Background `<h2>` block |
