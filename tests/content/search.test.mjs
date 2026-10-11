import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { searchIndex } from '../../src/lib/search-client.ts';

const index = [
  { type: 'Article', href: '/description', context: 'Cloud', title: 'Unrelated', description: 'Kubernetes details', body: '' },
  { type: 'Article', href: '/title', context: 'Application security', title: 'Kubernetes admission', description: '', body: '' },
  { type: 'Book chapter', href: '/context', context: 'Kubernetes 101', title: 'Pods', description: '', body: '' },
  { type: 'Article', href: '/body', context: 'Runtime', title: 'Signals', description: '', body: 'Kubernetes audit event' },
];

test('search ranks title, context, description, then body', () => {
  assert.deepEqual(searchIndex(index, 'kubernetes').map(({ href }) => href), [
    '/title',
    '/context',
    '/description',
    '/body',
  ]);
});

test('search trims and bounds the query', () => {
  assert.deepEqual(searchIndex(index, '  pods  ').map(({ href }) => href), ['/context']);
  assert.deepEqual(searchIndex(index, ''), []);
});

test('search index route is static and the request-time API is removed', async () => {
  const route = await readFile(new URL('../../src/app/search-index.json/route.ts', import.meta.url), 'utf8');
  assert.match(route, /dynamic\s*=\s*['"]force-static['"]/);
  await assert.rejects(() => readFile(new URL('../../src/app/api/search/route.ts', import.meta.url), 'utf8'), /ENOENT/);
});
