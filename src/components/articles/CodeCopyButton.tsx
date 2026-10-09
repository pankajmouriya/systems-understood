'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

export function CodeCopyButton() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    const block = event.currentTarget.closest('[data-code-block]');
    const code = block?.querySelector('pre code');
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code.textContent ?? '');
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return <><Button type="button" variant="outline" size="xs" className="code-copy" onClick={copy} aria-label={copied ? 'Copied' : 'Copy code'}>{copied ? 'Copied' : 'Copy'}</Button><span className="sr-only" role="status" aria-live="polite">{copied ? 'Code copied to clipboard' : ''}</span></>;
}
