'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { ThemeControl } from './ThemeControl';
import { MobileNavigation } from './MobileNavigation';
import { SiteSearch } from './SiteSearch';

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => document.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <><header className="site-header">
      <div className="site-header-inner">
        <Link className="site-mark" href="/" aria-label="Pankaj Mouriya, home">Pankaj Mouriya<span className="site-mark-dot">.</span></Link>
        <nav className="desktop-navigation" aria-label="Primary navigation">
          <Link href="/blog"><Icon name="writing" />Writing</Link>
          <Link href="/books"><Icon name="book" />Books</Link>
          <button type="button" className="site-search-trigger" onClick={() => setSearchOpen(true)} aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K"><Icon name="search" />Search <kbd>⌘ K</kbd></button>
          <Link href="/portfolio"><Icon name="work" />Portfolio</Link>
          <Link href="/resume"><Icon name="file" />Résumé</Link>
        </nav>
        <div className="site-header-actions">
          <a href="https://github.com/pankajmouriya" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <ThemeControl />
        </div>
        <div className="mobile-theme-control"><ThemeControl /></div>
        <MobileNavigation onSearch={() => setSearchOpen(true)} />
      </div>
    </header><SiteSearch open={searchOpen} onOpenChange={setSearchOpen} /></>
  );
}
