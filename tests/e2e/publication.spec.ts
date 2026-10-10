import { expect, test } from '@playwright/test';

test('home gives the author and selected writing distinct space', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Pankaj Mouriya');
  await expect(page.getByRole('heading', { name: 'Selected writing' })).toBeVisible();
  const feature = page.locator('[data-featured-writing]');
  await expect(feature.getByRole('link', { name: /The Blend of Developer Tools/ })).toHaveAttribute('href', '/blog/devtools');
  await expect(feature.locator('[data-technical-artifact]')).toBeVisible();
});

test('writing archive is an editorial index with visible article context on phones', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/blog');
  await expect(page.getByRole('heading', { level: 1, name: 'Writing' })).toBeVisible();
  await expect(page.locator('[data-writing-row]')).toHaveCount(7);
  await expect(page.locator('[data-writing-preview]').first()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Guide to Informers, Custom Controller' })).toHaveAttribute('href', '/blog/informer-controllers');
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
