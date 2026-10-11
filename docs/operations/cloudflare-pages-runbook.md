# Cloudflare Pages deployment runbook

This runbook explains how to publish a static web application to Cloudflare Pages, automate deployments with GitHub Actions, move a custom domain safely, and verify the result. It is written for both human operators and AI coding agents.

**Last verified:** October 11, 2026

> Cloudflare now recommends Workers for many new applications. Use Pages when the application produces a static directory that can be served without a persistent application server. A full stack Next.js application with server rendering, Server Actions, middleware, or request time route handlers needs the current Cloudflare Workers path instead.

## 1. Choose the correct hosting model

Answer these questions before creating a Cloudflare project:

| Question | Pages is suitable when | Choose Workers or another runtime when |
| --- | --- | --- |
| What does the build produce? | A directory of HTML, CSS, JavaScript, images, and other static assets | A server bundle or long running process |
| Does a request execute application code? | No, apart from optional Pages Functions designed for that environment | Yes, through Node.js APIs, SSR, middleware, or server route handlers |
| Are all dynamic routes known during the build? | Yes | No |
| Are image transformations performed at request time? | No, or images are emitted unoptimized | Yes |
| Does the application need a database or private runtime secrets? | Browser code calls a separate API | The web application itself accesses them on each request |

For Next.js, prove that `next build` creates `out/`. Do not assume a project is static because most pages look static.

## 2. Record the deployment inputs

Create a worksheet before changing GitHub, Cloudflare, or DNS:

```text
Repository:             <owner>/<repository>
Production branch:      main
Package manager:        npm | pnpm | yarn | bun
Runtime version:        <Node version>
Build command:          <command>
Test commands:          <commands>
Build output directory: <dist | build | out | public>
Cloudflare account ID:  <32-character account ID>
Pages project name:     <lowercase-project-name>
Pages hostname:         <project-name>.pages.dev
Production apex:        example.com
Canonical host:         example.com | www.example.com
Current DNS provider:   <provider>
Domain registrar:       <registrar>
Rollback origin:        <existing host or last known-good Pages deployment>
```

Keep this worksheet in the repository without secret values. Store only the API token in a secret manager.

## 3. Inventory the current domain before changing it

Collect read-only evidence:

```sh
dig +short NS example.com
dig +short SOA example.com
dig +short A example.com
dig +short AAAA example.com
dig +short CNAME www.example.com
dig +short MX example.com
dig +short TXT example.com
dig +short CAA example.com
dig +short DS example.com
curl -fsSI https://example.com/
curl -fsSI https://www.example.com/
```

Export the complete zone from the current DNS provider when possible. Record mail, domain verification, certificate, and service records even when the website does not use them. A nameserver change delegates the whole zone, not only the website.

Do not:

- copy provider managed `NS` or `SOA` records into the new zone;
- copy transient CDN edge IP addresses as origin records;
- remove mail or verification records because they appear unrelated to the site;
- enable DNSSEC at the new provider while a stale DS record exists at the registrar;
- delete the previous deployment before production acceptance passes.

## 4. Make the application deployable as static assets

The exact framework configuration varies. The required contract is stable:

1. the build succeeds in a clean checkout;
2. the output directory contains the complete site;
3. no page depends on an application server;
4. redirects and headers have Cloudflare compatible configuration;
5. canonical URLs, sitemap, robots, feeds, and social metadata use the production origin;
6. the output can be served by `wrangler pages dev`.

For a Next.js static export, the configuration normally includes:

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
}

export default nextConfig
```

This is only a starting point. Resolve all static export errors reported by the installed Next.js version. Read the framework documentation shipped with that version before changing framework APIs.

### Redirects and response headers

Cloudflare Pages reads these files from the deployed output:

- `_redirects` for static redirects and rewrites;
- `_headers` for static response headers.

Keep their source files in the directory that the build copies into the output, commonly `public/`.

Example `_redirects`:

```text
/old-article  /articles/new-article  308
/search       /                     302
```

Example `_headers`:

```text
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

Test redirect status, destination path, and query preservation. A browser reaching the correct page is insufficient evidence because it may hide a wrong intermediate response.

