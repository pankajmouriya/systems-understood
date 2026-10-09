# First article reader review

Route: `/blog/devtools`

Source: `../noShellAccess.com-main-blog/appsecurity/2021-08-26-welcome/2021-07-07-devtools.md`

The source contains 12 headings, three code fences, 14 images, and links in its references section. The migrated MDX retains those counts and renders them with the custom reader. It also adds one explanatory callout and a seven-column comparison table. The article is dated 7 July 2021. No updated or review date is asserted because the source does not provide one. The historical-context callout tells readers to validate older tool behavior.

The screenshots under `screenshots/` cover 375, 768, 1280, and 1600 px widths in light and dark. They are full-page captures from Chromium against the production build. A local browser test checks no page-level horizontal overflow at each width. It also checks code copy, image zoom and focus return, draft and unknown route 404s, heading links, the skip link, and theme switching. The same interactions run on a dark-mode phone.

All 14 source screenshots were inspected. They show public-site browser interfaces or OWASP Juice Shop examples; the Burp Suite screenshot already obscures hostnames. The copied PNGs were verified pixel-identical to source, then their ancillary text metadata was removed. The `Software` field was the only metadata found in the source PNGs.

Final local checks: lint passed; TypeScript typecheck passed; eight content tests passed; seven Playwright tests passed against the production build; `pnpm build` prerendered only `/blog/devtools` from the collection. The hosted Docusaurus URLs and fragments have not been live-verified.

Open items before accepting a launch:

- Confirm the source-config URLs and heading fragments against the hosted Docusaurus site, then review redirects.
- Review all remaining posts and their assets, including the JWT article's external script embed.
- Complete the wider accessibility review; automated browser checks are a smoke test.
- Test the site on its intended preview host and verify absolute canonical URLs there.

This is a reviewable first article slice, not a migration or launch acceptance record.
