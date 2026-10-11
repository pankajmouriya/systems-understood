import { Icon } from '@/components/ui/icon';
import type { Metadata } from 'next';
import { PortfolioNav } from '@/components/portfolio/PortfolioNav';
import { talks } from '@/lib/portfolio';

export const metadata: Metadata = { title: 'Speaking', description: 'Conference and community talks by Pankaj Mouriya.', alternates: { canonical: '/portfolio/talks' } };

export default function TalksPage() {
  return <main id="main-content" className="portfolio-page portfolio-subpage"><header className="portfolio-intro"><p className="eyebrow">Portfolio / 03</p><h1 id="talks-title">On stage<span>.</span></h1><p>Ideas shared with security communities, from browser boundaries to cloud and supply chain security.</p></header><PortfolioNav current="talks" />
    <section className="portfolio-section" aria-labelledby="talks-heading"><div className="portfolio-section-label"><span className="section-icon tone-warm"><Icon name="mic" /></span><p className="eyebrow">{talks.length} sessions</p><h2 id="talks-heading">Speaking archive</h2><p>Selected conference and community sessions from 2018 onward. Guides and slides sit alongside the talks where available.</p></div><div className="talk-list">{talks.map((talk) => <article className="talk-entry" key={`${talk.event}-${talk.title}`}><span>{talk.year}</span><div><p className="eyebrow">{talk.event}</p><h3>{talk.title}</h3><p>{talk.description}</p><div className="talk-resources">{talk.url && <a href={talk.url} target="_blank" rel="noopener noreferrer">Original talk page <Icon name="arrow" /></a>}{talk.resources?.map((resource) => <a key={resource.href} href={resource.href} target={resource.href.startsWith('http') ? '_blank' : undefined} rel={resource.href.startsWith('http') ? 'noopener noreferrer' : undefined}><Icon name="book" />{resource.label}</a>)}</div></div></article>)}</div></section>
  </main>;
}
