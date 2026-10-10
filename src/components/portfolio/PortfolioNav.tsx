import { Icon } from '@/components/ui/icon';
import Link from 'next/link';

export function PortfolioNav({ current }: { current: 'experience' | 'projects' | 'talks' | 'resume' }) {
  return <nav className="portfolio-nav" aria-label="Portfolio sections"><Link href="/portfolio" aria-current={current === 'experience' ? 'page' : undefined}><Icon name="work" />Experience</Link><Link href="/portfolio/projects" aria-current={current === 'projects' ? 'page' : undefined}><Icon name="code" />Projects</Link><Link href="/portfolio/talks" aria-current={current === 'talks' ? 'page' : undefined}><Icon name="mic" />Talks</Link><Link href="/portfolio/resume" aria-current={current === 'resume' ? 'page' : undefined}><Icon name="file" />Résumé</Link></nav>;
}
