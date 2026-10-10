import type { Metadata } from 'next';
import { PortfolioNav } from '@/components/portfolio/PortfolioNav';
import { Icon } from '@/components/ui/icon';
import { experience } from '@/lib/portfolio';

export const metadata: Metadata = {
  title: 'Résumé | Portfolio',
  description: 'Résumé and professional record of security engineer Pankaj Mouriya.',
  alternates: { canonical: '/portfolio/resume' },
};

const focusAreas = [
  'Product security',
  'Vulnerability management',
  'Cloud & Kubernetes',
  'Software supply chain',
  'Application security',
  'Security automation',
] as const;

export default function PortfolioResumePage() {
  return <main id="main-content" className="portfolio-page portfolio-subpage portfolio-resume-page">
    <header className="portfolio-resume-intro">
      <div>
        <h1>Résumé<span>.</span></h1>
        <p>A concise record of the systems, security programs, and engineering practices I have helped build.</p>
      </div>
      <a className="portfolio-resume-download" href="/Pankaj-Mouriya-Resume.pdf" download>
        <Icon name="download" />
        <span><small>PDF · September 2026</small><strong>Download PDF</strong></span>
      </a>
    </header>

    <PortfolioNav current="resume" />

    <div className="portfolio-resume-layout">
      <aside className="portfolio-resume-profile" aria-label="Résumé profile">
        <div>
          <p className="portfolio-resume-name">Pankaj Mouriya</p>
          <p>Security Engineer</p>
          <span>Bengaluru, India</span>
        </div>

        <section aria-labelledby="resume-contact-heading">
          <h2 id="resume-contact-heading">Profiles</h2>
          <a href="https://github.com/pankajmouriya" target="_blank" rel="noopener noreferrer">GitHub <Icon name="arrow" /></a>
          <a href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer">LinkedIn <Icon name="arrow" /></a>
          <a href="https://pankajmouriya.com/" target="_blank" rel="noopener noreferrer">Personal site <Icon name="arrow" /></a>
        </section>

        <section aria-labelledby="resume-credentials-heading">
          <h2 id="resume-credentials-heading">Credentials</h2>
          <p>Certified Kubernetes Administrator (CKA)</p>
          <p>AWS Certified Security – Specialty</p>
        </section>

        <section aria-labelledby="resume-education-heading">
          <h2 id="resume-education-heading">Education</h2>
          <p><strong>B.E. Computer Science</strong><br />Information Security<br />Chandigarh University<br />2016–2020</p>
        </section>
      </aside>

      <div className="portfolio-resume-main">
        <section className="portfolio-resume-summary" aria-labelledby="resume-summary-heading">
          <h2 id="resume-summary-heading">Security work, made usable.</h2>
          <p>I work across product security, cloud infrastructure, application security, and software supply chains. My focus is building controls and automation that fit real engineering workflows and help teams make clearer decisions.</p>
          <ul aria-label="Areas of focus">{focusAreas.map((area) => <li key={area}>{area}</li>)}</ul>
        </section>

        <section className="portfolio-resume-career" aria-labelledby="resume-career-heading">
          <div className="portfolio-resume-section-heading">
            <h2 id="resume-career-heading">Career record</h2>
            <span>2020 — Present</span>
          </div>
          {experience.map((item, index) => <article className="portfolio-resume-role" key={item.organization}>
            <div className="portfolio-resume-role-index">{String(index + 1).padStart(2, '0')}</div>
            <div className="portfolio-resume-role-content">
              <header>
                <div><span>{item.organization}</span><h3>{item.role}</h3></div>
                <time>{item.period}</time>
              </header>
              <p>{item.summary}</p>
              <ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            </div>
          </article>)}
        </section>
      </div>
    </div>
  </main>;
}
