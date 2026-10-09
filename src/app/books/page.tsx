import { Icon } from '@/components/ui/icon';
import type { Metadata } from 'next';
import Link from 'next/link';
import { books, getBookChapters } from '@/lib/source';

export const metadata: Metadata = { title: 'Books', description: 'Illustrated web guides on browser security and Kubernetes by Pankaj Mouriya.', alternates: { canonical: '/books' } };

export default function BooksPage() {
  return <main id="main-content" className="books-page">
    <header className="books-intro"><p className="eyebrow">The longer view / 02 guides</p><h1>Books<span>.</span></h1><p>Some ideas need more than one article. Follow these illustrated guides chapter by chapter.</p></header>
    <div className="book-catalog">{books.map((book, index) => <article key={book.slug} className="book-catalog-card"><div><p className="eyebrow">{String(index + 1).padStart(2, '0')} / {book.category}</p><h2><Link href={`/books/${book.slug}`}>{book.title}</Link></h2><p>{book.description}</p></div><div><Icon name={book.slug === "kubernetes-101" ? "cube" : "shield"} /><span>{getBookChapters(book.slug).length} chapters · Web edition</span><Link className="text-action" href={`/books/${book.slug}`}>Explore the book <Icon name="arrow" /></Link></div></article>)}</div>
  </main>;
}
