import { expect, test } from '@playwright/test';

test('article topic chooses the guardian diagram and leaves reading usable', async ({ page }) => {
  await page.goto('/blog/informer-controllers');
  await expect(page.locator('.article-boundary')).toHaveAttribute('data-topic', 'kubernetes');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Guide to Informers, Custom Controller');
  await expect(page.locator('.boundary-controls')).toContainText('EKS Pod Identity');
  await expect(page.locator('.boundary-controls')).toContainText('RBAC');
  await expect(page.locator('.boundary-threats')).toContainText('Privileged pods');
  await page.getByRole('button', { name: 'Pause security illustration' }).click();
  await expect(page.locator('.boundary-pulse')).toHaveCSS('animation-play-state', 'paused');
  await page.getByRole('button', { name: 'Play security illustration' }).click();
  await expect(page.getByRole('button', { name: 'Replay security illustration' })).toBeVisible({ timeout: 15000 });
  await page.getByRole('button', { name: 'Replay security illustration' }).click();
  await expect(page.locator('.article-boundary')).toHaveAttribute('data-active', 'true');
  await page.locator('.article-prose').scrollIntoViewIfNeeded();
  await expect(page.locator('.article-boundary')).toHaveAttribute('data-active', 'false');
  await page.goto('/blog/long-lived-jwt');
  await expect(page.locator('.article-boundary')).toHaveAttribute('data-topic', 'appsec');
});

test('all five domain diagrams remain readable and still with reduced motion on phone', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/security-study');
  for (const topic of ['kubernetes', 'cloud', 'appsec', 'runtime', 'ai']) {
    const figure = page.locator(`.article-boundary[data-topic="${topic}"]`);
    await figure.scrollIntoViewIfNeeded();
    await expect(figure.locator('.boundary-controls li')).toHaveCount(6);
    await expect(figure.locator('.boundary-threats li')).toHaveCount(4);
    await expect(figure.locator('.boundary-guardian')).toBeVisible();
    await expect(figure.locator('.boundary-pulse')).toHaveCSS('animation-name', 'none');
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
  await page.goto('/blog/informer-controllers');
  await expect(page.locator('.article-boundary')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(375);
});
