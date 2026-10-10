'use client';

import { useRef } from 'react';
import { AppWindow, Bot, CloudCog, PackageCheck, ScanSearch, ShieldCheck, type LucideIcon } from 'lucide-react';
import { useSceneVisibility } from '@/components/effects/use-security-stories';

type Capability = {
  title: string;
  description: string;
  evidence: string;
  icon: LucideIcon;
};

const capabilities: Capability[] = [
  {
    title: 'Product security',
    description: 'Build security into product decisions, delivery paths, and ownership models.',
    evidence: 'Built security scanning and governance workflows across CI pipelines.',
    icon: ShieldCheck,
  },
  {
    title: 'Vulnerability management',
    description: 'Turn findings into prioritized, traceable remediation programs.',
    evidence: 'Architected SoS for vulnerability management and security posture.',
    icon: ScanSearch,
  },
  {
    title: 'Application security',
    description: 'Find design and implementation risk across web applications and APIs.',
    evidence: 'Built SAST and DAST coverage into delivery pipelines.',
    icon: AppWindow,
  },
  {
    title: 'Cloud & Kubernetes security',
    description: 'Shape practical controls around cloud posture, identity, and workloads.',
    evidence: 'Built cloud security tooling and runtime protections for analyzers.',
    icon: CloudCog,
  },
  {
    title: 'Software supply chain security',
    description: 'Protect the path from source and dependency to signed release artifact.',
    evidence: 'Established release provenance and container signing controls.',
    icon: PackageCheck,
  },
  {
    title: 'Security automation & AI triage',
    description: 'Design systems that reduce repetitive analysis while preserving judgment.',
    evidence: 'Developed AI-assisted triage for vulnerability and pentest reports.',
    icon: Bot,
  },
];

function Route({ mobile = false }: { mobile?: boolean }) {
  const path = mobile ? 'M4 0 V100' : 'M0 0 H100 V50 H0 V100 H100';
  return <svg className={`capability-route capability-route-${mobile ? 'mobile' : 'desktop'}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
    <path className="capability-route-base" d={path} pathLength="100" />
    <path className="capability-signal" d={path} pathLength="100" />
  </svg>;
}

export function CapabilityLedger() {
  const host = useRef<HTMLElement>(null);
  const { motion, visible } = useSceneVisibility(host);

  return <section ref={host} className="capability-section" aria-labelledby="capability-heading">
    <header className="capability-header">
      <div><p className="capability-kicker">{'// Stacks & Experience'}</p><h2 id="capability-heading">Where I’m good</h2></div>
      <p>Six areas where hands-on engineering, security research, and program ownership meet.</p>
    </header>
    <div className="capability-ledger" data-active={motion && visible}>
      <Route />
      <Route mobile />
      <ol>
        {capabilities.map(({ title, description, evidence, icon: CapabilityIcon }, index) => <li key={title}>
          <div className="capability-title-row"><span>{String(index + 1).padStart(2, '0')}</span><CapabilityIcon aria-hidden="true" /><h3>{title}</h3></div>
          <p>{description}</p>
          <small>{evidence}</small>
        </li>)}
      </ol>
    </div>
  </section>;
}
