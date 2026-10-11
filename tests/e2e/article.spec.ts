import { expect, test } from '@playwright/test';

const articlePath = '/blog/devtools';

test('article metadata, headings, and technical content render', async ({ page }) => {
  await page.goto(articlePath);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('The Blend of Developer Tools into Security Assessments');
  await expect(page.locator('article')).toBeVisible();
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('navigation', { name: 'On this page' })).toBeVisible();
  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByRole('table').getByRole('columnheader')).toHaveCount(7);
  await expect(page.locator('article').getByRole('figure')).toHaveCount(14);
  await expect(page.locator('[data-code-block]')).toHaveCount(3);
  await expect(page.locator('img:not([alt])')).toHaveCount(0);
  await expect(page.locator('article').getByRole('figure').first()).toBeVisible();
  await expect(page.locator('.code-title').first()).toHaveText('postmessage.js');
  await expect(page).toHaveTitle(/The Blend of Developer Tools/);
  const canonicalOrigin = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${canonicalOrigin}/blog/devtools`);
  await expect(page.locator('meta[property="article:published_time"]')).toHaveAttribute('content', '2021-07-07');
});

test('copy preserves source text and screenshot zoom restores focus', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(articlePath);
  await expect(page.getByRole('combobox', { name: 'Color theme' })).toBeEnabled();
  const copy = page.locator('[data-code-block] .code-copy').first();
  await expect(copy).toHaveAccessibleName('Copy code');
  await copy.click();
  await expect(copy).toHaveAccessibleName('Copied');
  const source = await page.locator('[data-code-block] pre code').first().textContent();
  expect(source).toContain('targetWindow.postMessage');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(source);

  const zoom = page.getByRole('button', { name: /Enlarge image/ }).first();
  await zoom.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(zoom).toBeFocused();
});

test('narrow article contains wide code and tables without page overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(articlePath);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  await expect(page.getByRole('link', { name: 'Skip to content' })).toHaveCount(1);
});

test('unknown and draft routes are unavailable', async ({ page }) => {
  const missing = await page.goto('/blog/no-such-post');
  expect(missing?.status()).toBe(404);
  const draft = await page.goto('/blog/reader-draft');
  expect(draft?.status()).toBe(404);
  await page.goto('/blog');
  await expect(page.getByText('Reader draft route fixture')).toHaveCount(0);
});

test('heading links, skip link, and theme control work by keyboard', async ({ page }) => {
  await page.goto(articlePath);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#main-content$/);

  await page.getByRole('link', { name: 'Link to section' }).first().click();
  await expect(page).toHaveURL(/#debug-function$/);
  await page.reload();
  await expect(page).toHaveURL(/#debug-function$/);
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
});

test('phone reader keeps controls usable in dark mode', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(articlePath);
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.locator('.article-toc-inline summary').click();
  await expect(page.locator('.article-toc-inline')).toHaveAttribute('open', '');
  await page.locator('[data-code-block] .code-copy').first().click();
  await expect(page.getByRole('status').first()).toHaveText('Code copied to clipboard');
  const zoom = page.getByRole('button', { name: /Enlarge image/ }).first();
  await zoom.click();
  await page.keyboard.press('Escape');
  await expect(zoom).toBeFocused();
});
