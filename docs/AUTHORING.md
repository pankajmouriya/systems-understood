# Publishing articles and ebooks
Normal content uses MDX files and the existing readers. You do not write a new HTML or React page.

## Fastest workflow with Codex

Provide the source file, its content type, and the image directory:

```text
Use $publication-authoring to convert ./drafts/admission-control.md into a blog article.
Its images are beside the draft. Keep it unpublished for review.
```

For an ebook:

```text
Use $publication-authoring to turn ./drafts/runtime-security/ into a new web ebook.
The Markdown files are in chapter order. Keep the whole book in draft.
```

The versioned skill lives at `skills/publication-authoring/SKILL.md`. It preserves technical claims, converts supported Markdown into repository MDX, organizes images, adds validated metadata, and runs repository checks.

## Blog article

Create `content/blog/<slug>.mdx`, or start from `skills/publication-authoring/assets/article-template.mdx`.

Required metadata:

```yaml
---
title: "Article title"
description: "A concise description."
slug: "article-slug"
date: "2026-10-11"
author: "Pankaj Mouriya"
draft: true
kind: "tutorial"
tags:
  - application-security
---
```

Kinds are `essay`, `tutorial`, `research`, and `note`. Controlled tags are `application-security`, `vulnerability-research`, `supply-chain-security`, `cloud-security`, `containers-kubernetes`, `devsecops`, `engineering`, and `tools-automation`.

Store images under `public/images/blog/<slug>/`. A valid nondraft article automatically appears in its `/blog/<slug>` route, Writing archive, search, RSS, and sitemap.

## Ebook or chapter

Create chapters under `content/books/<book-slug>/`, or start from `skills/publication-authoring/assets/book-chapter-template.mdx`.

```yaml
---
title: "Chapter title"
description: "A concise chapter description."
slug: "chapter-slug"
book: "registered-book-slug"
order: 1
draft: true
---
```

Adding a chapter to an existing book needs only the MDX file. A completely new ebook also needs its slug added to the chapter schema and one metadata object added to the `books` registry in `src/lib/source.ts`. The skill performs both changes. The existing reader generates the book landing page, chapter routes, contents, previous and next navigation, search, and sitemap entries.

## Figures, callouts, and code

```mdx
<Figure src="/images/blog/example/diagram.png" alt="What the diagram visibly shows" caption="Optional caption." width={1200} height={700} />

<Callout type="note" title="Context">
  Supporting information.
</Callout>
```

Callout types are `note`, `tip`, `warning`, and `danger`. Standard fenced code blocks and Markdown tables are supported.

## Draft and publication behavior

New content defaults to `draft: true`. Drafts do not appear in public routes, search, RSS, or sitemap. Ask explicitly to publish or “make live” when review is complete; that changes the repository content to `draft: false`. It does not deploy the site unless you also request a public deployment and identify the release target. Missing or sensitive referenced images keep the content in draft. Local commits are created only when you request them or the current session already authorizes them.

## Validation

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```
