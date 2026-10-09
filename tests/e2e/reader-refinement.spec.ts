import { expect, test } from '@playwright/test';

test('technical reader has room for prose and figures at desktop and phone widths', async ({ page }) => {
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog/informer-controllers');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guide to Informers, Custom Controller');
    if (width === 1280) {
      const prose = await page.locator('.article-prose').boundingBox();
      expect(prose?.width).toBeGreaterThan(880);
      const header = await page.locator('.article-header').boundingBox();
      expect(Math.abs((header?.x ?? 0) - (prose?.x ?? 0))).toBeLessThan(2);
      await page.getByRole('navigation', { name: 'On this page' }).getByRole('link', { name: 'Kubernetes Custom Controllers' }).click();
      await expect(page).toHaveURL(/#kubernetes-custom-controllers$/);
    } else {
      await page.locator('.article-toc-inline summary').click();
      await expect(page.locator('.article-toc-inline').getByRole('link', { name: 'And now the Informers' })).toBeVisible();
      await page.locator('.article-toc-inline summary').click();
    }
    for (const figure of await page.locator('.figure-trigger img').all()) {
      await figure.scrollIntoViewIfNeeded();
      await expect.poll(() => figure.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
    for (const theme of ['light', 'dark']) {
      await page.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
      await expect(page.locator('html')).toHaveClass(new RegExp(theme));
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
      await page.screenshot({ path: `docs/review/screenshots/informers-${width}-${theme}.png`, fullPage: true });
      await page.screenshot({ path: `docs/review/screenshots/informers-opening-${width}-${theme}.png` });
      await page.locator('.article-prose > p').first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: `docs/review/screenshots/informers-prose-${width}-${theme}.png` });
    }
  }
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/books/same-origin-policy/postmessage');
  const chapter = await page.locator('.article-prose').boundingBox();
  expect(chapter?.width).toBeGreaterThan(850);
  await expect(page.locator('.article-toc-inline summary')).toBeVisible();
});
