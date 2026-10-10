import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <Link className="footer-name" href="/">Pankaj Mouriya<span aria-hidden="true">.</span></Link>
          <p>Writing about software systems and security.</p>
        </div>
        <nav aria-label="Footer navigation">
          <Link href="/blog">Writing</Link>
          <Link href="/books">Books</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href="/resume">Résumé</Link>
          <a href="https://github.com/pankajmouriya">GitHub</a>
          <a href="https://www.linkedin.com/in/pankajmouriya/">LinkedIn</a>
        </nav>
        <small>© {new Date().getFullYear()} Pankaj Mouriya</small>
      </div>
    </footer>
  );
}
