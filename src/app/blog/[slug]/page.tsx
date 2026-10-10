import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReadingStamp } from '@/components/articles/ReadingStamp';
import { ArticleHeader } from '@/components/articles/ArticleHeader';
import { ArticleLayout } from '@/components/articles/ArticleLayout';
import { Callout } from '@/components/articles/Callout';
import { mdxComponents } from '@/components/mdx';
import { estimateReadingMinutes } from '@/lib/reading-time';
import { getPublishedPage, getPublishedPages } from '@/lib/source';
import { siteOrigin } from '@/lib/site';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublishedPages().map((post) => ({ slug: post.data.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedPage(slug);
  if (!post) notFound();
  const canonical = post.data.canonicalUrl ?? new URL(`/blog/${slug}`, siteOrigin()).toString();
  return {
    title: post.data.title,
    description: post.data.description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      title: post.data.title,
      description: post.data.description,
      url: canonical,
      publishedTime: post.data.date,
      modifiedTime: post.data.updated,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPublishedPage(slug);
  if (!post) notFound();
  const Body = post.data.body;
  const raw = await post.data.getText('raw');
  return (
    <main id="main-content" className="article-page">
      <ArticleHeader post={post.data} readingMinutes={estimateReadingMinutes(raw)} />
      <ArticleLayout toc={post.data.toc}>
        {post.data.security?.status === 'historical' && <Callout type="note" title="From the archive">This article preserves the original walkthrough. Tools, APIs, and security guidance may have changed since publication; verify details against current documentation before applying them.</Callout>}
        <Body components={mdxComponents} />
        <ReadingStamp key={slug} slug={slug} />
      </ArticleLayout>
    </main>
  );
}
