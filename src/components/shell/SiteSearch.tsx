'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { Icon } from '@/components/ui/icon';
import { searchIndex, type SearchIndexEntry, type SearchResult } from '@/lib/search-client';

let searchIndexPromise: Promise<SearchIndexEntry[]> | undefined;

function loadSearchIndex() {
  searchIndexPromise ??= fetch('/search-index.json')
    .then((response) => {
      if (!response.ok) throw new Error('Search index request failed');
      return response.json() as Promise<{ results: SearchIndexEntry[] }>;
    })
    .then(({ results }) => results)
    .catch((error) => {
      searchIndexPromise = undefined;
      throw error;
    });

  return searchIndexPromise;
}

export function SiteSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initial = params.get('search') ?? params.get('q');
    if (initial !== null) {
      queueMicrotask(() => {
        const value = initial.slice(0, 120);
        setQuery(value);
        setLoading(Boolean(value));
        onOpenChange(true);
      });
      params.delete('search');
      params.delete('q');
      const remaining = params.toString();
      window.history.replaceState(window.history.state, '', `${window.location.pathname}${remaining ? `?${remaining}` : ''}`);
    }
  }, [onOpenChange]);

  useEffect(() => {
    if (!open || !query.trim()) return;
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setFailed(false);
      try {
        const index = await loadSearchIndex();
        setResults(searchIndex(index, query));
      } catch {
        setFailed(true);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 150);
    return () => window.clearTimeout(timeout);
  }, [open, query]);

  function navigate(href: string) {
    onOpenChange(false);
    router.push(href);
  }

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="site-search-dialog">
      <DialogTitle className="sr-only">Search writing</DialogTitle>
      <DialogDescription className="sr-only">Find articles and book chapters by topic or text.</DialogDescription>
      <Command shouldFilter={false} className="site-search-command">
        <CommandInput aria-label="Search articles and book chapters" placeholder="Search writing and books…" value={query} onValueChange={(value) => { setQuery(value); setResults([]); setLoading(Boolean(value.trim())); setFailed(false); }} maxLength={120} autoFocus />
        <CommandList className="site-search-list">
          {!query.trim() ? <div className="site-search-hint"><p>Explore the archive</p><span>Try “Kubernetes”, “postMessage”, or “security”.</span></div>
            : loading ? <p className="site-search-status" role="status">Searching the archive…</p>
              : failed ? <p className="site-search-status" role="alert">Search could not load. Try again.</p>
                : results.length ? <CommandGroup heading={`${results.length} ${results.length === 1 ? 'result' : 'results'}`}>
                    {results.map((result) => <CommandItem key={result.href} value={result.href} onSelect={() => navigate(result.href)} className="site-search-result">
                      <Icon name={result.type === 'Article' ? 'writing' : 'book'} />
                      <span className="site-search-result-copy"><span className="site-search-result-meta">{result.type} · {result.context}</span><strong>{result.title}</strong><span className="site-search-result-description">{result.description}</span></span>
                      <span className="site-search-result-arrow" aria-hidden="true">↗</span>
                    </CommandItem>)}
                  </CommandGroup>
                  : <p className="site-search-status" role="status">No writing found. Try a broader term.</p>}
        </CommandList>
        <div className="site-search-footer"><span>Searches published articles and book chapters</span><span>↑ ↓ to navigate · Enter to open · Esc to close</span></div>
      </Command>
    </DialogContent>
  </Dialog>;
}
