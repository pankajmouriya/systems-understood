import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { books, getBook, getBookChapters } from '@/lib/source';

type Props = { params: Promise<{ bookSlug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return books.map((book) => ({ bookSlug: book.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug } = await params;
  const book = getBook(bookSlug);
  if (!book) notFound();
  return { title: book.title, description: book.description, alternates: { canonical: `/books/${book.slug}` } };
}

export default async function BookPage({ params }: Props) {
  const { bookSlug } = await params;
  const book = getBook(bookSlug);
  if (!book) notFound();
  const chapters = getBookChapters(bookSlug);
  return <main id="main-content" className="book-page">
    <nav className="book-breadcrumb" aria-label="Breadcrumb"><Link href="/books">Books</Link><span aria-hidden="true">/</span><span>{book.title}</span></nav>
    <header className="book-cover"><div><p className="eyebrow">{book.category} / An illustrated guide</p><h1>{book.title}<span>.</span></h1><p>{book.description}</p><Link className="text-action" href={`/books/${bookSlug}/${chapters[0].data.slug}`}>Start reading ↗</Link></div><aside><span>WEB EDITION</span><strong>{String(chapters.length).padStart(2, '0')}</strong><span>CHAPTERS</span></aside></header>
    <div className="book-context"><p>{book.audience}</p><p>{book.source} This is a historical edition; verify technical details against current documentation.</p></div>
    <section className="book-contents" aria-labelledby="book-contents-title"><div><p className="eyebrow">Reading path</p><h2 id="book-contents-title">Contents</h2></div><ol>{chapters.map((chapter, index) => <li key={chapter.data.slug}><Link href={`/books/${bookSlug}/${chapter.data.slug}`}><span>{String(index + 1).padStart(2, '0')}</span><strong>{chapter.data.title}</strong><span aria-hidden="true">↗</span></Link></li>)}</ol></section>
  </main>;
}
