'use client';

import { useEffect, useState } from 'react';
import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeControl } from './ThemeControl';
import { MobileNavigation } from './MobileNavigation';
import { SiteSearch } from './SiteSearch';

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const inSection = (section: string) => pathname === section || pathname.startsWith(`${section}/`);

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
          <Link href="/blog" aria-current={inSection('/blog') ? 'page' : undefined}><Icon name="writing" />Writing</Link>
          <Link href="/books" aria-current={inSection('/books') ? 'page' : undefined}><Icon name="book" />Books</Link>
          <Link href="/about" aria-current={inSection('/about') ? 'page' : undefined}><Icon name="user" />About Me</Link>
          <Link href="/portfolio" aria-current={inSection('/portfolio') ? 'page' : undefined}><Icon name="work" />Portfolio</Link>
        </nav>
        <div className="site-header-actions">
          <a href="https://github.com/pankajmouriya" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <div className="site-search-utility-wrap">
            <button type="button" className="site-search-utility" onClick={() => setSearchOpen(true)} aria-label="Search writing" aria-describedby="site-search-tooltip" aria-haspopup="dialog" aria-keyshortcuts="Control+K Meta+K"><Icon name="search" /></button>
            <span id="site-search-tooltip" role="tooltip">Search writing <kbd>⌘ K</kbd></span>
          </div>
          <ThemeControl />
        </div>
        <div className="mobile-theme-control"><ThemeControl /></div>
        <MobileNavigation onSearch={() => setSearchOpen(true)} />
      </div>
    </header><SiteSearch open={searchOpen} onOpenChange={setSearchOpen} /></>
  );
}
