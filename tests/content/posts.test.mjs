import assert from 'node:assert/strict';
import test from 'node:test';
import { assertUniqueSlugs, publicPosts } from '../../src/lib/posts.ts';

const article = (slug, date, draft = false) => ({
  slug,
  date,
  draft,
  title: slug,
});

test('duplicate public slugs fail before routes are generated', () => {
  assert.throws(
    () => assertUniqueSlugs([article('repeat', '2026-10-10'), article('repeat', '2026-10-09')]),
    /Duplicate blog slug: repeat/,
  );
});

test('drafts are excluded and published articles are newest first', () => {
  const posts = publicPosts([
    article('older', '2026-08-01'),
    article('private', '2026-10-09', true),
    article('newer', '2026-10-01'),
  ]);
  assert.deepEqual(posts.map((post) => post.slug), ['newer', 'older']);
});

test('a draft cannot hide a duplicate published slug', () => {
  assert.throws(
    () => publicPosts([article('same', '2026-10-10'), article('same', '2026-10-09', true)]),
    /Duplicate blog slug: same/,
  );
});
