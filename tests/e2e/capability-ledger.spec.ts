import { expect, test } from '@playwright/test';

test('portfolio presents six evidence-backed security capabilities', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/portfolio');
  const skills = page.getByRole('region', { name: "Where I’m good" });
  await expect(skills.getByRole('heading', { name: "Where I’m good" })).toBeVisible();
  await expect(skills.getByRole('listitem')).toHaveCount(6);
  for (const capability of ['Product security', 'Vulnerability management', 'Application security', 'Cloud & Kubernetes security', 'Software supply chain security', 'Security automation & AI triage']) {
    await expect(skills.getByRole('heading', { name: capability })).toBeVisible();
  }
  await expect(skills).toContainText('Built security scanning and governance workflows across CI pipelines.');
  await skills.scrollIntoViewIfNeeded();
  await expect(skills.locator('.capability-ledger')).toHaveAttribute('data-active', 'true');
  await expect(skills.locator('.capability-route:visible .capability-signal')).not.toHaveCSS('animation-name', 'none');
});

test('capability ledger stays still and readable on a reduced-motion phone', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, colorScheme: 'dark', reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('/portfolio');
  const skills = page.getByRole('region', { name: "Where I’m good" });
  await expect(skills.getByRole('listitem')).toHaveCount(6);
  await expect(skills.locator('.capability-route:visible .capability-signal')).toHaveCSS('animation-name', 'none');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
  await context.close();
});
