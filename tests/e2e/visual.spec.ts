import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('capture article at the review viewports in both themes', async ({ page }) => {
  const viewports = [
    { name: 'phone', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1280 },
    { name: 'wide', width: 1600 },
  ];
  await mkdir('docs/review/screenshots', { recursive: true });
  for (const theme of ['light', 'dark']) {
    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: 900 });
      await page.goto('/blog/devtools');
      await page.getByRole('combobox', { name: 'Color theme' }).selectOption(theme);
      await expect(page.locator('html')).toHaveClass(new RegExp(theme));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
      await page.screenshot({ path: `docs/review/screenshots/article-${viewport.name}-${theme}.png`, fullPage: true });
    }
  }
});
