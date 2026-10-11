import { expect, test } from '@playwright/test';

test('about page combines biography, portrait, and an interactive profile card', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/about');

  await expect(page.getByRole('heading', { level: 1, name: 'Security is how I understand systems.' })).toBeVisible();
  await expect(page.getByRole('img', { name: 'Pankaj Mouriya outdoors' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'About Me', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('.about-facts > div')).toHaveText(['5roles', '9talks', '2guides']);
  await expect(page.getByRole('link', { name: '9 talks' })).toHaveAttribute('href', '/portfolio/talks');

  const profileCard = page.getByRole('button', { name: 'Flip profile card' });
  await expect(profileCard).toHaveAttribute('aria-pressed', 'false');
  await profileCard.press('Enter');
  await expect(profileCard).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('profile-card-back')).toHaveAttribute('aria-hidden', 'false');
  await profileCard.press('Enter');
  await expect(profileCard).toHaveAttribute('aria-pressed', 'false');

  await expect(page.getByText('$1,900')).toHaveCount(0);
  await expect(page.getByText('Zolt Mercer')).toHaveCount(0);
});

test('about page is readable on a reduced-motion phone', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/about');

  await expect(page.getByRole('heading', { level: 1, name: 'Security is how I understand systems.' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Flip profile card' })).toBeVisible();
  await page.getByRole('button', { name: 'Menu' }).click();
  await expect(page.getByRole('navigation', { name: 'Mobile navigation' }).getByRole('link', { name: 'About Me' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
