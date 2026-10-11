# Cloudflare Pages deployment

- **Repository:** `https://github.com/pankajmouriya/systems-understood`
- **Production branch:** `main`
- **Pages project:** `systems-understood`
- **Build output:** `out/`
- **Deployment mode:** Wrangler Direct Upload from GitHub Actions
- **Public preview:** `https://systems-understood.pages.dev`
- **Production domain:** `https://pankajmouriya.com`

This runbook owns the application deployment that follows the DNS authority migration in [`cloudflare-domain-setup.md`](./cloudflare-domain-setup.md). The site is a Next.js static export. Cloudflare never runs a Next.js server for this project.

## GitHub configuration

The repository needs these Actions settings:

| Kind | Name | Value |
| --- | --- | --- |
| Secret | `CLOUDFLARE_API_TOKEN` | Restricted Cloudflare token; never store the value in the repository |
| Variable | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID |
| Variable | `CLOUDFLARE_PROJECT_NAME` | `systems-understood` |

The API token permission is **Account → Cloudflare Pages → Edit** for the target account. The user reported all three GitHub values configured on 2026-10-11.

Create a GitHub environment named `production`. Environment approval is optional for this personal repository; the environment still gives production deployments a distinct audit trail.

## Workflow behavior

`.github/workflows/ci.yml` runs on pull requests and pushes to `main`:

1. install pnpm `10.18.3` and Node.js `24` with the Node 24 compatible pnpm setup action;
2. install the frozen dependency graph and Chromium;
3. run lint, type checks, content/deployment tests, and the Next.js build;
4. verify the static export contract;
5. run Playwright against `wrangler pages dev out`;
6. upload `out/` as `cloudflare-pages-out`.

A same-repository pull request also uploads that artifact to the branch `pr-<number>`. Forked pull requests receive no Cloudflare credentials and only run validation.

`.github/workflows/deploy.yml` starts only after the `CI` workflow completes. It deploys only when the triggering run was a successful push to `main`. It downloads the exact `cloudflare-pages-out` artifact from that CI run, creates the Direct Upload Pages project if absent, deploys it, and idempotently attaches `pankajmouriya.com` through the Cloudflare Pages API.

```sh
npx --yes wrangler@4.149.0 pages deploy out \
  --project-name "systems-understood" \
  --branch main \
  --commit-hash "<verified-main-sha>" \
  --commit-dirty=false
```

The workflow never rebuilds in the production job.

## First deployment

1. Push the reviewed local branch to GitHub `main`.
2. Open **GitHub → Actions → CI** and wait for `Validate static export` to pass.
3. Open **GitHub → Actions → Deploy Cloudflare Pages** and wait for `Deploy verified production artifact` to pass.
4. In **Cloudflare → Workers & Pages**, confirm `systems-understood` exists as a Direct Upload Pages project and its production branch is `main`.
5. Open `https://systems-understood.pages.dev` and run the hosted checks below.

If project creation fails, confirm `CLOUDFLARE_PROJECT_NAME` is exactly `systems-understood` and the token has Pages Edit permission. If artifact download fails, confirm the preceding `CI` run uploaded `cloudflare-pages-out` and has not exceeded its seven-day retention.

## Hosted acceptance before the custom domain

Run these read-only checks against `https://systems-understood.pages.dev`:

```sh
curl -fsSI https://systems-understood.pages.dev/
curl -fsSI https://systems-understood.pages.dev/blog/informer-controllers
curl -fsSI https://systems-understood.pages.dev/books/same-origin-policy/postmessage
curl -fsS https://systems-understood.pages.dev/rss.xml | head
curl -fsS https://systems-understood.pages.dev/search-index.json | head
curl -fsSI https://systems-understood.pages.dev/appsecurity/devtools
curl -fsSI https://systems-understood.pages.dev/resume
```

Acceptance requires:

- the homepage, article, and chapter return `200`;
- RSS is XML and includes published writing;
- the search index is valid JSON with non-empty `results`;
- `/appsecurity/devtools` returns `308` to `/blog/devtools`;
- `/resume` returns `308` to `/portfolio/resume`;
- HTML includes `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and the configured referrer and permissions policies;
- the homepage search dialog finds both an article and a book chapter.

## Attach `pankajmouriya.com`

The production workflow attaches the apex automatically after the verified artifact is deployed. It first lists the project's domains and creates `pankajmouriya.com` only when absent, so retries are safe. Open **Cloudflare → Workers & Pages → systems-understood → Custom domains** and wait until its status is **Active** and its certificate is issued.

`www.pankajmouriya.com` remains a separate owner action because the deployment token has only Pages Edit permission. Follow Cloudflare's documented **Bulk Redirects** setup from `www.pankajmouriya.com` to `https://pankajmouriya.com` with **Preserve query string**, **Subpath matching**, and **Preserve path suffix** enabled. Create the proxied `www` placeholder record Cloudflare requests. Do not attach `www` as a second Pages hostname because that would serve duplicate content instead of enforcing the canonical apex.

Keep `talks.pankajmouriya.com` absent; it is intentionally retired.

Do not create hand-written CNAMEs to Netlify. Do not attach the domain before the zone is active.

## Production acceptance

Repeat the hosted checks with `https://pankajmouriya.com`, then verify:

```sh
dig +short NS pankajmouriya.com
curl -fsSI https://pankajmouriya.com/
curl -fsSI https://www.pankajmouriya.com/blog/informer-controllers?source=www
curl -fsSI https://pankajmouriya.com/appsecurity/devtools
```

Expected results:

- public NS answers contain only the two assigned Cloudflare nameservers;
- apex HTTPS returns `200` with a valid certificate;
- `www` returns `301` to the same path and query on the apex;
- the legacy article returns `308` to its new path;
- GitHub's production deployment points at the same commit deployed by Pages.

Enable DNSSEC from the DNS runbook after the zone is active. Keep the Netlify projects recoverable until these checks pass.

## Rollback

For an application regression, open **Workers & Pages → systems-understood → Deployments**, locate the most recent known-good production deployment, and select **Rollback to this deployment**. Verify the homepage, one article, RSS, and a legacy redirect afterward.

For a source-level rollback, revert the faulty commit on `main`; do not rewrite shared history. CI will validate the revert and the deployment workflow will publish its artifact.

If Cloudflare Pages itself cannot serve the domain and the outage must end before diagnosis, restore the previous Netlify DNS only as a deliberate incident action using the values retained in the DNS runbook. Do not delete the Pages project or the Netlify projects during investigation.

## Local commands

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm verify:export
pnpm exec playwright install chromium
pnpm test:browser
```

`pnpm preview:cloudflare` serves an existing `out/` directory on `http://127.0.0.1:3100` with the same Pages redirects and headers used in hosted acceptance.

## References

- [Cloudflare Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Direct Upload with continuous integration](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)
- [Static Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Redirecting `www` to the apex](https://developers.cloudflare.com/pages/how-to/www-redirect/)
