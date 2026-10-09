'use client';

import { AnchorProvider, TOCItem, type TOCItemType } from 'fumadocs-core/toc';
import { Icon } from '@/components/ui/icon';

function Links({ items }: { items: TOCItemType[] }) {
  return (
    <ol className="toc-list">
      {items.map((item) => (
        <li key={item.url} data-depth={item.depth}>
          <TOCItem href={item.url} className="toc-link">{item.title}</TOCItem>
        </li>
      ))}
    </ol>
  );
}

export function ArticleTOC({ items }: { items: TOCItemType[] }) {
  return (
    <AnchorProvider toc={items}>
      <aside className="article-toc" aria-label="On this page">
        <p className="toc-heading"><Icon name="list" />On this page</p>
        <nav aria-label="On this page"><Links items={items} /></nav>
      </aside>
      <details className="article-toc-inline">
        <summary><Icon name="list" />On this page</summary>
        <nav aria-label="On this page"><Links items={items} /></nav>
      </details>
    </AnchorProvider>
  );
}
