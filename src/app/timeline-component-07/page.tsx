import type { Metadata } from 'next';
import Process from '@/components/shadcn-studio/blocks/timeline-component-07/timeline-component-07';
import { experienceSteps } from '@/lib/experience-timeline';

export const metadata: Metadata = { title: 'Experience timeline', description: 'Experience timeline block for Pankaj Mouriya.', robots: { index: false, follow: false } };

export default function TimelinePage() {
  return <main id="main-content" className="portfolio-page timeline-demo-page">
    <header className="portfolio-intro"><p className="eyebrow">Experience / Timeline 07</p><h1>A career in <em>security.</em></h1><p>Five roles across consulting, application security, cloud infrastructure, and product security.</p></header>
    <section aria-label="Experience timeline"><Process data={experienceSteps} /></section>
  </main>;
}
