# Issue 8: Footer-linked pages 404 — contact, shipping, returns, faq, about, careers, sustainability, press

**Scope:** ~2.5 hours (LLM or developer).

The footer (`components/layout/Footer.tsx`) links to: `/contact`, `/shipping`, `/returns`, `/faq`, `/about`, `/careers`, `/sustainability`, `/press`. **None** of these routes have pages; all return 404.

---

## Observed

- Clicking any of the above footer links leads to 404.
- Bad UX and broken navigation for help and company info.

---

## Context

- **Location**: Footer links; missing `app/<segment>/page.tsx` (or under `app/(static)/<segment>/page.tsx`) for each segment.
- **Effect**: All footer help/about links are broken.
- **Cause**: Routes were never implemented.

---

## Expected

- Each of the 8 paths resolves to a valid page (200): contact, shipping, returns, faq, about, careers, sustainability, press.
- Pages can be minimal (static content or placeholder) or redirects to a single “info” page; no 404.

---

## Resolution

1. Add a page for each segment. Options:
   - **Option A:** Add `app/contact/page.tsx`, `app/shipping/page.tsx`, … (or under `app/(static)/...`) with minimal static content (title + short copy or “Coming soon”).
   - **Option B:** Add a single catch-all or shared layout and use segment for content (e.g. CMS or markdown per segment).
2. Ensure all 8 routes return 200 (either real content or a stub).
3. Optionally add redirects (e.g. `/shipping` → `/help#shipping`) if you prefer a single help page.

---

## Test

- **Gap test:** `__tests__/gaps/footer-pages.test.ts` — asserts that for each of the 8 segments, either `app/<segment>/page.tsx` or `app/(static)/<segment>/page.tsx` exists. Fails until all are added.

---

## Status

Open.
