import Link from 'next/link';
import { HeroGreeting } from './greeting-word';
import { ArrowDownToLine, ArrowUpRight, BookOpen, ShieldCheck, Cloud, PackageCheck, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SecurityTheater } from './security-theater';

const skills = [
  { name: 'Application security', icon: ShieldCheck, tone: 'teal' },
  { name: 'Cloud security', icon: Cloud, tone: 'blue' },
  { name: 'Supply chain security', icon: PackageCheck, tone: 'teal' },
  { name: 'Security automation', icon: Workflow, tone: 'warm' },
];

// Adapted from the author's supplied Shadcn Studio Hero 44 block.
export default function HeroSection() {
  return <section className="profile-hero" aria-labelledby="home-title">
    <div className="profile-hero-main">
      <div className="profile-hero-copy">
        <HeroGreeting />
        <p className="profile-role">Security Engineer</p>
        <p className="profile-location">At Harness · Bengaluru, India</p>
        <p className="profile-description">I work where software engineering meets security. Here I write through the tools, decisions, and details that make complex systems easier to understand.</p>
        <div className="profile-actions">
          <Button asChild className="profile-primary"><Link href="/blog"><BookOpen />Read the writing</Link></Button>
          <Button asChild variant="outline" className="profile-secondary"><a href="/Pankaj-Mouriya-Resume.pdf" download><ArrowDownToLine />Download CV</a></Button>
        </div>
        <a className="profile-connect" href="https://www.linkedin.com/in/pankajmouriya/" target="_blank" rel="noopener noreferrer">Let’s connect <ArrowUpRight size={16} /></a>
      </div>
      <SecurityTheater />
    </div>
    <div className="profile-skills" aria-label="Skills">
      <ul>{skills.map(({ name, icon: SkillIcon, tone }) => <li key={name}>
        <Badge variant="outline" className={`profile-skill skill-${tone}`}><SkillIcon aria-hidden="true" />{name}</Badge>
      </li>)}</ul>
      <Link href="/portfolio">Explore my work <ArrowUpRight size={16} /></Link>
    </div>
  </section>;
}