## 5. Verify the build locally

Use the repository's package manager and lockfile. A typical sequence is:

```sh
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm test
NEXT_PUBLIC_SITE_URL=https://example.com pnpm build
npx wrangler pages dev out --ip 127.0.0.1 --port 3100
```

Replace `pnpm`, `out`, and the site URL with the recorded values. Exercise at least:

- the homepage;
- a deep content route;
- a missing route;
- each important redirect class;
- sitemap, robots, RSS or Atom, and any client search index;
- light and dark themes if supported;
- a small phone viewport;
- keyboard navigation and the main interactive flow.

## 6. Create the Cloudflare credentials

In Cloudflare:

1. Open **My Profile → API Tokens**.
2. Create a custom token.
3. Grant **Account → Cloudflare Pages → Edit** for the intended account.
4. Add **Zone → DNS → Edit** only if the automation will create DNS records. A Pages-only token cannot manage the zone.
5. Restrict account and zone resources as narrowly as possible.
6. Copy the token once and store it directly in GitHub Actions secrets.

Find the account ID in the Cloudflare account or zone overview. Account IDs are configuration, while the API token is a secret.

In GitHub, create:

| Storage | Name | Example |
| --- | --- | --- |
| Actions secret | `CLOUDFLARE_API_TOKEN` | Secret token value |
| Actions variable | `CLOUDFLARE_ACCOUNT_ID` | `023e105f...` |
| Actions variable | `CLOUDFLARE_PROJECT_NAME` | `example-site` |

Create a GitHub environment named `production`. Add required reviewers when the repository needs a manual production gate.

Never print the token, put it in a command argument visible to other processes, commit it, or save API responses containing credentials as artifacts.

## 7. Select Direct Upload or Git integration

Use one model deliberately:

### Direct Upload

Choose Direct Upload when GitHub Actions owns the build and tests. Wrangler uploads a prebuilt directory. This enables one verified artifact to move from CI into production.

Cloudflare does not support converting a Direct Upload project into Git integration later. A new Pages project is required for that change.

### Git integration

Choose Git integration when Cloudflare should clone the repository, build it, and create previews. This is simpler, but the build runs separately from GitHub CI unless the pipeline is designed to reconcile them.

The remainder of this runbook uses Direct Upload.

## 8. Create and deploy the Pages project

Pin Wrangler in `devDependencies` or pin the version used by automation. Create the project once:

```sh
CLOUDFLARE_ACCOUNT_ID='<account-id>' \
CLOUDFLARE_API_TOKEN='<token>' \
npx wrangler pages project create example-site --production-branch main
```

Deploy a verified output directory:

```sh
CLOUDFLARE_ACCOUNT_ID='<account-id>' \
CLOUDFLARE_API_TOKEN='<token>' \
npx wrangler pages deploy out \
  --project-name example-site \
  --branch main \
  --commit-hash '<git-sha>' \
  --commit-dirty=false
```

Prefer environment secrets in CI over literal values shown in these examples.

## 9. Automate GitHub Actions

### Minimal workflow

This pattern is adequate for small sites when one job may build and deploy:

```yaml
name: Deploy Cloudflare Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  deployments: write

concurrency:
  group: cloudflare-pages-production
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production
    steps:
      - uses: actions/checkout@v6

      # Install the repository's runtime and package manager here.
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm test
      - run: pnpm build
        env:
          NEXT_PUBLIC_SITE_URL: https://example.com

      - name: Deploy
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
          command: >-
            pages deploy out
            --project-name=${{ vars.CLOUDFLARE_PROJECT_NAME }}
            --branch=main
            --commit-hash=${{ github.sha }}
```

Update action versions from their official release sources and dependency automation. Do not blindly copy the versions above years later.

### Hardened workflow

For stronger provenance, use two workflows:

1. **CI** builds, tests, runs browser checks through `wrangler pages dev`, and uploads the static directory as an immutable artifact.
2. **Production** starts through `workflow_run` only after a successful push to `main`, downloads the artifact from that exact run ID, and deploys without rebuilding.

The production condition should include all three checks:

