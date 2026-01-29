# Issues

Tracked issues and resolutions live here (one issue per folder, e.g. `issue1/issue1.md`).

**One-way sync to private:** Changes in this folder are synced to `private/issues/` so private has a copy. Run:

- Once: `node scripts/sync-issues-to-private.js`
- Watch: `node scripts/sync-issues-to-private.js --watch`

Changes in `private/issues/` are **not** synced back here.

**GitHub Issues:** When you push commits that change files under `issues/`, the workflow **Sync issues to GitHub** runs and creates new GitHub Issues from any new markdown files (by title; existing titles are skipped). You can also run it manually from the Actions tab (**workflow_dispatch**).
