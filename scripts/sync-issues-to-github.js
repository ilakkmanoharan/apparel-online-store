#!/usr/bin/env node
/**
 * Create GitHub Issues from local markdown files in issues/.
 *
 * - Scans issues/*/*.md (one folder per issue, e.g. issue1/issue1.md).
 * - Skips issues/README.md.
 * - Title: first line that starts with "# " (heading stripped).
 * - Body: full file content.
 * - If an open or closed issue with the same title already exists, skips creating a duplicate.
 *
 * Requires: GITHUB_TOKEN (repo scope), GITHUB_REPOSITORY (owner/repo).
 * Usage: node scripts/sync-issues-to-github.js
 */

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const ISSUES_DIR = path.join(PROJECT_ROOT, "issues");

const token = process.env.GITHUB_TOKEN;
const repo = process.env.GITHUB_REPOSITORY;

if (!token || !repo) {
  console.error("Missing GITHUB_TOKEN or GITHUB_REPOSITORY.");
  process.exit(1);
}

const [owner, repoName] = repo.split("/");
if (!owner || !repoName) {
  console.error("GITHUB_REPOSITORY must be owner/repo.");
  process.exit(1);
}

const API_BASE = `https://api.github.com/repos/${owner}/${repoName}`;

async function request(method, pathname, body) {
  const url = pathname.startsWith("http") ? pathname : `${API_BASE}${pathname}`;
  const opts = {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${method} ${url} ${res.status}: ${text}`);
  }
  return res.json();
}

function getIssueFiles() {
  if (!fs.existsSync(ISSUES_DIR)) return [];
  const entries = fs.readdirSync(ISSUES_DIR, { withFileTypes: true });
  const out = [];
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const dirPath = path.join(ISSUES_DIR, ent.name);
    const files = fs.readdirSync(dirPath);
    for (const f of files) {
      if (f.endsWith(".md") && f !== "README.md") {
        out.push(path.join(dirPath, f));
      }
    }
  }
  return out;
}

function parseIssueFile(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const lines = raw.split(/\r?\n/);
  let title = "";
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)$/);
    if (m) {
      title = m[1].trim();
      break;
    }
  }
  if (!title) title = path.basename(filePath, ".md");
  return { title, body: raw };
}

async function listExistingTitles() {
  const titles = new Set();
  let page = 1;
  const perPage = 100;
  while (true) {
    const list = await request(
      "GET",
      `/issues?state=all&per_page=${perPage}&page=${page}`
    );
    for (const i of list) {
      if (i.pull_request) continue;
      titles.add(i.title);
    }
    if (list.length < perPage) break;
    page++;
  }
  return titles;
}

async function createIssue(title, body) {
  return request("POST", "/issues", { title, body });
}

async function run() {
  const files = getIssueFiles();
  if (files.length === 0) {
    console.log("[sync-github] No issue files under issues/*/*.md");
    return;
  }

  const existing = await listExistingTitles();
  let created = 0;

  for (const filePath of files) {
    const { title, body } = parseIssueFile(filePath);
    if (existing.has(title)) {
      console.log("[sync-github] Skip (exists):", title);
      continue;
    }
    await createIssue(title, body);
    existing.add(title);
    created++;
    console.log("[sync-github] Created:", title);
  }

  console.log("[sync-github] Done. Created", created, "issue(s).");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