```yaml
if: >-
  github.event.workflow_run.conclusion == 'success' &&
  github.event.workflow_run.event == 'push' &&
  github.event.workflow_run.head_branch == 'main'
```

Download the exact artifact:

```yaml
- uses: actions/download-artifact@v7
  with:
    name: cloudflare-pages-out
    path: out
    github-token: ${{ secrets.GITHUB_TOKEN }}
    run-id: ${{ github.event.workflow_run.id }}
```

The complete working example for this repository is in [CI](../../.github/workflows/ci.yml) and [production deployment](../../.github/workflows/deploy.yml).

### Pull request previews

Deploy previews only after CI passes. Never expose Cloudflare secrets to workflows running code from untrusted forks. A safe same-repository condition is:

```yaml
if: github.event_name == 'pull_request' && github.event.pull_request.head.repo.full_name == github.repository
```

Use a branch identifier such as `pr-${{ github.event.pull_request.number }}` with `wrangler pages deploy`.

## 10. Accept the `pages.dev` deployment first

Do not move the production domain until the generated Pages hostname passes acceptance:

```sh
export PAGES_ORIGIN='https://example-site.pages.dev'

curl -fsSI "$PAGES_ORIGIN/"
curl -fsSI "$PAGES_ORIGIN/a-real-deep-route"
curl -fsSI "$PAGES_ORIGIN/a-legacy-route"
curl -fsS "$PAGES_ORIGIN/sitemap.xml" | head
curl -fsS "$PAGES_ORIGIN/robots.txt"
```

Acceptance evidence should include:

- the Git commit SHA;
- the CI run and deployment run URLs;
- the Pages deployment URL;
- HTTP status and location headers for important routes;
- content checks for generated files;
- browser coverage for the primary user flow;
- confirmation that no production domain was changed during testing.

## 11. Move or attach the custom domain

### When Cloudflare already hosts the DNS zone

In **Workers & Pages → project → Custom domains**, add the apex. If the zone belongs to the same Cloudflare account and its nameservers are active, Cloudflare can create or request the needed DNS record.

If Pages displays **Complete DNS setup**, create exactly the record it requests. A common apex configuration is:

| Type | Name | Target | Proxy | TTL |
| --- | --- | --- | --- | --- |
| `CNAME` | `@` | `example-site.pages.dev` | Proxied | Auto |

Use the Pages custom-domain flow before adding the record. A hand-written CNAME without associating the hostname with Pages can produce a `522`.

### When another provider hosts DNS

For a subdomain, Pages can request a CNAME to the `pages.dev` hostname. An apex custom domain must use a Cloudflare zone with nameservers delegated to Cloudflare.

When changing nameservers:

1. copy and review the entire existing zone;
2. lower relevant TTLs in advance when practical;
3. resolve conflicting imported records;
4. verify Cloudflare's assigned two nameservers;
5. check for an existing registrar DS record;
6. change only the registrar nameservers;
7. wait until public NS answers show Cloudflare;
8. verify mail and non-web records;
9. attach the Pages hostname;
10. retain the former deployment for rollback until acceptance passes.

Do not mix application targets with nameserver values. Registrars expect hostnames such as `alice.ns.cloudflare.com`, while DNS records contain the application target.

### API attachment

The Pages API supports idempotent automation:

```sh
domains_url="https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/pages/projects/${CLOUDFLARE_PROJECT_NAME}/domains"

curl --fail-with-body --silent --show-error \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  "$domains_url"

curl --fail-with-body --silent --show-error \
  -X POST \
  -H "Authorization: Bearer ${CLOUDFLARE_API_TOKEN}" \
  -H 'Content-Type: application/json' \
  --data '{"name":"example.com"}' \
  "$domains_url"
```

List first and create only when absent. Poll the individual domain endpoint until `result.status` is `active`. Treat `blocked`, `deactivated`, and `error` as failures and report the validation and verification fields. A successful POST only proves that Cloudflare accepted the request.

## 12. Redirect `www` to the canonical apex

Avoid serving identical content on two hosts. If the apex is canonical, Cloudflare's documented Pages pattern is:

