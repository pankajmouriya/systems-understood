import type { Metadata } from 'next';
import Link from 'next/link';
import { PortfolioNav } from '@/components/portfolio/PortfolioNav';
import Process from '@/components/shadcn-studio/blocks/timeline-component-07/timeline-component-07';
import { experienceSteps } from '@/lib/experience-timeline';
import { selectedProjects, talks } from '@/lib/portfolio';

export const metadata: Metadata = { title: 'Portfolio', description: 'Experience, projects, and conference talks by Pankaj Mouriya.', alternates: { canonical: '/portfolio' } };

export default function PortfolioPage() {
  return <main id="main-content" className="portfolio-page">
    <header className="portfolio-intro"><p className="eyebrow">Portfolio / Selected work</p><h1>Building security<br /><em>into the work.</em></h1><p>My work spans application and cloud security, security infrastructure, incident response, and the systems that help teams make better decisions.</p></header>
    <PortfolioNav current="experience" />
    <section className="portfolio-section" aria-labelledby="experience-heading"><div className="portfolio-section-header"><div><p className="eyebrow">01 / Experience</p><h2 id="experience-heading">Where I’ve worked</h2></div><p>From consulting and security research to product security at scale.</p></div>
      <Process data={experienceSteps} />
    </section>
    <section className="portfolio-teasers" aria-label="More from the portfolio"><Link className="surface-sheen" href="/portfolio/projects"><span className="eyebrow">02 / Projects</span><strong>{selectedProjects[0].name}</strong><span>See selected work ↗</span></Link><Link className="surface-sheen" href="/portfolio/talks"><span className="eyebrow">03 / Speaking</span><strong>{talks.length} talks &amp; conferences</strong><span>Explore the archive ↗</span></Link></section>
  </main>;
}
