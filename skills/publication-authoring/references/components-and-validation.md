# Components and validation
## Supported MDX

### Figure

```mdx
<Figure
  src="/images/blog/example/architecture.png"
  alt="Architecture showing requests moving through the policy boundary"
  caption="Optional caption supported by the draft."
  width={1600}
  height={900}
/>
```

Use actual pixel dimensions. `alt` describes visible information. Omit `caption` when the draft and image do not support one. Use `loading="eager"` only for a first-viewport image that needs it.

### Callout

```mdx
<Callout type="warning" title="Version-sensitive behavior">
  Verify this behavior against the version running in your environment.
</Callout>
```

Supported types: `note`, `tip`, `warning`, and `danger`.

### Code and tables

Use ordinary fenced code. A known filename can be declared as:

````mdx
```javascript title="example.js"
console.log('example');
```
````

Markdown tables are automatically wrapped for narrow-screen scrolling.

## Image handling

- Inspect each referenced local asset before writing alt text.
- Preserve an original unless optimization or conversion is requested.
- Normalize unsafe filenames to lowercase kebab case while keeping a suitable extension.
- Search for destination collisions before copying.
- Keep screenshots containing credentials, tokens, private hostnames, local addresses, or personal data out of `public/` and keep the content in draft until the issue is resolved.
- Do not download or replace missing images unless the user requests sourcing or generation. Missing referenced images keep the content in draft and must appear in the completion report.

## Validation sequence

Run from the repository root:

```sh
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

For a nondraft item, verify its generated route plus relevant discovery surfaces: archive, search, sitemap, and RSS for articles; catalog, chapter navigation, search, and sitemap for books. Confirm referenced images return successfully and the page has no phone-width overflow. Drafts must remain absent from public routes and discovery.
