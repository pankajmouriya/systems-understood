import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleLayout } from '@/components/articles/ArticleLayout';
import { Callout } from '@/components/articles/Callout';
import { mdxComponents } from '@/components/mdx';
import { books, getBook, getBookChapter, getBookChapters } from '@/lib/source';

type Props = { params: Promise<{ bookSlug: string; chapterSlug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return books.flatMap((book) => getBookChapters(book.slug).map((chapter) => ({ bookSlug: book.slug, chapterSlug: chapter.data.slug })));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookSlug, chapterSlug } = await params;
  const chapter = getBookChapter(bookSlug, chapterSlug);
  if (!chapter) notFound();
  return { title: `${chapter.data.title} — ${getBook(bookSlug)?.title}`, description: chapter.data.description, alternates: { canonical: `/books/${bookSlug}/${chapterSlug}` } };
}

export default async function ChapterPage({ params }: Props) {
  const { bookSlug, chapterSlug } = await params;
  const book = getBook(bookSlug);
  const chapters = getBookChapters(bookSlug);
  const index = chapters.findIndex((chapter) => chapter.data.slug === chapterSlug);
  if (!book || index < 0) notFound();
  const chapter = chapters[index];
  const Body = chapter.data.body;
  const previous = chapters[index - 1];
  const next = chapters[index + 1];
  return <main id="main-content" className="book-reader">
    <nav className="book-breadcrumb" aria-label="Breadcrumb"><Link href="/books">Books</Link><span aria-hidden="true">/</span><Link href={`/books/${bookSlug}`}>{book.title}</Link><span aria-hidden="true">/</span><span>{chapter.data.title}</span></nav>
    <div className="book-reader-grid"><aside className="book-chapter-rail" aria-label="Book chapters"><Link href={`/books/${bookSlug}`} className="book-rail-title">{book.title}</Link><ol>{chapters.map((item, chapterIndex) => <li key={item.data.slug}><Link href={`/books/${bookSlug}/${item.data.slug}`} aria-current={chapterIndex === index ? 'page' : undefined}><span>{String(chapterIndex + 1).padStart(2, '0')}</span>{item.data.title}</Link></li>)}</ol></aside>
      <div className="book-reader-main"><header className="book-chapter-header"><p className="eyebrow">{book.title} / Chapter {String(index + 1).padStart(2, '0')} of {String(chapters.length).padStart(2, '0')}</p><h1>{chapter.data.title}</h1><p>{chapter.data.description}</p></header><details className="book-mobile-chapters"><summary>All chapters <span>↘</span></summary><ol>{chapters.map((item, chapterIndex) => <li key={item.data.slug}><Link href={`/books/${bookSlug}/${item.data.slug}`} aria-current={chapterIndex === index ? 'page' : undefined}>{String(chapterIndex + 1).padStart(2, '0')} / {item.data.title}</Link></li>)}</ol></details><ArticleLayout toc={chapter.data.toc}><Callout type="note" title="Historical edition">This guide preserves its original explanations and figures. Some tools, terminology, and behavior may have changed; check current documentation before applying the details.</Callout><Body components={mdxComponents} /></ArticleLayout><nav className="book-pagination" aria-label="Chapter navigation"><div>{previous && <Link href={`/books/${bookSlug}/${previous.data.slug}`}><span>← Previous chapter</span><strong>{previous.data.title}</strong></Link>}</div><div>{next ? <Link href={`/books/${bookSlug}/${next.data.slug}`}><span>Next chapter →</span><strong>{next.data.title}</strong></Link> : <Link href={`/books/${bookSlug}`}><span>End of guide →</span><strong>Back to contents</strong></Link>}</div></nav></div>
    </div>
  </main>;
}
