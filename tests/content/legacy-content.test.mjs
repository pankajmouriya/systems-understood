import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const root = new URL('../../', import.meta.url).pathname;
const routes = JSON.parse(readFileSync(resolve(root, 'docs/migration/legacy-route-map.json'), 'utf8'));

test('migrated chapters and articles have unique routes and all local figures', () => {
  const migrated = routes.filter((route) => route.status === 'migrated');
  assert.equal(migrated.length, 27);
  assert.equal(new Set(routes.map((route) => route.old_url)).size, routes.length);
  assert.equal(new Set(migrated.map((route) => route.new_url)).size, migrated.length);
  for (const route of migrated) {
    const target = route.new_url.startsWith('/blog/')
      ? resolve(root, 'content/blog', `${route.new_url.split('/').at(-1)}.mdx`)
      : resolve(root, 'content/books', route.new_url.split('/')[2], `${route.new_url.split('/').at(-1)}.mdx`);
    assert.ok(existsSync(target), `missing content: ${target}`);
    const body = readFileSync(target, 'utf8');
    const figures = [...body.matchAll(/<Figure src="([^"]+)"/g)];
    assert.equal(figures.length, route.images, `figure count changed: ${target}`);
    for (const [, image] of figures) assert.ok(existsSync(resolve(root, 'public', image.slice(1))), `missing figure: ${image}`);
    assert.doesNotMatch(body, /<script src="https:\/\/gist\.github\.com/, `executable gist embed in ${target}`);
  }
});

test('book chapter order is complete and contiguous', () => {
  for (const [slug, expected] of [['same-origin-policy', 14], ['kubernetes-101', 7]]) {
    const chapters = routes.filter((route) => route.status === 'migrated' && route.new_url.startsWith(`/books/${slug}/`));
    assert.equal(chapters.length, expected);
    const positions = chapters.map((route) => {
      const path = resolve(root, 'content/books', slug, `${route.new_url.split('/').at(-1)}.mdx`);
      return Number(readFileSync(path, 'utf8').match(/^order: (\d+)/m)?.[1]);
    }).sort((a, b) => a - b);
    assert.deepEqual(positions, Array.from({ length: expected }, (_, i) => i + 1));
  }
});
