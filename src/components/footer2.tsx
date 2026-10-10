import { BorderTrace } from '@/components/effects/BorderTrace';
import Link from 'next/link';
import { ArrowUpRight, BookOpenText, Rss } from 'lucide-react';
import { Icon } from '@/components/ui/icon';

// Adapted from the free Shadcnblocks Footer 2 layout: https://www.shadcnblocks.com/block/footer2

const explore = [
  { label: 'Writing', href: '/blog' },
  { label: 'Books', href: '/books' },
  { label: 'About Me', href: '/about' },
  { label: 'Portfolio', href: '/portfolio' },
];

const work: { label: string; href: string; external?: boolean }[] = [
  { label: 'Experience', href: '/portfolio' },
  { label: 'Projects', href: '/portfolio/projects' },
  { label: 'Talks & conferences', href: '/portfolio/talks' },
  { label: 'Résumé', href: '/portfolio/resume' },
  { label: 'The Security Diff', href: 'https://tsd.report', external: true },
];

export function Footer2() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-invitation trace-surface"><BorderTrace />
          <div>
            <p className="footer-eyebrow"><BookOpenText aria-hidden="true" /> An ongoing archive</p>
            <h2>There is always<br />more to understand<span>.</span></h2>
          </div>
          <div className="footer-invitation-action">
            <p>Field notes from building, breaking, and understanding software.</p>
            <Link href="/blog">Explore the writing <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-about">
            <Link className="footer-name" href="/">Pankaj Mouriya<span aria-hidden="true">.</span></Link>
            <p>Software engineering, security, and the details worth writing down.</p>
            <span>Bengaluru, India</span>
          </div>
          <nav aria-label="Footer navigation" className="footer-links">
            <div>
              <h3>Explore</h3>
              {explore.map(({ label, href }) => <Link key={label} href={href}>{label}</Link>)}
            </div>
            <div>
              <h3>Work</h3>
              {work.map(({ label, href, external }) => external
                ? <a key={label} href={href} target="_blank" rel="noopener noreferrer">{label} <ArrowUpRight aria-hidden="true" /></a>
                : <Link key={label} href={href}>{label}</Link>)}
            </div>
          </nav>
          <div className="footer-connect">
            <h3>Elsewhere</h3>
            <a href="https://github.com/pankajmouriya" target="_blank" rel="noopener noreferrer"><Icon name="code" />GitHub <ArrowUpRight aria-hidden="true" /></a>
            <a href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer"><Icon name="work" />LinkedIn <ArrowUpRight aria-hidden="true" /></a>
            <Link href="/rss.xml"><Rss aria-hidden="true" />RSS feed <ArrowUpRight aria-hidden="true" /></Link>
          </div>
        </div>

        <div className="footer-bottom">
          <small>© {new Date().getFullYear()} Pankaj Mouriya</small>
          <span>Made for the curious reader.</span>
          <a href="#">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
