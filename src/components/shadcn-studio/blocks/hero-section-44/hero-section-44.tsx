import Link from 'next/link';
import { HeroGreeting } from './greeting-word';
import { ArrowDownToLine, ArrowUpRight, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortraitLanyard } from './portrait-lanyard';

const technologies = [
  { name: 'Burp Suite', slug: 'burpsuite', color: '#d95424' },
  { name: 'OWASP', slug: 'owasp', color: 'var(--teal)' },
  { name: 'Kubernetes', slug: 'kubernetes', color: '#326ce5' },
  { name: 'Docker', slug: 'docker', color: '#2496ed' },
  { name: 'Google Cloud', slug: 'googlecloud', color: '#4285f4' },
  { name: 'GitHub', slug: 'github', color: 'var(--foreground)' },
];

// Adapted from the author's supplied Shadcn Studio Hero 44 block.
export default function HeroSection() {
  return <section className="profile-hero" aria-labelledby="home-title">
    <div className="profile-hero-main">
      <div className="profile-hero-copy">
        <HeroGreeting />
        <p className="profile-role">Senior Product Security Engineer</p>
        <p className="profile-location">At Harness · Bengaluru, India</p>
        <p className="profile-description">I work where software engineering meets security. Here I write through the tools, decisions, and details that make complex systems easier to understand.</p>
        <div className="profile-actions">
          <Button asChild className="profile-primary"><Link href="/blog"><BookOpen />Read the writing</Link></Button>
          <Button asChild variant="outline" className="profile-secondary"><a href="/Pankaj-Mouriya-Resume.pdf" download><ArrowDownToLine />Download CV</a></Button>
        </div>
        <a className="profile-connect" href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer">Let’s connect <ArrowUpRight size={16} /></a>
      </div>
      <PortraitLanyard />
    </div>
    <div className="profile-technologies" aria-label="Technologies across my work and writing">
      <ul>{technologies.map(({ name, slug, color }) => <li key={slug}>
        <span className="technology-mark" aria-hidden="true"><span style={{ maskImage: `url(/images/technologies/${slug}.svg)`, backgroundColor: color }} /></span>
        <span>{name}</span>
      </li>)}</ul>
      <Link href="/portfolio">Explore my work <ArrowUpRight size={18} /></Link>
    </div>
  </section>;
}
