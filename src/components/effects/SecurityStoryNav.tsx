'use client';

import { ShieldCheck, BrainCircuit, PackageCheck, TerminalSquare } from 'lucide-react';
import { SECURITY_STORIES } from './security-stories';
const icons = [ShieldCheck, BrainCircuit, PackageCheck, TerminalSquare];
export function SecurityStoryNav({ index, onSelect }: { index: number; onSelect: (index: number) => void }) {
  return <div className="security-story-nav" role="group" aria-label="Security stories">
    {SECURITY_STORIES.map((story, i) => {
      const Icon = icons[i];
      return <button key={story.id} type="button" aria-label={story.title} aria-pressed={i === index} onClick={() => onSelect(i)} title={story.title}>
        <Icon size={15} aria-hidden="true" /><span>{['SQLi', 'AI', 'Supply chain', 'RCE'][i]}</span>
      </button>;
    })}
  </div>;
}
