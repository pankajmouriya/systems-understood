import { Icon } from '@/components/ui/icon';
import type { Metadata } from 'next';
import Link from 'next/link';
import { books, getBookChapters, getPublishedPages } from '@/lib/source';

export const metadata: Metadata = { title: 'Search writing', description: 'Search published writing by Pankaj Mouriya.', robots: { index: false, follow: true } };

type Props = { searchParams: Promise<{ q?: string | string[] }> };

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = (typeof params.q === 'string' ? params.q : '').trim().slice(0, 120);
  const entries = [
    ...getPublishedPages().map((page) => ({ page, type: 'Article', href: `/blog/${page.data.slug}`, context: page.data.tags.join(' ') })),
    ...books.flatMap((book) => getBookChapters(book.slug).map((page) => ({ page, type: 'Book chapter', href: `/books/${book.slug}/${page.data.slug}`, context: book.title }))),
  ];
  const results = query ? (await Promise.all(entries.map(async (entry) => ({ ...entry, text: await entry.page.data.getText('raw') })))).filter(({ page, text, context }) => [page.data.title, page.data.description, context, text].join(' ').toLocaleLowerCase().includes(query.toLocaleLowerCase())) : [];
  return <main id="main-content" className="search-page"><header><p className="eyebrow">The archive / Discovery</p><h1>Search writing</h1><p>Find a topic, tool, or detail in the published archive.</p></header>
    <form action="/search" role="search" className="search-form"><label htmlFor="article-search">Search articles and book chapters</label><div><input id="article-search" type="search" name="q" defaultValue={query} placeholder="Try postMessage or Kubernetes" autoComplete="off" /><button type="submit"><Icon name="search" />Search</button></div></form>
    {query && <section aria-live="polite" aria-label="Search results"><p className="search-count">{results.length} {results.length === 1 ? 'result' : 'results'} for “{query}”</p>{results.length ? <div className="search-results">{results.map(({ page, type, href, context }) => <article key={href}><p className="eyebrow">{type} / {context}</p><h2><Link href={href}>{page.data.title}</Link></h2><p>{page.data.description}</p></article>)}</div> : <div className="search-empty"><h2>No writing found</h2><p>Try a broader term, or <Link href="/blog">browse all writing</Link>.</p></div>}</section>}
  </main>;
}
