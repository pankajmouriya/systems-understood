import { expect, test } from '@playwright/test';

test('search finds published article text and hides drafts', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Search writing' });
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox', { name: 'Search articles and book chapters' }).fill('postMessage');
  await expect(dialog.getByText('The Blend of Developer Tools into Security Assessments')).toBeVisible();
  await dialog.getByRole('combobox').fill('Reader draft route fixture');
  await expect(page.getByText('No writing found')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
});

test('old search URL opens the dialog on the homepage', async ({ page }) => {
  await page.goto('/search?q=postMessage');
  await expect(page).toHaveURL(/\/$/);
  const dialog = page.getByRole('dialog', { name: 'Search writing' });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('combobox')).toHaveValue('postMessage');
  await expect(dialog.getByText('postMessage API Implementation and limitations', { exact: true })).toBeVisible();
});

test('mobile menu opens search without leaving the page', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/portfolio');
  await page.getByRole('button', { name: /Menu/ }).click();
  await page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('button', { name: 'Search writing' }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('dialog', { name: 'Search writing' })).toBeVisible();
  const bounds = await page.getByRole('dialog', { name: 'Search writing' }).boundingBox();
  expect(bounds?.x).toBeGreaterThanOrEqual(0);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(375);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
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
