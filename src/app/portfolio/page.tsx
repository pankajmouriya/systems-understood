import type { Metadata } from 'next';
import Link from 'next/link';
import { PortfolioNav } from '@/components/portfolio/PortfolioNav';
import { Timeline, TimelineContent, TimelineDate, TimelineHeader, TimelineIndicator, TimelineItem, TimelineSeparator, TimelineTitle } from '@/components/reui/timeline';
import { experience, selectedProjects, talks } from '@/lib/portfolio';

export const metadata: Metadata = { title: 'Portfolio', description: 'Experience, projects, and conference talks by Pankaj Mouriya.', alternates: { canonical: '/portfolio' } };

export default function PortfolioPage() {
  return <main id="main-content" className="portfolio-page">
    <header className="portfolio-intro"><p className="eyebrow">Portfolio / Selected work</p><h1>Building security<br /><em>into the work.</em></h1><p>My work spans application and cloud security, security infrastructure, incident response, and the systems that help teams make better decisions.</p></header>
    <PortfolioNav current="experience" />
    <section className="portfolio-section" aria-labelledby="experience-heading"><div className="portfolio-section-label"><p className="eyebrow">01 / Experience</p><h2 id="experience-heading">Where I’ve worked</h2><p>From consulting and security research to product security at scale.</p></div>
      <Timeline className="career-timeline" defaultValue={1}>
        {experience.map((item, index) => <TimelineItem className="career-item" step={index + 1} key={item.organization}>
          <TimelineHeader><TimelineDate dateTime={item.start}>{item.period}</TimelineDate><TimelineTitle>{item.organization}</TimelineTitle><p className="career-role">{item.role}</p></TimelineHeader>
          <TimelineIndicator className="career-indicator" /><TimelineSeparator className="career-separator" />
          <TimelineContent><p>{item.summary}</p><ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></TimelineContent>
        </TimelineItem>)}
      </Timeline>
    </section>
    <section className="portfolio-teasers" aria-label="More from the portfolio"><Link href="/portfolio/projects"><span className="eyebrow">02 / Projects</span><strong>{selectedProjects[0].name}</strong><span>See selected work ↗</span></Link><Link href="/portfolio/talks"><span className="eyebrow">03 / Speaking</span><strong>{talks.length} talks &amp; conferences</strong><span>Explore the archive ↗</span></Link></section>
  </main>;
}
