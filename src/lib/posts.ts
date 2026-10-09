export type PostSummary = {
  slug: string;
  date: string;
  draft: boolean;
};

export function assertUniqueSlugs<T extends PostSummary>(posts: readonly T[]): void {
  const seen = new Set<string>();
  for (const post of posts) {
    if (seen.has(post.slug)) throw new Error(`Duplicate blog slug: ${post.slug}`);
    seen.add(post.slug);
  }
}

export function publicPosts<T extends PostSummary>(posts: readonly T[]): T[] {
  assertUniqueSlugs(posts);
  return posts
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
