import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AgentDuel } from '@/components/effects/AgentDuel';

export const metadata: Metadata = { title: 'AI agent animation study', robots: { index: false, follow: false } };

export default function AnimationStudyPage() {
  return <main id="main-content" className="agent-study-page">
    <Link className="agent-study-back" href="/">← Back to the homepage</Link>
    <h1>Two AI agents, two styles.</h1>
    <p>The homepage uses the pixel characters. This study shows how the same defender and rogue would look as clean illustrated figures. Both scenes stop moving when reduced motion is enabled.</p>
    <div className="agent-study-grid">
      {(['pixel', 'illustrated'] as const).map((variant) => <section className="agent-study-option" key={variant} aria-label={`${variant} AI agent style`}>
        <h2>{variant === 'pixel' ? 'Pixel agents · on the homepage' : 'Clean illustrated agents'}</h2>
        <p>A small defender and rogue approach, clash, and step apart.</p>
        <div className="agent-study-stage">
          <Image className="agent-study-photo" src="/images/profile/pankaj-portrait.png" alt="" width={176} height={208} />
          <AgentDuel variant={variant} active />
        </div>
      </section>)}
    </div>
  </main>;
}
