# Cloudflare Pages Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build, validate, and publish the portfolio as a static Next.js site from GitHub Actions to Cloudflare Pages.

**Architecture:** Next.js exports the complete application to `out/`; browser search consumes a generated static JSON index, and Cloudflare files provide redirects and headers. A GitHub Actions pipeline validates the project, uploads `out/` once, and deploys that exact artifact with Wrangler.

**Tech Stack:** Next.js 16.4, React 19.2, TypeScript, pnpm 10.18.3, Playwright, Cloudflare Pages, Wrangler, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-10-11-cloudflare-pages-deployment-design.md`

## Global Constraints

- Preserve the existing visual application and all publication content.
- Keep `tmp/` untracked and untouched.
- Keep Cloudflare credentials only in GitHub secrets and variables.
- Deploy production only from `main` after validation succeeds.
- Use `output: 'export'` and publish only the generated `out/` directory.
- Preserve all legacy redirects listed in `docs/migration/legacy-route-map.json`.

---

### Task 1: Define and implement the static export contract

**Files:**
- Create: `tests/deployment/static-export.test.mjs`
- Create: `scripts/verify-static-export.mjs`
- Modify: `package.json`
- Modify: `next.config.mjs`
- Modify: `src/app/rss.xml/route.ts`

**Interfaces:**
- Consumes: Next.js build output at `out/`.
- Produces: `pnpm verify:export`, which exits nonzero when required deployment artifacts are absent.

- [ ] Write a Node test that asserts static export configuration, unoptimized images, a static RSS route, and the export verifier's required path list.
- [ ] Run `node --test tests/deployment/static-export.test.mjs` and confirm it fails against the server build.
- [ ] Add the Next.js export settings, force-static RSS marker, verifier script, and package scripts.
- [ ] Run the focused test, `pnpm build`, and `pnpm verify:export` and confirm all pass.
- [ ] Commit the static export contract.

### Task 2: Replace request-time search with a build-time index

**Files:**
- Create: `src/app/search-index.json/route.ts`
- Modify: `src/lib/search.ts`
- Modify: `src/components/shell/SiteSearch.tsx`
- Delete: `src/app/api/search/route.ts`
- Test: `tests/content/search.test.mjs`

**Interfaces:**
- Produces: `getSearchIndex(): Promise<SearchIndexEntry[]>` and `searchIndex(index, query): SearchResult[]`.
- Produces: static `GET /search-index.json` response containing `{ results: SearchIndexEntry[] }`.
- Consumes: the JSON response once per browser session and filters locally.

- [ ] Extend the search test to require deterministic ranking from an explicit index and a static search-index route.
- [ ] Run the focused search test and confirm the new contract fails.
- [ ] Split index generation from filtering, add the force-static JSON route, and update the command dialog cache.
- [ ] Delete the request-dependent API route.
- [ ] Run the search tests, type checks, build, and export verifier.
- [ ] Commit static search.

### Task 3: Move routing policy into Cloudflare artifacts

**Files:**
- Create: `public/_redirects`
- Create: `public/_headers`
- Modify: `tests/deployment/static-export.test.mjs`
- Modify: `next.config.mjs`
- Delete: `src/app/search/page.tsx`
- Delete: `src/app/resume/page.tsx`

**Interfaces:**
- Produces: Cloudflare Pages redirect rules for `/search`, `/resume`, two book roots, and every legacy route.
- Produces: baseline browser security headers for all paths.

- [ ] Add failing assertions that every migration-map entry appears in `_redirects` and required headers appear in `_headers`.
- [ ] Run the deployment test and confirm it fails.
- [ ] Add the Cloudflare files and remove server redirect code and routes.
- [ ] Run deployment tests, build, and export verification.
- [ ] Commit Cloudflare routing policy.

### Task 4: Run browser acceptance against the exported site

**Files:**
- Modify: `playwright.config.ts`
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`
- Modify: `tests/e2e/*` only when a test encodes server-only behavior.

**Interfaces:**
- Consumes: `out/` and serves it through `wrangler pages dev` on port 3100.
- Produces: browser acceptance of the same static asset model used by Pages.

- [ ] Add Wrangler as a pinned development dependency.
- [ ] Change Playwright's web server command to build, verify, and serve `out/` with Wrangler.
- [ ] Run the browser suite and record any real static-host incompatibility.
- [ ] Fix only reproduced incompatibilities, then rerun the focused test and full browser suite.
- [ ] Commit static-host browser acceptance.

### Task 5: Add GitHub validation and deployment workflows

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`
- Create: `.github/dependabot.yml`
- Create: `tests/deployment/workflows.test.mjs`
- Modify: `package.json`

**Interfaces:**
- CI produces an artifact named `cloudflare-pages-out` from `out/`.
- Deploy consumes that artifact and calls Wrangler with `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and `CLOUDFLARE_PROJECT_NAME`.

- [ ] Write a failing workflow contract test covering triggers, pinned package manager, least-privilege permissions, artifact flow, project creation, preview deployment, and production branch deployment.
- [ ] Run the workflow test and confirm it fails.
- [ ] Add CI, deployment, and Dependabot configuration.
- [ ] Run workflow tests and parse both workflow files with a YAML parser or Ruby's built-in YAML library.
- [ ] Commit the GitHub automation.

### Task 6: Document operations and verify the repository

**Files:**
- Create: `docs/operations/cloudflare-pages-deployment.md`
- Modify: `docs/operations/cloudflare-domain-setup.md`
- Modify: `PROGRESS.md`

**Interfaces:**
- Produces: operator instructions for initial project creation, deployment, custom domains, smoke checks, and rollback.

- [ ] Document exact GitHub names, workflow behavior, Pages commands, hosted acceptance URLs, and rollback steps.
- [ ] Update the DNS runbook to link the application deployment and mark completed user-owned DNS steps accurately.
- [ ] Add progress checkpoints for design, implementation, local verification, and hosted verification.
- [ ] Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm verify:export`, and `pnpm test:browser`.
- [ ] Review `git diff --check` and ensure `tmp/` remains untracked.
- [ ] Commit the operational handoff.

### Task 7: Publish and perform hosted acceptance

**Files:**
- Repository and Cloudflare state only; update operational evidence in `PROGRESS.md` afterward.

**Interfaces:**
- Produces: GitHub `main`, a successful Actions run, a verified `pages.dev` deployment, and then the custom domain.

- [ ] Add the GitHub remote and push the reviewed branch to the empty repository's `main` branch.
- [ ] Observe the CI and deployment runs; diagnose failures from logs and commit fixes when required.
- [ ] Verify the `pages.dev` homepage, article, book, RSS, search index, security headers, and legacy redirect.
- [ ] Attach `pankajmouriya.com` and `www.pankajmouriya.com` in Cloudflare Pages after the zone becomes active.
- [ ] Verify DNS, HTTPS, apex behavior, `www`, and legacy redirects on the public domain.
- [ ] Record hosted evidence and commit the final runbook state.
