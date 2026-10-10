# Pankaj Mouriya — portfolio and writing

A personal portfolio and technical publication built with Next.js 16, React 19, Fumadocs MDX, Tailwind CSS 4, and source-owned shadcn components. Writing is the center of the homepage; the Portfolio holds résumé-backed experience, a selected project, and conference talks.

## Run locally

Use Node.js 20.9.0 or later. The checked-in lockfile is for pnpm 10.18.3.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open `http://localhost:3000`. Routes include `/blog`, `/books`, `/search`, `/portfolio`, `/portfolio/projects`, `/portfolio/talks`, and `/resume`. The adapted Shadcn Studio experience block has a standalone preview at `/timeline-component-07` and is used on `/portfolio`. The résumé PDF is served at `/Pankaj-Mouriya-Resume.pdf`. The RSS feed is `/rss.xml`.

Set `NEXT_PUBLIC_SITE_URL` to the absolute deployment origin before a public build so canonical URLs, RSS, robots, and sitemap use the intended host. Production deployment, DNS, and cutover are separate from this local implementation.

## Verification

```sh
pnpm lint
pnpm typecheck
pnpm test
PLAYWRIGHT_CHANNEL=chrome pnpm test:browser
pnpm build
```

Playwright builds and starts a production server on port 3100. Use `pnpm exec playwright install chromium` to use bundled Chromium instead of a local Chrome channel. Visual checks write screenshots to `docs/review/screenshots/`. Progress and verification details are in [`PROGRESS.md`](PROGRESS.md).

## Writing and content

Add articles under `content/blog/`. Required frontmatter: `title`, `description`, `slug`, `date` (`YYYY-MM-DD`), `draft`, `kind`, and controlled `tags`. An optional `updated` date cannot precede publication. Add book chapters under `content/books/<book>/` with `title`, `description`, `slug`, `book`, `order`, and `draft`. Drafts are filtered before route, search, feed, and sitemap generation. `reader-draft.mdx` is a boundary fixture.

Fumadocs MDX performs the code syntax transform. Use ordinary fenced code blocks; a verified title syntax is:

````mdx
```javascript title="postmessage.js"
targetWindow.postMessage('hello', '*');
```
````

Use `<Callout type="note" title="...">...</Callout>` and `<Figure src="..." alt="..." caption="..." width={800} height={600} />` where useful. Figures require dimensions and meaningful alt text. Tables scroll on narrow screens.

Seven legacy articles and two web books (21 chapters) are published, with their referenced local figures. The source inventory and old-to-new route mapping are in `docs/migration/`. `python3 scripts/migrate_legacy.py` can regenerate the migrated MDX and images when the read-only sibling checkout `../noShellAccess.com-main-blog` is present; it requires Pillow. The generated content itself is checked in and does not require that checkout to build. The old book TOC is replaced by reader navigation; the stale social-links chapter and unfinished legacy series are not presented as finished books. PDF and EPUB editions are a separate publication workflow.

Local permanent redirects cover the migrated Docusaurus paths. The existing `noshellaccess.com` and `talks.pankajmouriya.com` deployments are independent, so requests to those hosts need host-side redirects during a future cutover.

## Portfolio sources

The user-supplied September 2026 résumé is the source for the career timeline and recent talks. The PDF in `public/` is an unchanged byte-for-byte copy. The Security Diff is the selected active public project, linked to its live site and source repository. Earlier talks and resource links come from the author's public talk archive. Its Kong “current” label is stale against the supplied résumé. Other repositories are not described as maintained until reviewed.

The numbered experience block lives in `src/components/shadcn-studio/blocks/timeline-component-07/`. Its five entries come from `src/lib/experience-timeline.ts`, which maps the résumé-backed roles and highlights in `src/lib/portfolio.ts`. Motion draws the timeline as the page scrolls; reduced-motion preferences keep the content and line static.

Component and font sources are recorded in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
