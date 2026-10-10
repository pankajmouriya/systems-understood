import HeroSection from '@/components/shadcn-studio/blocks/hero-section-44/hero-section-44';
import { Icon } from '@/components/ui/icon';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleIndexRow } from '@/components/writing/ArticleIndexRow';
import { getPublishedPages } from '@/lib/source';

export const metadata: Metadata = { title: 'Pankaj Mouriya — Engineering, security, and writing', alternates: { canonical: '/' } };

export default function HomePage() {
  const posts = getPublishedPages();
  const selected = posts.find((post) => post.data.slug === 'devtools');
  const more = posts.filter((post) => post.data.slug !== 'devtools').slice(0, 3);
  return <main id="main-content" className="home-page">
    <HeroSection />
    {selected && <section className="home-feature-section" aria-labelledby="selected-writing" data-featured-writing>
      <div className="section-heading"><div><p className="eyebrow">From the archive</p><h2 id="selected-writing">Selected writing</h2></div><Link href="/blog">All writing <span aria-hidden="true">↗</span></Link></div>
      <article className="featured-story">
        <div className="featured-story-copy"><p className="story-kicker"><span>01</span><span>Application security / Tutorial</span><time dateTime={selected.data.date}>{selected.data.date}</time></p><h3><Link href={`/blog/${selected.data.slug}`}>{selected.data.title}</Link></h3><p>{selected.data.description}</p><Link className="text-action" href={`/blog/${selected.data.slug}`}>Read the article <Icon name="arrow" /></Link></div>
        <div className="technical-artifact" data-technical-artifact aria-label="Illustration of a postMessage call and its target origin"><div className="artifact-topline"><span>FIELD NOTE / 001</span><span>Browser contexts</span></div><div className="artifact-flow"><span>Sender window</span><span aria-hidden="true">→</span><span>Receiver window</span></div><code>targetWindow.postMessage(data, <strong>targetOrigin</strong>)</code><p>One argument decides which origin may receive the message. The article follows that detail through DevTools.</p><div className="artifact-footline"><span>INSPECT THE BOUNDARY</span><span aria-hidden="true">↗</span></div></div>
      </article>
    </section>}
    <section className="home-more-writing" aria-labelledby="more-writing-title">
      <div className="writing-section-heading"><div><p className="eyebrow">Beyond the feature</p><h2 id="more-writing-title">More from the archive</h2></div><Link href="/blog">View all {posts.length} articles <Icon name="arrow" /></Link></div>
      <div className="article-index">{more.map((post) => <ArticleIndexRow key={post.data.slug} post={post.data} />)}</div>
    </section>
    <section className="home-work" aria-labelledby="home-work-heading"><div><p className="eyebrow">Beyond the page</p><h2 id="home-work-heading">Work in the open.</h2></div><p>Projects, research, and talks connect the writing to the work behind it. <Link href="/portfolio">Explore the portfolio <span aria-hidden="true">↗</span></Link></p><div className="home-work-links"><a className="surface-sheen" href="https://tsd.report" target="_blank" rel="noopener noreferrer"><span className="section-icon tone-teal"><Icon name="code" /></span><span>Selected project</span><strong>The Security Diff</strong><span>Security research and publication ↗</span></a><Link className="surface-sheen" href="/portfolio/talks"><span className="section-icon tone-warm"><Icon name="mic" /></span><span>On stage</span><strong>Talks &amp; conferences</strong><span>See the speaking archive ↗</span></Link></div></section>
  </main>;
}
