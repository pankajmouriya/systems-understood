import Link from 'next/link';
import { Icon } from '@/components/ui/icon';

type ArticleSummary = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
};

export function ArticleIndexRow({ post }: { post: ArticleSummary }) {
  const infrastructure = post.tags.includes('containers-kubernetes');
  const topic = infrastructure ? 'Kubernetes' : 'Application security';

  return <article className="article-index-row" data-writing-row>
    <time className="article-index-date" dateTime={post.date}><span aria-hidden="true" />{post.date.replaceAll('-', '.')}</time>
    <div className="article-index-copy">
      <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p>{post.description}</p>
    </div>
    <div className="article-index-aside"><span className={`article-index-topic ${infrastructure ? 'article-index-topic-blue' : 'article-index-topic-green'}`}><Icon name={infrastructure ? 'cube' : 'shield'} />{topic}</span><Icon name="arrow" className="article-index-arrow" /></div>
  </article>;
}
