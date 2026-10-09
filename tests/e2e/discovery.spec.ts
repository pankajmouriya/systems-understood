import { expect, test } from '@playwright/test';

test('search finds published article text and hides drafts', async ({ page }) => {
  await page.goto('/search?q=postMessage');
  await expect(page.getByRole('heading', { level: 1, name: 'Search writing' })).toBeVisible();
  await expect(page.getByRole('link', { name: /The Blend of Developer Tools/ })).toBeVisible();
  await page.getByRole('searchbox', { name: 'Search articles and book chapters' }).fill('Reader draft route fixture');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('No writing found')).toBeVisible();
});

test('feed, sitemap, resume and legacy route are available', async ({ page, request }) => {
  const feed = await request.get('/rss.xml');
  expect(feed.status()).toBe(200);
  expect(await feed.text()).toContain('The Blend of Developer Tools');
  expect(await feed.text()).not.toContain('Reader draft route fixture');
  const sitemap = await request.get('/sitemap.xml');
  expect(await sitemap.text()).toContain('/blog/devtools');
  expect(await sitemap.text()).toContain('/books/same-origin-policy/postmessage');
  expect(await sitemap.text()).not.toContain('/blog/reader-draft');
  expect((await request.get('/robots.txt')).status()).toBe(200);
  await page.goto('/resume');
  await expect(page.getByRole('heading', { level: 1, name: /Résumé/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Download PDF/ })).toHaveAttribute('href', '/Pankaj-Mouriya-Resume.pdf');
  expect((await request.get('/Pankaj-Mouriya-Resume.pdf')).status()).toBe(200);
  const legacy = await request.get('/appsecurity/devtools', { maxRedirects: 0 });
  expect(legacy.status()).toBe(308);
  expect(legacy.headers().location).toBe('/blog/devtools');
  const kubernetes = await request.get('/containersecurity/guide-admission-controllers', { maxRedirects: 0 });
  expect(kubernetes.status()).toBe(308);
  expect(kubernetes.headers().location).toBe('/blog/guide-admission-controllers');
  const chapter = await request.get('/docs/sop/postmessage', { maxRedirects: 0 });
  expect(chapter.status()).toBe(308);
  expect(chapter.headers().location).toBe('/books/same-origin-policy/postmessage');
});
