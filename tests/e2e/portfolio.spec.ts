import { expect, test } from '@playwright/test';

test('site navigation presents the author and reaches portfolio and public profiles', async ({ page }) => {
  await page.goto('/');
  const header = page.getByRole('banner');
  await expect(header.getByRole('link', { name: 'Pankaj Mouriya, home' })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Writing' })).toHaveAttribute('href', '/blog');
  await expect(header.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '/portfolio');
  await expect(header.getByRole('link', { name: 'Résumé' })).toHaveAttribute('href', '/resume');
  await expect(header.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/pankajmouriya');
  await expect(header.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/pankajmouriya/');
});

test('portfolio routes show experience, a maintained project, and talks', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { level: 1, name: /Building security/ })).toBeVisible();
  await expect(page.getByText('Harness', { exact: true })).toBeVisible();
  await expect(page.getByText('Kong', { exact: true })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Portfolio sections' }).getByRole('link', { name: 'Experience' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'Projects', exact: true }).first().click();
  await expect(page).toHaveURL(/\/portfolio\/projects$/);
  await expect(page.getByRole('navigation', { name: 'Portfolio sections' }).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'The Security Diff' })).toBeVisible();
  await page.getByRole('link', { name: 'Talks', exact: true }).first().click();
  await expect(page).toHaveURL(/\/portfolio\/talks$/);
  await expect(page.getByText('BSides Goa 2024')).toBeVisible();
});
