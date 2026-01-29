# Issue 5: Missing stores index page — /stores 404 or redirect loop

**Scope:** ~2.5 hours (LLM or developer).

There is **no** `app/stores/page.tsx`. Only `app/stores/locate/page.tsx` and `app/stores/[id]/page.tsx` exist. Links or redirects to `/stores` can 404 or cause a redirect loop when store detail redirects to `/stores` when a store is not found.

---

## Observed

- Navigating to `/stores` returns 404 (or broken behavior).
- Store detail page may redirect to `/stores` on “store not found”, leading to a bad UX loop.

---

## Context

- **Location**: `app/stores/` — missing `page.tsx`.
- **Effect**: Broken navigation; poor UX for store locator entry point.
- **Cause**: No index route for the stores segment.

---

## Expected

- `GET /stores` (or `/stores/`) resolves to a valid page: either a stores list or a redirect to `/stores/locate`.

---

## Resolution

1. Add `app/stores/page.tsx`.
2. Either:
   - **Option A:** Render a simple stores index (e.g. list of stores or “Find a store” CTA linking to `/stores/locate`), or
   - **Option B:** Redirect to `/stores/locate` (e.g. `redirect("/stores/locate")`).
3. Ensure any “store not found” redirect targets this page or `/stores/locate` consistently.

---

## Test

- **Gap test:** `__tests__/gaps/stores-index-page.test.ts` — asserts that `app/stores/page.tsx` exists. Fails until the file is added.

---

## Status

Open.