1. create a Bulk Redirect list entry from `www.example.com` to `https://example.com`;
2. use status `301`;
3. enable query-string preservation, subpath matching, and path-suffix preservation;
4. enable a Bulk Redirect Rule using the list;
5. create a proxied DNS placeholder:

| Type | Name | Value | Proxy | TTL |
| --- | --- | --- | --- | --- |
| `A` | `www` | `192.0.2.1` | Proxied | Auto |

Verify a deep URL and query string:

```sh
curl -fsSI 'https://www.example.com/articles/test?source=www'
```

Expect `301` and `Location: https://example.com/articles/test?source=www`.

## 13. Enable DNSSEC after the zone is stable

Do this after nameserver delegation and production acceptance:

1. open **Cloudflare → DNS → Settings → DNSSEC**;
2. enable DNSSEC;
3. when the registrar is not Cloudflare, copy Cloudflare's DS values to the registrar's DS-record form;
4. wait for the parent zone to publish the DS record;
5. verify from multiple public resolvers.

Commands:

```sh
dig +short DS example.com
dig +dnssec example.com A
```

Do not invent DS values or reuse values from the former DNS provider. A wrong DS record can make the entire domain fail validation.

## 14. Production acceptance

Run checks through at least two public resolvers and over HTTPS:

```sh
dig @1.1.1.1 +short NS example.com
dig @8.8.8.8 +short NS example.com
dig @1.1.1.1 +short A example.com
dig @8.8.8.8 +short A example.com

curl -fsSI https://example.com/
curl -fsSI https://example.com/a-real-deep-route
curl -fsSI https://www.example.com/a-real-deep-route?source=www
```

Check all of the following:

- the apex resolves publicly;
- the TLS certificate matches the hostname;
- the homepage and a deep route return `200`;
- the canonical host is present in metadata, feeds, sitemap, and robots;
- `www` preserves the path and query while redirecting;
- legacy redirects retain their expected status and destination;
- security headers are present;
- application assets load without mixed-content or cross-origin errors;
- the deployed commit matches the successful CI artifact;
- mail and unrelated subdomains still resolve as intended;
- the old host is retained or deliberately retired.

Recursive resolvers can temporarily cache an earlier `NXDOMAIN`. Compare an authoritative Cloudflare nameserver and public resolvers before diagnosing an application failure. A direct `curl --resolve` check can distinguish edge readiness from local DNS cache delay:

```sh
curl --resolve example.com:443:<cloudflare-edge-ip> -fsSI https://example.com/
```

Use an IP returned by the authoritative lookup; never save that IP as a permanent DNS record.

## 15. Rollback

### Application regression

Use **Workers & Pages → project → Deployments → Rollback** to select the last known-good production deployment. Then repeat homepage, deep-route, generated-content, and redirect checks.

For a source rollback, revert the faulty commit on `main`. Do not rewrite shared Git history. Let CI validate and deploy the revert.

### Domain or DNS incident

If the Pages hostname is healthy but the custom domain is not:

1. inspect the Pages custom-domain status and validation fields;
2. inspect authoritative DNS answers;
3. verify proxy state and the exact target;
4. inspect CAA and DS records;
5. retry Pages validation;
6. restore the prior DNS target only when it is a recorded and tested rollback source.

Do not delete the Pages project during diagnosis. Deleting state removes evidence and can make recovery harder.

## 16. Troubleshooting matrix

