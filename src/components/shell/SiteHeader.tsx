import { Icon } from '@/components/ui/icon';
import Link from 'next/link';
import { ThemeControl } from './ThemeControl';
import { MobileNavigation } from './MobileNavigation';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="site-mark" href="/" aria-label="Pankaj Mouriya, home">Pankaj Mouriya<span className="site-mark-dot">.</span></Link>
        <nav className="desktop-navigation" aria-label="Primary navigation">
          <Link href="/blog"><Icon name="writing" />Writing</Link>
          <Link href="/books"><Icon name="book" />Books</Link>
          <Link href="/search"><Icon name="search" />Search</Link>
          <Link href="/portfolio"><Icon name="work" />Portfolio</Link>
          <Link href="/resume"><Icon name="file" />Résumé</Link>
        </nav>
        <div className="site-header-actions">
          <a href="https://github.com/pankajmouriya" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <ThemeControl />
        </div>
        <div className="mobile-theme-control"><ThemeControl /></div>
        <MobileNavigation />
      </div>
    </header>
  );
}
