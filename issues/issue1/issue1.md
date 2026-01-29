# Issue 1: Webpack / Next.js cache and chunk load errors

Related runtime and build issues involving `.next` cache or chunk loading. Same resolution applies.

---

## 1. Webpack cache restore failure

### Observed

When running `npm run dev` (Next.js dev server):

```
✓ Starting...
<w> [webpack.cache.PackFileCacheStrategy] Restoring pack failed from /Users/ilakkuvaselvimanoharan/apparel-online-store/.next/cache/webpack/client-development.pack.gz: Error: incorrect header check
```

### Context

- **Location**: `.next/cache/webpack/client-development.pack.gz`
- **Effect**: Webpack cache restore fails; the dev server may still start but cache is invalid or recreated.
- **Cause**: Corrupt or incompatible cache file (e.g. after Node/Next upgrade, interrupted build, or disk issue).

---

## 2. ChunkLoadError (app/layout timeout)

### Observed

In the browser, an unhandled runtime error appears:

- **Error**: `ChunkLoadError: Loading chunk app/layout failed. (timeout: http://localhost:3001/_next/static/chunks/app/layout.js)`
- **Call stack** includes: `.next/static/chunks/webpack.js` (e.g. line 155:40)
- The overlay may also show: **Next.js (14.2.35) is outdated** (learn more)

### Context

- **Location**: `.next/static/chunks/app/layout.js` (request times out)
- **Effect**: App fails to load; layout chunk never loads.
- **Cause**: Stale or corrupt `.next` build/chunks, or dev server under load; often related to the same cache issues as (1).

---

## Resolution (both)

Clear the Next.js cache and restart:

```bash
rm -rf .next
npm run dev
```

Then reload the app in the browser. Optionally add `.next` to `.gitignore` if not already.

If ChunkLoadError persists, try a hard refresh (Ctrl+Shift+R / Cmd+Shift+R) or restart the dev server again.

---

## Status

Documented. Clear `.next` when either the cache warning or ChunkLoadError appears.
