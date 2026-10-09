import { mkdir } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

test('capture publication and portfolio at phone and desktop sizes', async ({ page }) => {
  await mkdir('docs/review/screenshots', { recursive: true });
  const routes = [['home', '/'], ['writing', '/blog'], ['portfolio', '/portfolio'], ['resume', '/resume'], ['projects', '/portfolio/projects'], ['talks', '/portfolio/talks'], ['search', '/search']] as const;
  for (const theme of ['light', 'dark']) {
    for (const viewport of [{ name: 'phone', width: 375 }, { name: 'desktop', width: 1280 }]) {
      await page.setViewportSize({ width: viewport.width, height: 900 });
      for (const [name, route] of routes) {
        await page.goto(route);
        await page.evaluate((choice) => localStorage.setItem('theme', choice), theme);
        await page.reload();
        await expect(page.locator('html')).toHaveClass(new RegExp(theme));
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(viewport.width);
        if (name === 'home') {
          const title = await page.locator('[data-featured-writing] h3').boundingBox();
          expect(title?.y).toBeLessThan(viewport.name === 'phone' ? 812 : 900);
        }
        await page.screenshot({ path: `docs/review/screenshots/${name}-${viewport.name}-${theme}.png`, fullPage: true });
      }
    }
  }
});

test('mobile menu opens, navigates, and restores page interaction', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  await page.getByRole('button', { name: /Menu/ }).click();
  const mobile = page.getByRole('navigation', { name: 'Mobile navigation' });
  await expect(mobile).toBeVisible();
  await mobile.getByRole('link', { name: 'Portfolio' }).click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.getByRole('button', { name: /Menu/ })).toBeVisible();
});
