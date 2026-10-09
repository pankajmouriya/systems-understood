import { Icon } from '@/components/ui/icon';
import type { Metadata } from 'next';
import { PortfolioNav } from '@/components/portfolio/PortfolioNav';
import { selectedProjects } from '@/lib/portfolio';

export const metadata: Metadata = { title: 'Projects', description: 'Selected public projects maintained by Pankaj Mouriya.', alternates: { canonical: '/portfolio/projects' } };

export default function ProjectsPage() {
  return <main id="main-content" className="portfolio-page portfolio-subpage"><header className="portfolio-intro"><p className="eyebrow">Portfolio / 02</p><h1>Projects<span>.</span></h1><p>Selected public work that continues beyond an individual article.</p></header><PortfolioNav current="projects" />
    <section className="portfolio-section" aria-labelledby="projects-heading"><div className="portfolio-section-label"><span className="section-icon tone-teal"><Icon name="code" /></span><h2 id="projects-heading">Built in the open</h2></div><div className="project-list">{selectedProjects.map((project) => <article className="project-entry" key={project.name}><p className="eyebrow">{project.type}</p><h3>{project.name}</h3><p>{project.description}</p><div className="project-links"><a href={project.site} target="_blank" rel="noopener noreferrer">Visit publication <Icon name="arrow" /></a><a href={project.source} target="_blank" rel="noopener noreferrer"><Icon name="code" />View source</a></div></article>)}</div></section>
  </main>;
}
