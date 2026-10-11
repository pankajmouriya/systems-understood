# Cloudflare Pages Deployment Design

**Date:** 2026-10-11  
**Repository:** `pankajmouriya/systems-understood`  
**Production domain:** `pankajmouriya.com`

## Objective

Publish the portfolio as a static Next.js 16 site on Cloudflare Pages. GitHub Actions must validate the same immutable `out/` artifact that is uploaded to Pages, while keeping Cloudflare credentials out of the public repository.

## Deployment architecture

Next.js builds the application with `output: 'export'`. Build-time MDX and local source data become static HTML, JavaScript, XML, and JSON in `out/`. A GitHub Actions validation job installs with the pinned pnpm version, runs lint, type checks, content tests, a production build, and an export contract check. The job uploads `out/` as an Actions artifact. A dependent deployment job downloads that exact artifact and publishes it with Wrangler.

Pull requests run validation and receive a Cloudflare preview deployment when repository credentials are available. Pushes to `main` deploy to the Pages production branch. The workflow may create the `systems-understood` Pages project when it does not exist, which makes an empty Cloudflare account usable from the first run.

## Static application changes

Static export cannot execute request-dependent route handlers or Next.js redirects. The application will therefore make these changes:

- Search content is serialized at build time to `/search-index.json`; the existing command dialog downloads the index once and filters it in the browser.
- Redirects move from `next.config.mjs` and redirect-only app routes into Cloudflare Pages' `public/_redirects` file.
- Next Image uses unoptimized static image output because the Next.js image optimization server is absent.
- The RSS route is explicitly marked static so it is emitted during the build.
- Cloudflare `_headers` applies a small set of browser security headers without introducing a content security policy that could break the site's current scripts, fonts, or Three.js scenes.

## Workflow and credential boundary

GitHub stores these values:

- Secret: `CLOUDFLARE_API_TOKEN`
- Variable: `CLOUDFLARE_ACCOUNT_ID`
- Variable: `CLOUDFLARE_PROJECT_NAME` with value `systems-understood`

The Cloudflare token needs only Account / Cloudflare Pages / Edit. Workflow permissions default to read-only source access. Pull request workflows from forks never receive repository secrets; validation still runs, while preview deployment is skipped.

The production job uses GitHub's `production` environment. Concurrency allows only one active production deployment and cancels superseded preview deployments.

## Routing and domain cutover

The first successful deployment is verified at its `pages.dev` address before attaching `pankajmouriya.com`. Cloudflare Pages then owns the apex custom domain and Cloudflare creates the required DNS record. `www.pankajmouriya.com` is attached as a second custom domain and redirected to the apex with a Cloudflare redirect rule or Pages redirect after hosted verification. `talks.pankajmouriya.com` remains intentionally retired.

Legacy article, book, search, and resume URLs remain available through `_redirects`. Redirect checks form part of hosted acceptance because a successful upload alone does not prove Cloudflare routing behavior.

## Verification and rollback

Local and CI acceptance requires:

1. lint, TypeScript, and content tests pass;
2. the production static export succeeds;
3. the export verifier finds required HTML, RSS, search index, headers, and redirect artifacts;
4. browser tests run against the static output rather than `next start`;
5. the deployed `pages.dev` URL serves the homepage, one article, one book chapter, RSS, search data, and a legacy redirect;
6. after domain attachment, both HTTPS hostnames work and `www` resolves to the chosen apex URL.

Rollback means redeploying a prior successful Pages deployment from Cloudflare or rerunning the workflow for a known-good commit. The existing Netlify projects remain recoverable until domain and redirect acceptance is complete.

## Operational documentation

The repository keeps the deployment command, GitHub configuration, domain sequence, hosted smoke checks, and rollback procedure in `docs/operations/cloudflare-pages-deployment.md`. The existing DNS runbook records the point at which the nameserver migration hands control to this deployment.
