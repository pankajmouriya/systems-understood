import { expect, test } from '@playwright/test';

test('home gives the author and selected writing distinct space', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pankaj Mouriya');
  await expect(page.getByRole('heading', { name: 'Selected writing' })).toBeVisible();
  const feature = page.locator('[data-featured-writing]');
  await expect(feature.getByRole('link', { name: /The Blend of Developer Tools/ })).toHaveAttribute('href', '/blog/devtools');
  await expect(feature.locator('[data-technical-artifact]')).toBeVisible();
  await expect(page.locator('.home-more-writing [data-writing-row]')).toHaveCount(3);
});

test('home keeps one hero divider and continues from open work into experience', async ({ page }) => {
  await page.goto('/');

  const skills = page.locator('.profile-skills');
  const archive = page.locator('.home-feature-section');
  await expect(skills).toHaveCSS('border-bottom-style', 'solid');
  await expect(archive).toHaveCSS('border-top-width', '0px');

  const work = page.locator('.home-work');
  const experience = page.locator('.home-experience');
  await expect(experience.getByRole('heading', { name: 'Where I’ve worked' })).toBeVisible();
  const timeline = experience.getByRole('region', { name: 'Career timeline' });
  await expect(timeline.getByRole('tab')).toHaveCount(5);
  await timeline.getByRole('tab', { name: /Kong/ }).click();
  await expect(timeline.getByRole('tabpanel')).toContainText('Senior Security Engineer');
  const workBox = await work.boundingBox();
  const experienceBox = await experience.boundingBox();
  expect(experienceBox?.y).toBeGreaterThan((workBox?.y ?? 0) + (workBox?.height ?? 0) - 1);
});

test('home typography gives identity and editorial headings one display voice', async ({ page }) => {
  await page.goto('/');

  const families = await page.evaluate(() => ({
    hero: getComputedStyle(document.querySelector('.profile-hero h1')!).fontFamily,
    section: getComputedStyle(document.querySelector('.section-heading h2')!).fontFamily,
    body: getComputedStyle(document.querySelector('.profile-description')!).fontFamily,
  }));

  expect(families.hero).toBe(families.section);
  expect(families.hero).not.toBe(families.body);
});

test('a first visit starts in light mode and keeps a chosen theme', async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto('/');

  await expect(page.locator('html')).toHaveClass(/light/);
  await expect(page.getByRole('combobox', { name: 'Color theme' })).toHaveValue('light');
  await page.getByRole('combobox', { name: 'Color theme' }).selectOption('dark');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('combobox', { name: 'Color theme' })).toHaveValue('dark');
  await context.close();
});

test('writing archive has selected paths and a compact complete index on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/blog');
  await expect(page.getByRole('heading', { level: 1, name: 'Writing' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Selected paths' })).toBeVisible();
  await expect(page.locator('.writing-feature-art')).toBeVisible();
  await expect(page.locator('[data-writing-row]')).toHaveCount(7);
  await expect(page.locator('.writing-archive').getByRole('link', { name: 'Guide to Informers, Custom Controller' })).toHaveAttribute('href', '/blog/informer-controllers');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('books offer ordered chapters and mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/books/kubernetes-101');
  await expect(page.getByRole('heading', { level: 1, name: 'Kubernetes 101' })).toBeVisible();
  await expect(page.locator('.book-contents li')).toHaveCount(7);
  await page.getByRole('link', { name: 'Start reading' }).click();
  await expect(page).toHaveURL(/\/books\/kubernetes-101\/overview$/);
  await expect(page.locator('.book-mobile-chapters summary')).toBeVisible();
  await page.locator('.book-mobile-chapters summary').click();
  await expect(page.locator('.book-mobile-chapters a[aria-current="page"]')).toContainText('Overview');
  await page.getByRole('navigation', { name: 'Chapter navigation' }).getByRole('link', { name: /Next chapter/ }).click();
  await expect(page).toHaveURL(/\/books\/kubernetes-101\/k8s-master-node$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});

test('application security writing and chapters are both searchable', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Search/ }).click();
  const dialog = page.getByRole('dialog', { name: 'Search writing' });
  await dialog.getByRole('combobox').fill('postMessage');
  await expect(dialog.getByText('postMessage API Implementation and limitations', { exact: true })).toBeVisible();
  await expect(dialog.getByText('The Blend of Developer Tools into Security Assessments')).toBeVisible();
  await dialog.getByRole('combobox').press('Enter');
  await expect(page).toHaveURL(/\/books\/same-origin-policy\/postmessage$/);
});
