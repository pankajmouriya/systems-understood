import { Icon } from '@/components/ui/icon';
import type { Metadata } from 'next';
import { experience } from '@/lib/portfolio';

export const metadata: Metadata = { title: 'Résumé', description: 'Résumé of Pankaj Mouriya, Senior Product Security Engineer.', alternates: { canonical: '/resume' } };

export default function ResumePage() {
  return <main id="main-content" className="resume-page"><header className="resume-intro"><p className="eyebrow">Pankaj Mouriya / Résumé</p><h1>Résumé<span>.</span></h1><p>Senior Product Security Engineer working across vulnerability management, cloud and supply chain security, and automation.</p><a className="resume-download" href="/Pankaj-Mouriya-Resume.pdf" download><Icon name="download" />Download PDF</a></header>
    <div className="resume-grid"><aside><p className="eyebrow">Contact &amp; profile</p><a href="https://github.com/pankajmouriya">GitHub ↗</a><a href="https://www.linkedin.com/in/pankajmouriya/">LinkedIn ↗</a><a href="https://pankajmouriya.com/">Personal site ↗</a><p>Bengaluru, India</p></aside><div>
      <section aria-labelledby="resume-experience"><h2 id="resume-experience">Experience</h2>{experience.map((item) => <article className="resume-role" key={item.organization}><div><h3>{item.organization}</h3><span>{item.period}</span></div><p><strong>{item.role}</strong> · {item.summary}</p></article>)}</section>
      <section aria-labelledby="resume-focus"><span className="section-icon tone-teal"><Icon name="shield" /></span><h2 id="resume-focus">Areas of focus</h2><p>Product security · Vulnerability management · DevSecOps · Software supply chain · Cloud and container security · Incident response · Security automation</p></section>
      <section aria-labelledby="resume-credentials"><h2 id="resume-credentials">Credentials</h2><p>Certified Kubernetes Administrator (CKA) · AWS Certified Security – Specialty</p><p>B.E. Computer Science (Information Security), Chandigarh University, 2016–2020.</p></section>
    </div></div>
  </main>;
}
