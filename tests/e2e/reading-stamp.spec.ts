import { expect, test } from '@playwright/test';

test('stamp requires time and article end, then persists for that article only', async ({ page }) => {
  await page.clock.install();
  await page.goto('/blog/informer-controllers');
  await page.clock.fastForward(121000);
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'false');
  await page.locator('.reading-end-marker').scrollIntoViewIfNeeded();
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'true');
  await expect(page.getByRole('status')).toContainText('Curiosity looks good on you.');
  await page.reload();
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'true');
  await page.goto('/blog/long-lived-jwt');
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'false');
});

test('reaching the end early does not award, and hidden time does not count', async ({ page }) => {
  await page.clock.install();
  await page.goto('/blog/informer-controllers');
  await page.locator('.reading-end-marker').scrollIntoViewIfNeeded();
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'false');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(180000);
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'false');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(121000);
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'true');
});

test('stamp still works without storage and respects reduced motion on phone', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new Error('Storage blocked'); };
    Storage.prototype.setItem = () => { throw new Error('Storage blocked'); };
  });
  await page.clock.install();
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/blog/informer-controllers');
  await page.locator('.reading-end-marker').scrollIntoViewIfNeeded();
  await page.clock.fastForward(121000);
  await expect(page.locator('.reading-stamp')).toHaveCSS('animation-name', 'none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
});

test('an article end reached in a background tab qualifies after returning', async ({ page }) => {
  await page.clock.install();
  await page.goto('/blog/informer-controllers');
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.locator('.reading-end-marker').scrollIntoViewIfNeeded();
  await page.clock.fastForward(180000);
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'false');
  // Lazy article figures can shift the end after the first scroll. Return with
  // the marker actually in view, as required by this regression scenario.
  await page.locator('.reading-end-marker').scrollIntoViewIfNeeded();
  await expect(page.locator('.reading-end-marker')).toBeInViewport();
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.fastForward(121000);
  await expect(page.locator('.reading-finish')).toHaveAttribute('data-earned', 'true');
});
