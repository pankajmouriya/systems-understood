import type { Metadata } from 'next';
import Link from 'next/link';
import { ArticleSecurityBoundary } from '@/components/articles/ArticleSecurityBoundary';
import { securityTopics, type SecurityTopic } from '@/components/articles/security-topics';

export const metadata: Metadata = { title: 'Article guardian studies', robots: { index: false, follow: false } };
export default function SecurityStudy() {
  return <main id="main-content" className="agent-study-page">
    <Link href="/blog" className="agent-study-back">← Back to writing</Link>
    <h1>One guardian. Five domains.</h1>
    <p>Title illustrations with defenses inside the boundary and threats outside. Each plays once, then rests.</p>
    <div className="security-study-grid">{(Object.keys(securityTopics) as SecurityTopic[]).map(topic => <ArticleSecurityBoundary key={topic} topic={topic} />)}</div>
  </main>;
}
