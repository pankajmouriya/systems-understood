# Article workflow
## Input and destination

Accept `.md` or `.mdx`. Create `content/blog/<slug>.mdx`. Put local media in `public/images/blog/<slug>/` and reference it from MDX as `/images/blog/<slug>/<file>`.

Start from `../assets/article-template.mdx`. Replace every sample value and remove optional fields without evidence.

## Frontmatter contract

Required:

- `title`: nonempty reader-facing title.
- `description`: concise summary supported by the draft.
- `slug`: unique lowercase kebab case.
- `date`: real `YYYY-MM-DD` date.
- `draft`: boolean.
- `kind`: `essay`, `tutorial`, `research`, or `note`.
- `tags`: controlled values supported by the draft. Use an empty array and report it when none apply; do not force an unrelated tag.

Controlled tags:

- `application-security`
- `vulnerability-research`
- `supply-chain-security`
- `cloud-security`
- `containers-kubernetes`
- `devsecops`
- `engineering`
- `tools-automation`

Optional when evidenced: `updated`, `author`, `featured`, `series`, `cover`, `canonicalUrl`, and `security`. Add `author: "Pankaj Mouriya"` only when the user or source provenance identifies Pankaj as the author; otherwise omit it. `updated` cannot precede `date`. `canonicalUrl` belongs to a known original publication, not the local route. Security metadata may include evidenced advisory IDs, review date, and status only.

## Conversion rules

- Remove a duplicate body H1 because the article layout renders the frontmatter title.
- Keep meaningful H2-H4 structure; these headings feed the table of contents.
- Preserve fenced code and specify a language only when known. A filename uses `title="file.ext"` after the language.
- Convert genuine notes, tips, warnings, and dangers to supported `Callout` components.
- Convert local Markdown images to `Figure` components after inspecting the asset.
- Keep citations and external links. Do not convert uncertain prose into stronger factual claims.
- Do not change the homepage's selected article or the Writing page's curated paths unless requested.

## Automatic integration

A valid, nondraft file is picked up by `/blog/<slug>`, the Writing archive, search, RSS, sitemap, metadata, reading time, topic badges, reader navigation, topic illustration, and reading reward. No route component is required.
