import Link from 'next/link';
import { HeroGreeting } from './greeting-word';
import { ArrowDownToLine, ArrowUpRight, BookOpen, Boxes, ShieldCheck, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PortraitLanyard } from './portrait-lanyard';

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
    <div className="profile-topics" aria-label="Writing interests">
      <span><ShieldCheck />Application security</span><span><Boxes />Cloud &amp; Kubernetes</span><span><Terminal />Software systems</span><Link href="/portfolio">Explore my work <ArrowUpRight /></Link>
    </div>
  </section>;
}
