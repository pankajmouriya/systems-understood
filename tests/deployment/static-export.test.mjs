import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');

test('Next.js is configured for a static Cloudflare Pages export', async () => {
  const config = await read('next.config.mjs');

  assert.match(config, /output:\s*['"]export['"]/);
  assert.match(config, /images:\s*\{[\s\S]*unoptimized:\s*true/);
  assert.doesNotMatch(config, /async\s+redirects\s*\(/);
});

test('metadata and feed routes are emitted at build time', async () => {
  for (const path of ['src/app/rss.xml/route.ts', 'src/app/search-index.json/route.ts', 'src/app/robots.ts', 'src/app/sitemap.ts']) {
    const route = await read(path);
    assert.match(route, /export\s+const\s+dynamic\s*=\s*['"]force-static['"]/, `${path} must be force-static`);
  }
});

test('the export verifier covers public acceptance artifacts', async () => {
  const verifier = await read('scripts/verify-static-export.mjs');

  for (const path of ['index.html', 'blog/index.html', 'books/index.html', 'rss.xml', 'search-index.json', '_redirects', '_headers']) {
    assert.ok(verifier.includes(path), `export verifier must require ${path}`);
  }
});

test('Cloudflare redirects preserve every legacy route and app alias', async () => {
  const redirects = await read('public/_redirects');
  const legacyRoutes = JSON.parse(await read('docs/migration/legacy-route-map.json'));

  for (const { old_url: source, new_url: destination } of legacyRoutes) {
    assert.match(redirects, new RegExp(`^${source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+${destination.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+308$`, 'm'));
  }

  for (const rule of [
    '/docs/sop /books/same-origin-policy 308',
    '/docs/Kubernetes/Kubernetes101 /books/kubernetes-101 308',
    '/resume /portfolio/resume 308',
    '/search / 302',
  ]) {
    assert.ok(redirects.includes(rule), `missing redirect: ${rule}`);
  }
});

test('Cloudflare applies baseline browser security headers', async () => {
  const headers = await read('public/_headers');
  assert.match(headers, /^\/\*$\n/m);
  assert.match(headers, /X-Content-Type-Options:\s*nosniff/i);
  assert.match(headers, /Referrer-Policy:\s*strict-origin-when-cross-origin/i);
  assert.match(headers, /Permissions-Policy:/i);
  assert.match(headers, /X-Frame-Options:\s*DENY/i);
});
