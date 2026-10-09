import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/icon';

export function Callout({ type = 'note', title, children }: {
  type?: 'note' | 'tip' | 'warning' | 'danger';
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className={`callout callout-${type}`} aria-label={`${type}: ${title}`}>
      <strong><Icon name={type === 'tip' ? 'shield' : 'info'} />{title}</strong>
      <div>{children}</div>
    </aside>
  );
}
