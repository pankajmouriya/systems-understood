import { BorderTrace } from '@/components/effects/BorderTrace';
import Link from 'next/link';
import { Icon } from '@/components/ui/icon';
import { ArticleSecurityBoundary } from './ArticleSecurityBoundary';
import { securityTopicFor } from './security-topics';
import { TopicBadge } from './TopicBadge';

type ArticleMetadata = {
  title: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  kind: 'essay' | 'tutorial' | 'research' | 'note';
  tags: string[];
  security?: { reviewedOn?: string; status?: string };
};

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${value}T00:00:00Z`));
}

export function ArticleHeader({ post, readingMinutes }: { post: ArticleMetadata; readingMinutes: number }) {
  const topic = securityTopicFor(post.tags);
  return (
    <header className="article-header trace-surface">
      <BorderTrace />
      <Link href="/blog" className="reader-back"><Icon name="back" />All writing</Link>
      <div className={topic ? "article-title-composition" : undefined}><div>
      <div className="article-meta">
        <span><Icon name="writing" />{post.kind}</span>
        <span><Icon name="calendar" /><time dateTime={post.date}>{dateLabel(post.date)}</time></span>
        <span><Icon name="clock" />{readingMinutes} min read</span>
      </div>
      <h1>{post.title}</h1>
      <p className="article-deck">{post.description}</p>
      <div className="article-byline">
        {post.author && <span>By {post.author}</span>}
        {post.updated && <span>Updated <time dateTime={post.updated}>{dateLabel(post.updated)}</time></span>}
        {post.security?.reviewedOn && <span>Reviewed <time dateTime={post.security.reviewedOn}>{dateLabel(post.security.reviewedOn)}</time></span>}
      </div>
      {post.tags.length > 0 && <div className="article-tags" aria-label="Topics">{post.tags.map((tag) => <TopicBadge key={tag} tag={tag} />)}</div>}
      </div>{topic && <ArticleSecurityBoundary key={topic} topic={topic} />}</div>
    </header>
  );
}