| Symptom | Check | Common cause | Safe response |
| --- | --- | --- | --- |
| Project creation says the name exists | Direct `GET /pages/projects/<name>` | A list response was stale or parsed incorrectly | Treat only a direct `404` as permission to create |
| `pages.dev` works but apex does not resolve | Authoritative A/CNAME answer and custom-domain status | Missing requested DNS record | Add the exact proxied record shown by Pages |
| Apex returns `522` | Pages association and CNAME target | DNS was added without associating the domain in Pages | Complete the Pages custom-domain flow, then retry validation |
| Domain remains verifying | Domain API validation and verification fields | DNS propagation, wrong account, record mismatch, CAA restriction | Correct the stated error; do not repeatedly recreate the domain |
| Certificate is pending | CAA and domain validation | CAA excludes Cloudflare's CA or DNS is not active | Correct CAA or DNS and retry validation |
| Local machine cannot resolve, public resolver can | Local cache versus `1.1.1.1` and authoritative NS | Negative DNS caching | Wait for negative TTL or flush local cache; use `--resolve` for diagnosis |
| `www` serves duplicate content | Redirect rule and placeholder record | `www` was attached as a second Pages domain | Configure a canonical edge redirect |
| Redirect reaches the right page with wrong status | Raw response headers | Browser followed the redirect silently | Test with `curl -I` and assert status plus `Location` |
| CI passed but production differs | Artifact run ID and deployed commit | Production rebuilt instead of using CI output | Download and deploy the exact CI artifact |
| Fork PR can access Cloudflare secrets | Preview job condition | Secrets exposed to untrusted code | Block preview deployment for forked pull requests |

## 17. Operating protocol for AI agents

An AI agent helping with this deployment should follow this order:

1. Inspect `package.json`, lockfiles, framework config, existing workflows, output directory, redirects, headers, and repository instructions.
2. Read the current framework and Cloudflare documentation. Do not rely on remembered Next.js, Wrangler, or action behavior.
3. Determine static compatibility from code and a clean build.
4. Inventory live DNS and current hosting read-only.
5. Write a plan that identifies every external mutation: repository push, Cloudflare project creation, production deploy, DNS record change, nameserver change, redirect rule, and DNSSEC DS update.
6. Prepare code, workflows, tests, and runbooks before requesting any approval required by the operator's policy.
7. Keep credentials in the platform secret store and redact token-bearing output.
8. Build once in CI and preserve artifact-to-commit provenance.
9. Verify `pages.dev` before modifying the custom domain.
10. Make DNS changes in a recoverable sequence and preserve unrelated records.
11. Validate the requested public endpoint, not only workflow success or a health check.
12. Report verified facts, external blockers, and remaining owner actions separately.

### Agent stop conditions

Stop before proceeding when:

- the application requires server features that Pages cannot run;
- the build output is unknown or empty;
- the Cloudflare account ID and zone belong to different accounts unexpectedly;
- a DNS import omits mail or verification records;
- a registrar DS record is present and its migration plan is unclear;
- the requested DNS mutation was not authorized;
- the deployment token lacks the permission needed for the next mutation;
- acceptance fails on the public hostname.

Do not claim completion while any required domain, TLS, redirect, or content check is unverified.

## 18. Evidence record template

Save a short release record with each production cutover:

```md
## Cloudflare Pages release

- Date/time:
- Operator:
- Repository:
- Commit SHA:
- CI run:
- Deployment run:
- Pages project:
- Pages deployment URL:
- Production domain:
- DNS nameservers:
- DNS changes:
- Custom-domain status:
- DNSSEC status:
- Acceptance commands and results:
- Rollback target:
- Remaining actions:
```

## 19. Reference implementation in this repository

This repository uses the hardened pattern:

- [CI workflow](../../.github/workflows/ci.yml)
- [production workflow](../../.github/workflows/deploy.yml)
- [site specific deployment record](./cloudflare-pages-deployment.md)
- [GoDaddy to Cloudflare DNS migration](./cloudflare-domain-setup.md)
- [static export verifier](../../scripts/verify-static-export.mjs)

Use these as examples of the architecture. Replace project-specific routes, package versions, output paths, domains, and acceptance assertions.

## Official references

- [Cloudflare Pages Direct Upload](https://developers.cloudflare.com/pages/get-started/direct-upload/)
- [Direct Upload with continuous integration](https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/)
- [Static Next.js on Pages](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/)
- [Next.js deployment choices on Cloudflare](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Pages redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Redirecting `www` to the apex](https://developers.cloudflare.com/pages/how-to/www-redirect/)
- [Pages custom-domain API](https://developers.cloudflare.com/api/resources/pages/subresources/projects/subresources/domains/)
- [Cloudflare DNSSEC](https://developers.cloudflare.com/registrar/get-started/enable-dnssec/)
