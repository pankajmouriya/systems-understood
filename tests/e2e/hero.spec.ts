import { expect, test } from '@playwright/test';

test('homepage portrait loads, can pause, and leaves primary links usable', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.profile-lanyard')).toHaveAttribute('data-ready', 'true', { timeout: 30000 });
  // Let the initial gravity-driven swing settle before grabbing its center.
  await page.waitForTimeout(6000);
  const canvas = page.locator('.profile-canvas canvas');
  const bounds = (await canvas.boundingBox())!;
  await page.mouse.move(bounds.x + bounds.width * .5, bounds.y + bounds.height * .65);
  await page.mouse.down();
  await expect.poll(() => canvas.evaluate((node) => node.hasPointerCapture(1))).toBe(true);
  await page.mouse.move(bounds.x + bounds.width * .7, bounds.y + bounds.height * .4, { steps: 10 });
  await page.mouse.up();
  await page.getByRole('button', { name: 'Pause card animation' }).click();
  await expect(page.getByRole('button', { name: 'Resume card animation' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Download CV' })).toHaveAttribute('href', '/Pankaj-Mouriya-Resume.pdf');
  await page.getByRole('link', { name: 'Read the writing', exact: true }).click();
  await expect(page).toHaveURL(/\/blog$/);
});

test('portrait remains available with reduced motion on a phone', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/');
  await expect(page.locator('.profile-photo img')).toBeVisible();
  await expect(page.locator('.profile-canvas')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
