'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { ArrowUpRight, BookOpenText, MapPin, RotateCcw, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';

const facts = [
  { value: '5', label: 'roles' },
  { value: '9', label: 'talks' },
  { value: '2', label: 'guides' },
] as const;

const practices = [
  ['Product security', 'Build controls into the way products are designed and delivered.'],
  ['Cloud & Kubernetes', 'Treat identity, policy, workload boundaries, and runtime as one system.'],
  ['Supply chain security', 'Protect the path from source and dependency to a trusted release.'],
  ['Security automation', 'Reduce repetitive analysis while keeping judgment with engineers.'],
] as const;

function PortraitSeal() {
  return <span className="about-portrait-seal" aria-hidden="true">
    <svg viewBox="0 0 100 100"><defs><path id="about-seal-path" d="M50,50 m-34,0 a34,34 0 1,1 68,0 a34,34 0 1,1 -68,0" /></defs><text><textPath href="#about-seal-path">BUILD · BREAK · EXPLAIN · BUILD · BREAK · EXPLAIN · </textPath></text></svg>
    <ShieldCheck />
  </span>;
}

function ProfileCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.5 });
  const rotate = useTransform(progress, [0, 0.5, 1], [-3, 0, 3]);
  const toggle = () => setIsFlipped((current) => !current);

  return <div ref={containerRef} className="about-profile-shell">
    <motion.div className="about-profile-tilt" style={{ rotate: reduceMotion ? 0 : rotate }}>
      <button className="about-profile-flip" type="button" aria-label="Flip profile card" aria-pressed={isFlipped} data-flipped={isFlipped} onClick={toggle}>
        <Card className="about-profile-face about-profile-front" aria-hidden={isFlipped}>
          <CardContent>
            <div className="about-card-person">
              <Avatar className="about-card-avatar">
                <AvatarImage src="/images/profile/pankaj-portrait.png" alt="" />
                <AvatarFallback>PM</AvatarFallback>
              </Avatar>
              <div><strong>Pankaj Mouriya</strong><span><MapPin aria-hidden="true" /> Bengaluru, India</span></div>
            </div>
            <Separator />
            <dl className="about-facts">{facts.map(({ value, label }) => <div key={label}><dt>{value}</dt><dd>{label}</dd></div>)}</dl>
            <span className="about-flip-hint"><RotateCcw aria-hidden="true" /> Flip for the short version</span>
          </CardContent>
        </Card>

        <Card className="about-profile-face about-profile-back" aria-hidden={!isFlipped} data-testid="profile-card-back">
          <CardContent>
            <span>How I work</span>
            <p className="about-card-principle">Understand the system, make the boundary visible, then build the control where engineers can use it.</p>
            <div className="about-card-person about-card-person-compact">
              <Avatar><AvatarImage src="/images/profile/pankaj-portrait.png" alt="" /><AvatarFallback>PM</AvatarFallback></Avatar>
              <div><strong>Pankaj Mouriya</strong><span>Security Engineer</span></div>
            </div>
            <span className="about-flip-hint"><RotateCcw aria-hidden="true" /> Return to profile</span>
          </CardContent>
        </Card>
      </button>
    </motion.div>
    <Badge variant="outline" className="about-connect-status"><span />Available to connect</Badge>
  </div>;
}

function PracticeCard() {
  return <Card className="about-practice-card">
    <CardContent>
      <div className="about-practice-heading"><div><h2>What shapes my work</h2><p>Security practice grounded in product context, clear ownership, and tools that fit engineering workflows.</p></div><ShieldCheck aria-hidden="true" /></div>
      <Separator />
      <ul>{practices.map(([title, description]) => <li key={title}><strong>{title}</strong><span>{description}</span></li>)}</ul>
      <div className="about-links">
        <a href="https://github.com/pankajmouriya" target="_blank" rel="noopener noreferrer"><Icon name="code" />GitHub<ArrowUpRight aria-hidden="true" /></a>
        <a href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer"><Icon name="work" />LinkedIn<ArrowUpRight aria-hidden="true" /></a>
        <Link href="/resume"><BookOpenText aria-hidden="true" />Résumé<ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </CardContent>
  </Card>;
}

export default function AboutUs() {
  return <div className="about-page-content">
    <header className="about-intro">
      <h1>Security is how I<br />understand systems<span>.</span></h1>
      <p>I build security programs and engineering systems, then write about the decisions, boundaries, and details that make them work.</p>
    </header>

    <section className="about-story" aria-labelledby="about-story-heading">
      <figure className="about-portrait">
        <PortraitSeal />
        <Image src="/images/profile/pankaj-portrait.png" alt="Pankaj Mouriya outdoors" width={740} height={758} sizes="(max-width: 760px) 100vw, 46vw" priority />
        <figcaption><div><strong>Pankaj Mouriya</strong><span>Security Engineer</span></div><Badge variant="outline" className="about-portrait-status"><span />Bengaluru, India</Badge></figcaption>
      </figure>

      <div className="about-biography">
        <h2 id="about-story-heading">Building, breaking, and explaining.</h2>
        <p>I work where software engineering meets security: product security, application and cloud security, software supply chains, and the automation that helps teams make better decisions.</p>
        <p>My path has moved from penetration testing and public security research to building security infrastructure and programs inside product companies. That range shapes how I approach a problem: understand the system first, then place controls where they can survive real engineering work.</p>
        <p>Writing and speaking are part of the same practice. They force assumptions into the open and turn lessons from incidents, tools, and implementation details into something other engineers can use.</p>
        <Link className="about-writing-link" href="/blog">Read what I’m learning <ArrowUpRight aria-hidden="true" /></Link>
      </div>
    </section>

    <section className="about-block-grid" aria-label="Profile and working principles">
      <ProfileCard />
      <PracticeCard />
    </section>
  </div>;
}
