import { Icon } from '@/components/ui/icon';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getPublishedPages } from '@/lib/source';

export const metadata: Metadata = { title: 'Writing', description: 'Articles, research, and notes on software systems and security by Pankaj Mouriya.', alternates: { canonical: '/blog' } };

export default function BlogPage() {
  const posts = getPublishedPages();
  return <main id="main-content" className="writing-page">
    <header className="writing-intro"><p className="eyebrow">The archive / {String(posts.length).padStart(2, '0')} published</p><h1>Writing<span aria-hidden="true">.</span></h1><p>Practical investigations, technical field notes, and the details behind software and security work.</p></header>
    <div className="writing-index-header"><span>Index</span><span>Stories worth opening up</span></div>
    <div className="writing-index">{posts.map((post, index) => <article className="writing-row" data-writing-row key={post.data.slug}><div className="writing-row-number">{String(index + 1).padStart(2, '0')} <span>/ {new Date(`${post.data.date}T00:00:00Z`).getUTCFullYear()}</span></div><div className="writing-row-main"><p className="eyebrow">{post.data.kind} <span aria-hidden="true">/</span> {post.data.tags.map((tag: string) => tag.replaceAll('-', ' ')).join(', ')}</p><h2><Link href={`/blog/${post.data.slug}`}>{post.data.title}</Link></h2><p>{post.data.description}</p><span className="writing-row-date"><time dateTime={post.data.date}>{post.data.date}</time> <span aria-hidden="true">↗</span></span></div><div className="writing-preview" data-topic={post.data.tags.includes('containers-kubernetes') ? 'infrastructure' : 'security'} data-writing-preview aria-label="Article preview"><Icon name={post.data.tags.includes('containers-kubernetes') ? 'cube' : 'shield'} /><span>{post.data.tags.includes('containers-kubernetes') ? 'KUBERNETES FIELD NOTE' : 'APPLICATION SECURITY FIELD NOTE'}</span><p>{post.data.description}</p><Link href={`/blog/${post.data.slug}`}>Open the article <Icon name="arrow" /></Link></div></article>)}</div>
    <p className="archive-note">Explore the longer, chapter-by-chapter guides in <Link href="/books">Books ↗</Link>.</p>
  </main>;
}
