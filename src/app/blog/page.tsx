import type { Metadata } from 'next';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { ArticleIndexRow } from '@/components/writing/ArticleIndexRow';
import { getPublishedPages } from '@/lib/source';

export const metadata: Metadata = { title: 'Writing', description: 'Articles, research, and notes on software systems and security by Pankaj Mouriya.', alternates: { canonical: '/blog' } };

const featuredSlugs = ['informer-controllers', 'devtools', 'long-lived-jwt'];

export default function BlogPage() {
  const posts = getPublishedPages();
  const featured = featuredSlugs.flatMap((slug) => {
    const post = posts.find((item) => item.data.slug === slug);
    return post ? [post] : [];
  });

  return <main id="main-content" className="writing-page">
    <header className="writing-intro"><p className="eyebrow">The archive / {String(posts.length).padStart(2, '0')} published</p><h1>Writing<span aria-hidden="true">.</span></h1><p>Field notes on software systems, security boundaries, and the details that explain how things work.</p></header>

    <section className="writing-featured" aria-labelledby="writing-featured-title">
      <div className="writing-section-heading"><div><p className="eyebrow">Start here</p><h2 id="writing-featured-title">Selected paths</h2></div><span>Three ways into the archive</span></div>
      <div className="writing-featured-grid">
        <div className="writing-featured-list">{featured.map((post, index) => <article key={post.data.slug}>
          <span className="writing-featured-number">0{index + 1}</span>
          <div><p>{post.data.kind} <span aria-hidden="true">/</span> {post.data.tags.includes('containers-kubernetes') ? 'Kubernetes' : 'Application security'}</p><h3><Link href={`/blog/${post.data.slug}`}>{post.data.title}</Link></h3></div>
          <Icon name="arrow" />
        </article>)}</div>
        <div className="writing-feature-art" aria-hidden="true">
          <div className="writing-feature-art-header"><span>FIELD MAP / 003</span><span>SYSTEMS &amp; BOUNDARIES</span></div>
          <div className="writing-feature-art-canvas">
            <svg viewBox="0 0 520 280" preserveAspectRatio="xMidYMid meet" fill="none"><path d="M97 142H225M290 142H416M260 112V55M260 170v56" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 7" /><circle cx="260" cy="142" r="33" stroke="currentColor" strokeWidth="1.5" /><circle cx="260" cy="142" r="13" fill="currentColor" /><circle cx="75" cy="142" r="22" stroke="currentColor" strokeWidth="1.5" /><circle cx="445" cy="142" r="22" stroke="currentColor" strokeWidth="1.5" /><circle cx="260" cy="40" r="14" stroke="currentColor" strokeWidth="1.5" /><circle cx="260" cy="240" r="14" stroke="currentColor" strokeWidth="1.5" /></svg>
            <span className="writing-map-label writing-map-label-left">observe</span><span className="writing-map-label writing-map-label-right">reason</span><span className="writing-map-label writing-map-label-bottom">act</span>
          </div>
          <p>Follow the signal. Understand the system.</p>
        </div>
      </div>
    </section>

    <section className="writing-archive" aria-labelledby="writing-archive-title">
      <div className="writing-section-heading"><div><p className="eyebrow">The complete index</p><h2 id="writing-archive-title">All posts <sup>{String(posts.length).padStart(2, '0')}</sup></h2></div><Link href="/books">Explore the books <Icon name="arrow" /></Link></div>
      <div className="article-index">{posts.map((post) => <ArticleIndexRow key={post.data.slug} post={post.data} />)}</div>
    </section>
  </main>;
}
