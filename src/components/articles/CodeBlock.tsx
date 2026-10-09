import type { ComponentPropsWithoutRef } from 'react';
import { CodeCopyButton } from './CodeCopyButton';

export function CodeBlock({ title, className, ...props }: ComponentPropsWithoutRef<'pre'>) {
  return (
    <div className="code-block" data-code-block>
      <div className="code-toolbar">
        <span className="code-title">{title || 'Code'}</span>
        <CodeCopyButton />
      </div>
      <pre className={className} {...props} />
    </div>
  );
}
