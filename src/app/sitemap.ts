import type { MetadataRoute } from 'next';
import { books, getBookChapters, getPublishedPages } from '@/lib/source';
import { siteOrigin } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const paths = ['/', '/about', '/blog', '/books', '/portfolio', '/portfolio/projects', '/portfolio/talks', '/resume', ...books.map((book) => `/books/${book.slug}`)];
  return [
    ...paths.map((path) => ({ url: new URL(path, origin).toString(), changeFrequency: 'monthly' as const, priority: path === '/' ? 1 : .7 })),
    ...getPublishedPages().map((post) => ({ url: new URL(`/blog/${post.data.slug}`, origin).toString(), lastModified: post.data.updated ?? post.data.date, changeFrequency: 'yearly' as const, priority: .8 })),
    ...books.flatMap((book) => getBookChapters(book.slug).map((chapter) => ({ url: new URL(`/books/${book.slug}/${chapter.data.slug}`, origin).toString(), changeFrequency: 'yearly' as const, priority: .6 }))),
  ];
}
