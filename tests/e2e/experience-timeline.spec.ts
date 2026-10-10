import { expect, test } from '@playwright/test';

test('portfolio experience uses the source-backed numbered timeline', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/portfolio');
  const timeline = page.locator('.timeline-animate');
  await expect(timeline.locator('.timeline-animate-row')).toHaveCount(5);
  await expect(timeline.getByRole('heading', { name: 'Senior Product Security Engineer' })).toBeVisible();
  await expect(timeline.getByText('Harness', { exact: true })).toBeVisible();
  await expect(timeline.getByText('Present', { exact: true })).toBeVisible();
  await expect(timeline.getByText('Architected SoS, a vulnerability management and security posture platform used across Harness and acquired companies.')).toBeVisible();
  await expect(timeline.locator('.timeline-animate-row').last()).toContainText('Appsecco Consulting');
  await page.screenshot({ path: 'docs/review/screenshots/experience-timeline-desktop.png', fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
});

test('timeline demo and portfolio stay readable on a phone with reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of ['/portfolio', '/timeline-component-07']) {
    await page.goto(route);
    expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    const timeline = page.locator('.timeline-animate');
    await expect(timeline.locator('.timeline-animate-row')).toHaveCount(5);
    await expect(timeline.getByText('Kong', { exact: true })).toBeVisible();
    await expect(timeline.locator('.timeline-animate-progress')).toHaveCSS('transform', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
    await page.screenshot({ path: `docs/review/screenshots/${route === '/portfolio' ? 'experience-timeline' : 'timeline-demo'}-phone.png`, fullPage: true });
  }
  await context.close();
});
