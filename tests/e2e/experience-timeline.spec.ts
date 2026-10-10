import { expect, test } from '@playwright/test';

test('portfolio experience selects one source-backed role without a long page', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/portfolio');
  const timeline = page.getByRole('region', { name: 'Career timeline' });
  const tabs = timeline.getByRole('tablist', { name: 'Companies' });
  await expect(tabs.getByRole('tab')).toHaveCount(5);
  await expect(tabs.getByRole('tab', { name: /Harness/ })).toHaveAttribute('aria-selected', 'true');
  await expect(timeline.getByRole('tabpanel')).toContainText('Senior Product Security Engineer');
  await expect(timeline.getByRole('tabpanel')).toContainText('Architected SoS');
  await expect(timeline.locator('.experience-current-trace')).toBeVisible();
  const headingBox = await page.locator('.portfolio-section-header').boundingBox();
  const timelineBox = await timeline.boundingBox();
  expect(headingBox?.width).toBeGreaterThan(1000);
  expect(timelineBox?.width).toBeGreaterThan(1000);
  await tabs.getByRole('tab', { name: /Kong/ }).click();
  await expect(tabs.getByRole('tab', { name: /Kong/ })).toHaveAttribute('aria-selected', 'true');
  await expect(timeline.getByRole('tabpanel')).toContainText('Senior Security Engineer');
  await expect(timeline.getByRole('tabpanel')).not.toContainText('Architected SoS');
  await expect(timeline.locator('.experience-current-trace')).toHaveCount(0);
  await tabs.getByRole('tab', { name: /Kong/ }).press('ArrowRight');
  await expect(tabs.getByRole('tab', { name: /DeepSource/ })).toBeFocused();
  await expect(tabs.getByRole('tab', { name: /DeepSource/ })).toHaveAttribute('aria-selected', 'true');
  const section = page.locator('.portfolio-section');
  expect((await section.boundingBox())?.height).toBeLessThan(760);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
});

test('compact timeline stays usable on a phone with reduced motion', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of ['/portfolio', '/timeline-component-07']) {
    await page.goto(route);
    expect(await page.evaluate(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)).toBe(true);
    const timeline = page.getByRole('region', { name: 'Career timeline' });
    await expect(timeline.getByRole('tab')).toHaveCount(5);
    await timeline.getByRole('tab', { name: /InVideo/ }).click();
    await expect(timeline.getByRole('tabpanel')).toContainText('Security Engineer');
    await expect(timeline.getByRole('tabpanel')).toHaveCSS('animation-name', 'none');
    await timeline.getByRole('tab', { name: /Harness/ }).click();
    await expect(timeline.locator('.experience-current-trace')).toHaveCSS('animation-name', 'none');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  }
  await context.close();
});
