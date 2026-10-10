import { expect, test } from '@playwright/test';

test('site navigation presents the author and reaches portfolio and public profiles', async ({ page }) => {
  await page.goto('/');
  const header = page.getByRole('banner');
  await expect(header.getByRole('link', { name: 'Pankaj Mouriya, home' })).toBeVisible();
  await expect(header.getByRole('link', { name: 'Writing' })).toHaveAttribute('href', '/blog');
  await expect(header.getByRole('link', { name: 'Portfolio' })).toHaveAttribute('href', '/portfolio');
  await expect(header.getByRole('link', { name: 'Résumé' })).toHaveCount(0);
  await expect(header.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/pankajmouriya');
  await expect(header.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/pankajmouriya/');
});

test('footer closes the page with useful publication and portfolio paths', async ({ page }) => {
  await page.goto('/blog');
  const footer = page.getByRole('contentinfo');
  await expect(footer.getByRole('heading', { name: /There is always more to understand/ })).toBeVisible();
  await expect(footer.getByRole('link', { name: 'Explore the writing' })).toHaveAttribute('href', '/blog');
  await expect(footer.getByRole('link', { name: 'Books' })).toHaveAttribute('href', '/books');
  await expect(footer.getByRole('link', { name: 'Talks & conferences' })).toHaveAttribute('href', '/portfolio/talks');
  await expect(footer.getByRole('link', { name: 'RSS feed' })).toHaveAttribute('href', '/rss.xml');
  await expect(footer.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/pankajmouriya');
  await footer.getByRole('link', { name: 'Back to top' }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test('portfolio routes show experience, a maintained project, and talks', async ({ page }) => {
  await page.goto('/portfolio');
  await expect(page.getByRole('heading', { level: 1, name: /Building security/ })).toBeVisible();
  const companies = page.getByRole('tablist', { name: 'Companies' });
  await expect(companies.getByRole('tab', { name: /Harness/ })).toBeVisible();
  await expect(companies.getByRole('tab', { name: /Kong/ })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Portfolio sections' }).getByRole('link', { name: 'Experience' })).toHaveAttribute('aria-current', 'page');
  await page.getByRole('link', { name: 'Projects', exact: true }).first().click();
  await expect(page).toHaveURL(/\/portfolio\/projects$/);
  await expect(page.getByRole('navigation', { name: 'Portfolio sections' }).getByRole('link', { name: 'Projects' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('heading', { name: 'The Security Diff' })).toBeVisible();
  await page.getByRole('link', { name: 'Talks', exact: true }).first().click();
  await expect(page).toHaveURL(/\/portfolio\/talks$/);
  await expect(page.getByText('BSides Goa 2024')).toBeVisible();
});

test('résumé is a source-backed portfolio section with a downloadable document', async ({ page }) => {
  await page.goto('/portfolio/resume');

  await expect(page.getByRole('heading', { level: 1, name: 'Résumé.' })).toBeVisible();
  await expect(page.getByRole('navigation', { name: 'Portfolio sections' }).getByRole('link', { name: 'Résumé' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByRole('link', { name: /Download PDF/ })).toHaveAttribute('href', '/Pankaj-Mouriya-Resume.pdf');
  await expect(page.getByRole('heading', { name: 'Career record' })).toBeVisible();
  await expect(page.locator('.portfolio-resume-role')).toHaveCount(5);
  await expect(page.getByText('Architected SoS, a vulnerability management and security posture platform used across Harness and acquired companies.')).toBeVisible();
  await expect(page.getByText('Certified Kubernetes Administrator (CKA)')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(1280);
});
