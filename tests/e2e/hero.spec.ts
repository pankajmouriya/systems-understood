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
  await expect(page.locator('.profile-lanyard .agent-duel')).toHaveAttribute('data-active', 'false');
  await page.getByRole('button', { name: 'Resume card animation' }).click();
  await expect(page.locator('.profile-lanyard .agent-duel')).toHaveAttribute('data-active', 'true');
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
  await expect(page.locator('.profile-lanyard .agent-duel-pixel')).toBeVisible();
  expect(await page.locator('.profile-lanyard .agent-unit').first().evaluate((node) => getComputedStyle(node).animationName)).toBe('none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('animation study switches art, seeks moments, and replays without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto('/animation-study');
  await expect(page.locator('.agent-duel-pixel')).toBeVisible();
  await page.getByRole('button', { name: 'Illustrated', exact: true }).click();
  await expect(page.locator('.agent-duel-illustrated')).toBeVisible();
  await page.getByRole('button', { name: /^Intercept/ }).click();
  await expect(page.locator('.agent-duel')).toHaveAttribute('data-active', 'false');
  await expect(page.getByRole('button', { name: /^Intercept/ })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Replay', exact: true }).click();
  await expect(page.locator('.agent-duel')).toHaveAttribute('data-active', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('greeting rotates, can pause, and respects reduced motion', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.profile-available')).toHaveText('Available');
  await expect(page.locator('.profile-greeting-current').last()).toHaveText('नमस्ते', { timeout: 6000 });
  await page.getByRole('button', { name: 'Pause greeting animation' }).click();
  await page.waitForTimeout(2700);
  await expect(page.locator('.profile-greeting-current').last()).toHaveText('नमस्ते');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('.profile-greeting-current').last()).toHaveText('Hello');
  await expect(page.getByRole('button', { name: 'Resume greeting animation' })).toHaveCount(0);
});
