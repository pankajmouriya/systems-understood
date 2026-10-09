import { loader } from 'fumadocs-core/source';
import { defineCollections } from 'fumadocs-mdx/macro';
import { z } from 'zod';
import { metadataIssues } from './metadata';
import { publicPosts } from './posts';

const blogPosts = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    date: z.string(),
    updated: z.string().optional(),
    author: z.string().optional(),
    draft: z.boolean(),
    featured: z.boolean().optional(),
    kind: z.enum(['essay', 'tutorial', 'research', 'note']),
    tags: z.array(z.string()),
    series: z.string().nullable().optional(),
    cover: z.string().nullable().optional(),
    canonicalUrl: z.url().nullable().optional(),
    security: z.object({
      advisoryIds: z.array(z.string()).optional(),
      reviewedOn: z.string().optional(),
      status: z.enum(['investigating', 'active', 'fixed', 'historical']).optional(),
    }).optional(),
  }).superRefine((post, context) => {
    for (const message of metadataIssues(post)) {
      context.addIssue({ code: 'custom', message });
    }
  }),
});

export const blog = loader({
  baseUrl: '/blog',
  source: blogPosts.toFumadocsSource(),
});

export function getPublishedPages() {
  const pages = blog.getPages();
  return publicPosts(pages.map((page) => ({
    page,
    slug: page.data.slug,
    date: page.data.date,
    draft: page.data.draft,
  }))).map(({ page }) => page);
}

export function getPublishedPage(slug: string) {
  return getPublishedPages().find((page) => page.data.slug === slug);
}

const bookChapters = defineCollections({
  type: 'doc',
  dir: 'content/books',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    book: z.enum(['same-origin-policy', 'kubernetes-101']),
    order: z.number().int().positive(),
    draft: z.boolean(),
  }),
});

export const bookSource = loader({
  baseUrl: '/books',
  source: bookChapters.toFumadocsSource(),
});

export const books = [
  { slug: 'same-origin-policy', title: 'The Same Origin Policy', category: 'Application security', description: 'An illustrated journey through the browser boundary: origins, tabs, storage, embedded resources, cookies, and postMessage.', audience: 'For security practitioners and curious web developers', source: 'An archive of the guide accompanying the OWASP Bay Area talk.' },
  { slug: 'kubernetes-101', title: 'Kubernetes 101', category: 'Kubernetes', description: 'An illustrated introduction to the control plane, nodes, pods, Services, Deployments, and declarative operation.', audience: 'For engineers building their first mental model of Kubernetes', source: 'An archive of the original Kubernetes learning series.' },
] as const;

export function getBook(slug: string) {
  return books.find((book) => book.slug === slug);
}

export function getBookChapters(slug: string) {
  return bookSource.getPages().filter((page) => !page.data.draft && page.data.book === slug).sort((a, b) => a.data.order - b.data.order);
}

export function getBookChapter(book: string, chapter: string) {
  return getBookChapters(book).find((page) => page.data.slug === chapter);
}
