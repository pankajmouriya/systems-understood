import type { TOCItemType } from 'fumadocs-core/toc';
import type { ReactNode } from 'react';
import { ArticleTOC } from './ArticleTOC';

export function ArticleLayout({ toc, children }: { toc: TOCItemType[]; children: ReactNode }) {
  return (
    <div className={`article-grid${toc.length < 2 ? ' article-grid-no-toc' : ''}`}>
      <article className="article-prose">{children}</article>
      {toc.length >= 2 && <ArticleTOC items={toc} />}
    </div>
  );
}
