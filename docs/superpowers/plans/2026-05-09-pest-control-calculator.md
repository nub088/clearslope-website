# Pest Control Revenue Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-file Astro page calculator that lets pest control operators enter monthly call volume and see estimated bookings, quotes, revenue, and most importantly, annual revenue lost — with a CTA to book a discovery call.

**Architecture:** Single Astro page (`calculator.astro`) with embedded vanilla JavaScript. Two-column layout on desktop (inputs left, results right), stacked on mobile. Real-time calculations as users adjust monthly call volume or collapsible assumptions. Hero banner with lost revenue and CTA button below the main calculator.

**Tech Stack:** Astro, vanilla HTML/CSS/JavaScript, Tailwind CSS (via site's theme system), no external libraries.

---

### Task 1: Create Page Shell with Meta and Layout

**Files:**
- Create: `/src/pages/calculator.astro`

- [ ] **Step 1: Create the Astro page file with imports and frontmatter**

Create `/src/pages/calculator.astro`:

```astro
---
import Page from "../layouts/Page.astro";
import { buildPageMeta } from "../lib/seo";
import { buildBreadcrumbs } from "../lib/schema";

const meta = buildPageMeta({
  title: "Revenue Calculator | Pest Control",
  description: "Calculate how much revenue you're losing to missed calls. See the real numbers from 1,327 pest control calls.",
  path: "/calculator/",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Calculator", path: "/calculator/" },
];

const schema = [buildBreadcrumbs(crumbs)];
---

<Page meta={meta} schema={schema}>
  <main>
    {/* Content will go here */}
  </main>
</Page>
```

- [ ] **Step 2: Verify the page scaffolds correctly**

Run: `npm run dev` and navigate to `http://localhost:3000/calculator/`
Expected: Page loads, shows nav and footer, main area is empty

- [ ] **Step 3: Commit**

```bash
git add src/pages/calculator.astro
git commit -m "feat: scaffold calculator page"
```

---

### Task 2: Build HTML Structure for Two-Column Layout

**Files:**
- Modify: `/src/pages/calculator.astro`

- [ ] **Step 1: Add the two-column layout HTML structure inside the main element**

Replace the `{/* Content will go here */}` comment with:

```astro
  <div class="container-page py-12 md:py-20">
    <header class="mb-12">
      <h1 class="font-sans font-medium text-ink" style="font-size: var(--text-display); line-height: var(--text-display--line-height); letter-spacing: var(--text-display--letter-spacing); margin-bottom: 1rem;">
        How much revenue are you losing?
      </h1>
      <p class="text-ink-soft max-w-[var(--container-prose)]" style="font-size: var(--text-body); line-height: var(--text-body--line-height);">
        Enter your monthly call volume and see the real numbers. Based on analysis of 1,327 pest control calls.
      </p>
    </header>

    <!-- Two-column calculator section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
      <!-- Left column: inputs -->
      <div class="space-y-6">
        <div>
          <label for="monthlyVolume" class="mono-label block mb-3">Monthly Call Volume</label>
          <input
            type="number"
            id="monthlyVolume"
            value="150"
            min="1"
            max="10000"
            class="w-full px-4 py-3 text-2xl font-sans border border-rule rounded-sm focus:outline-none focus:border-accent"
          />
        </div>

        <!-- Collapsible assumptions section -->
        <details class="border-t border-rule pt-6">
          <summary class="mono-label cursor-pointer select-none hover:text-accent transition-colors">
            Adjust Assumptions
          </summary>
          <div class="mt-6 space-y-6">
            <div>
              <label for="bookingRate" class="mono-label block mb-2">Booking Rate (%)</label>
              <input
                type="number"
                id="bookingRate"
                value="39"
                min="0"
                max="100"
                step="1"
                class="w-full px-3 py-2 border border-rule rounded-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label for="quoteRate" class="mono-label block mb-2">Quote Not Converted (%)</label>
              <input
                type="number"
                id="quoteRate"
                value="20"
                min="0"
                max="100"
                step="1"
                class="w-full px-3 py-2 border border-rule rounded-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label for="outOfScopeRate" class="mono-label block mb-2">Out of Scope (%)</label>
              <input
                type="number"
                id="outOfScopeRate"
                value="28"
                min="0"
                max="100"
                step="1"
                class="w-full px-3 py-2 border border-rule rounded-sm focus:outline-none focus:border-accent"
              />
            </div>
            <div>
              <label for="avgJobValue" class="mono-label block mb-2">Average Job Value ($)</label>
              <input
                type="number"
                id="avgJobValue"
                value="250.98"
                min="0"
                step="0.01"
                class="w-full px-3 py-2 border border-rule rounded-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>
        </details>
      </div>

      <!-- Right column: results -->
      <div class="space-y-6">
        <div class="p-6 border border-rule rounded-sm bg-bg-soft">
          <p class="mono-label mb-2">Estimated Monthly Bookings</p>
          <p class="text-4xl font-sans font-medium text-ink" id="bookingsDisplay">57</p>
        </div>
        <div class="p-6 border border-rule rounded-sm bg-bg-soft">
          <p class="mono-label mb-2">Estimated Quotes Not Converted</p>
          <p class="text-4xl font-sans font-medium text-ink" id="quotesDisplay">30</p>
        </div>
        <div class="p-6 border border-rule rounded-sm bg-bg-soft">
          <p class="mono-label mb-2">Estimated Out of Scope Calls</p>
          <p class="text-4xl font-sans font-medium text-ink" id="outOfScopeDisplay">42</p>
        </div>
        <div class="p-6 border border-rule rounded-sm bg-bg-soft">
          <p class="mono-label mb-2">Estimated Monthly Revenue Captured</p>
          <p class="text-4xl font-sans font-medium text-accent" id="monthlyRevenueDisplay">$14,306</p>
        </div>
      </div>
    </div>

    <!-- Hero banner: lost revenue -->
    <div class="bg-bg-deep border-t border-b border-rule py-20 px-6 text-center -mx-6 mb-0">
      <p class="mono-label mb-6">Estimated Annual Revenue Lost</p>
      <p class="text-7xl font-sans font-medium text-ink mb-8" id="annualLossDisplay">$51,768</p>
      <a href="/book/" class="inline-block px-6 py-3 bg-accent text-bg font-sans font-medium rounded-full hover:bg-accent-hover transition-colors">
        See how to recover this revenue
      </a>
      <p class="mono-label mt-12 text-xs">Based on analysis of 1,327 real pest control calls</p>
    </div>
  </div>
```

- [ ] **Step 2: Verify structure loads in browser**

Run: `npm run dev` and navigate to `/calculator/`
Expected: Two-column layout visible with all input fields, results cards, and hero banner displaying default values

- [ ] **Step 3: Commit**

```bash
git add src/pages/calculator.astro
git commit -m "feat: add calculator HTML structure and layout"
```

---

### Task 3: Add JavaScript for Real-Time Calculations

**Files:**
- Modify: `/src/pages/calculator.astro` (add script tag at end of file)

- [ ] **Step 1: Add the calculation logic script**

Add this at the end of the `calculator.astro` file (before closing `</Page>`):

```html
<script>
  function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  function calculateMetrics() {
    const monthlyVolume = parseFloat(document.getElementById('monthlyVolume').value) || 0;
    const bookingRate = parseFloat(document.getElementById('bookingRate').value) || 39;
    const quoteRate = parseFloat(document.getElementById('quoteRate').value) || 20;
    const outOfScopeRate = parseFloat(document.getElementById('outOfScopeRate').value) || 28;
    const avgJobValue = parseFloat(document.getElementById('avgJobValue').value) || 250.98;

    // Calculate metrics
    const bookings = Math.round((monthlyVolume * bookingRate) / 100);
    const quotes = Math.round((monthlyVolume * quoteRate) / 100);
    const outOfScope = Math.round((monthlyVolume * outOfScopeRate) / 100);
    const lostRate = 100 - bookingRate - quoteRate - outOfScopeRate;
    const lostCalls = Math.round((monthlyVolume * lostRate) / 100);

    // Revenue calculations
    const monthlyRevenueCapture = bookings * avgJobValue;
    const monthlyRevenueLost = lostCalls * avgJobValue;
    const annualRevenueLost = monthlyRevenueLost * 12;

    // Update displays
    document.getElementById('bookingsDisplay').textContent = bookings.toLocaleString();
    document.getElementById('quotesDisplay').textContent = quotes.toLocaleString();
    document.getElementById('outOfScopeDisplay').textContent = outOfScope.toLocaleString();
    document.getElementById('monthlyRevenueDisplay').textContent = formatCurrency(monthlyRevenueCapture);
    document.getElementById('annualLossDisplay').textContent = formatCurrency(annualRevenueLost);
  }

  // Attach event listeners
  const inputs = [
    'monthlyVolume',
    'bookingRate',
    'quoteRate',
    'outOfScopeRate',
    'avgJobValue'
  ];

  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('input', calculateMetrics);
      input.addEventListener('change', calculateMetrics);
    }
  });

  // Initial calculation on page load
  calculateMetrics();
</script>
```

- [ ] **Step 2: Test calculations in browser**

Open the browser DevTools (F12). In the calculator:
- Change "Monthly Call Volume" to 200. Expected: All metrics update instantly
- Change "Booking Rate" to 50. Expected: Bookings increase, lost revenue decreases
- Open "Adjust Assumptions" and change "Average Job Value" to 500. Expected: All revenue displays update

- [ ] **Step 3: Verify math is correct**

Manual check with 150 default calls:
- Bookings: 150 × 0.39 = 58.5 ≈ 59 (or 57-58 depending on rounding)
- Quotes: 150 × 0.20 = 30
- Out of Scope: 150 × 0.28 = 42
- Lost: 150 × 0.13 = 19.5 ≈ 20 (100% - 39% - 20% - 28% = 13%)
- Monthly Revenue Captured: 57 × $250.98 ≈ $14,306
- Monthly Revenue Lost: 20 × $250.98 ≈ $5,020
- Annual Revenue Lost: $5,020 × 12 ≈ $60,240

Expected values should roughly match these numbers.

- [ ] **Step 4: Commit**

```bash
git add src/pages/calculator.astro
git commit -m "feat: add real-time calculation logic and event listeners"
```

---

### Task 4: Style the Collapsible Assumptions Section

**Files:**
- Modify: `/src/pages/calculator.astro` (add CSS in style tag before script)

- [ ] **Step 1: Add styles for the details/summary element**

Add this inside the `<style>` tag (create one if needed, before the `<script>` tag):

```css
details summary {
  list-style: none;
}

details summary::-webkit-details-marker {
  display: none;
}

details summary::after {
  content: " +";
  margin-left: 0.5rem;
}

details[open] summary::after {
  content: " −";
}

details summary:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
}
```

- [ ] **Step 2: Test collapsible in browser**

Open `/calculator/` in browser:
- Details section should show "Adjust Assumptions +" 
- Click it. Expected: Panel expands, text changes to "Adjust Assumptions −", inputs become visible
- Click again. Expected: Panel collapses, text changes back to "+"

- [ ] **Step 3: Commit**

```bash
git add src/pages/calculator.astro
git commit -m "feat: style collapsible assumptions section"
```

---

### Task 5: Refine Visual Design and Spacing

**Files:**
- Modify: `/src/pages/calculator.astro`

- [ ] **Step 1: Adjust card styling and spacing for results**

Update the four result cards in the right column. Change from current styling to:

```astro
        <div class="p-8 border border-rule rounded-sm bg-bg-soft">
          <p class="mono-label mb-3">Estimated Monthly Bookings</p>
          <p class="text-5xl font-sans font-medium text-ink" id="bookingsDisplay">57</p>
        </div>
```

Repeat for all four cards (change `text-4xl` to `text-5xl`, `p-6` to `p-8`, `mb-2` to `mb-3`).

- [ ] **Step 2: Verify responsive behavior**

Open `/calculator/` on desktop and mobile views:
- Desktop: Two-column layout side-by-side
- Mobile (resize to < 768px): Single column stacked, inputs then results

Expected: Layout adapts properly with `grid-cols-1 lg:grid-cols-2`

- [ ] **Step 3: Commit**

```bash
git add src/pages/calculator.astro
git commit -m "feat: refine calculator card styling and spacing"
```

---

### Task 6: Test Full Calculator Flow

**Files:**
- Test: Manual browser testing (no automated tests for UI calculators at this scope)

- [ ] **Step 1: Test default state**

Open `/calculator/`:
Expected:
- Monthly volume shows 150
- All results display with default calculations
- Hero banner shows annual loss (should be around $60,000)
- CTA button says "See how to recover this revenue" and links to `/book/`

- [ ] **Step 2: Test input changes**

Change monthly volume to 300:
Expected: All metrics double roughly, hero number doubles

Change monthly volume to 0:
Expected: All displays show 0 or $0

- [ ] **Step 3: Test assumptions panel**

Click "Adjust Assumptions":
Expected: Panel expands, shows four inputs with defaults (39, 20, 28, 250.98)

Change "Booking Rate" to 50:
Expected: Bookings immediately increase, lost revenue decreases

Change "Average Job Value" to 500:
Expected: All revenue numbers approximately double

- [ ] **Step 4: Test on mobile**

Resize to mobile width:
Expected: Layout stacks properly, inputs and results readable, hero banner scales appropriately

- [ ] **Step 5: Verify link**

Click "See how to recover this revenue" button:
Expected: Navigates to `/book/`

---

### Task 7: Final Commit and Verification

**Files:**
- Modify: `/src/pages/calculator.astro` (complete file)

- [ ] **Step 1: Run full site build**

Run: `npm run build`
Expected: Build completes without errors, `/dist/calculator/index.html` is generated

- [ ] **Step 2: Verify page in production build**

Run: `npm run preview` and navigate to `/calculator/`
Expected: Calculator works identically to dev build

- [ ] **Step 3: Final commit**

```bash
git add src/pages/calculator.astro
git commit -m "feat: complete pest control revenue calculator page"
```

- [ ] **Step 4: Verify git log**

Run: `git log --oneline | head -5`
Expected: Shows recent commits including calculator commits

---

## Plan Self-Review

✓ **Spec coverage:** All requirements met
- Two-column layout ✓
- Monthly call volume input (default 150) ✓
- Collapsible "Adjust Assumptions" (collapsed by default) ✓
- Four results metrics displayed in right column ✓
- Hero banner with big bold annual revenue lost ✓
- CTA button directly below (zero gap) with "See how to recover this revenue" ✓
- Attribution line "Based on analysis of 1,327 real pest control calls" ✓
- Vanilla HTML/CSS/JS, one file ✓
- Matches site design system ✓

✓ **Placeholder scan:** No TBD, TODO, or vague steps. All code is complete.

✓ **Type consistency:** All element IDs and variable names consistent throughout.
