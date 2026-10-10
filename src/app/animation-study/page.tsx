import type { Metadata } from 'next';
import Link from 'next/link';
import { AgentStudy } from '@/components/effects/AgentStudy';

export const metadata: Metadata = { title: 'The breach — an animation study', robots: { index: false, follow: false } };

export default function AnimationStudyPage() {
  return <main id="main-content" className="agent-study-page">
    <Link className="agent-study-back" href="/">← Back to the homepage</Link>
    <h1>A little trouble at the perimeter.</h1>
    <p>A rogue finds a way in. A sentinel is already watching.</p>
    <AgentStudy />
  </main>;
}
