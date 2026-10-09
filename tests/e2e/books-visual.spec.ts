import { expect, test } from '@playwright/test';

test('book catalog and reader stay composed at desktop and phone widths', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/books');
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('light');
  await expect(page.getByRole('heading', { level: 1, name: 'Books' })).toBeVisible();
  await page.screenshot({ path: 'docs/review/screenshots/books-desktop-light.png', fullPage: true });
  await page.goto('/books/same-origin-policy/postmessage');
  await expect(page.getByRole('heading', { level: 1, name: /postMessage API/ })).toBeVisible();
  for (const figure of await page.locator('.article-figure .figure-trigger img').all()) {
    await figure.scrollIntoViewIfNeeded();
    await expect.poll(() => figure.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'docs/review/screenshots/book-reader-desktop-light.png', fullPage: true });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/books/kubernetes-101/k8s-master-node');
  await expect(page.locator('.book-mobile-chapters summary')).toBeVisible();
  const firstFigure = page.locator('.article-figure .figure-trigger img').first();
  await firstFigure.scrollIntoViewIfNeeded();
  await expect.poll(() => firstFigure.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: 'docs/review/screenshots/book-reader-phone-light.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('dark');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.screenshot({ path: 'docs/review/screenshots/book-reader-phone-dark.png', fullPage: true });
});
