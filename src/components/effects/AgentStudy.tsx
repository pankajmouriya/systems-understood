'use client';

import { useRef, useState } from 'react';
import { useSceneVisibility, useSecurityStories } from './use-security-stories';
import { SecurityStoryNav } from './SecurityStoryNav';
import Image from 'next/image';
import { Pause, Play, RotateCcw, ArrowUpRight } from 'lucide-react';
import { AgentDuel, type AgentStyle } from './AgentDuel';

const moments = [
  { time: 5.4, name: 'Breach', detail: 'The rogue slips through a rift.' },
  { time: 9.1, name: 'Intercept', detail: 'The sentinel meets the incoming fragment.' },
  { time: 13, name: 'Repel', detail: 'The defense contains the attack.' },
  { time: 19, name: 'All clear', detail: 'A small victory. Back on watch.' },
];

export function AgentStudy() {
  const [variant, setVariant] = useState<AgentStyle>('illustrated');
  const [playing, setPlaying] = useState(true);
  const host = useRef<HTMLDivElement>(null);
  const { motion, visible } = useSceneVisibility(host);
  const active = playing && motion && visible;
  const scene = useSecurityStories(active);
  function seek(time: number) { setPlaying(false); scene.select(scene.run.index, time); }
  function replay() { scene.select(scene.run.index); setPlaying(true); }
  return <div className="agent-study-composition">
    <div className="agent-study-theater">
      <div ref={host} className="agent-study-stage" data-phase={motion ? scene.phase : 'portrait'} data-scene-active={active}>
        <div className="security-story-header"><h3>{scene.story.title}</h3></div>
        <div className="security-portrait" aria-hidden={motion && scene.phase === 'combat'}>
        <div className="agent-study-cord" />
        <div className="agent-study-photo"><span className="agent-study-clip" /><Image src="/images/profile/pankaj-portrait.png" alt="Pankaj Mouriya" width={740} height={758} priority /></div>
        </div>
        <AgentDuel key={scene.run.id} variant={variant} story={scene.story} active={active} startAt={scene.run.startAt} />
      </div>
      <div className="agent-study-playback">
        <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause scene' : 'Play scene'}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={replay}><RotateCcw size={15} />Replay</button>
        <span>24 seconds · illustrative story</span>
      </div>
    </div>
    <aside className="agent-study-director">
      <h2>Four attacks.{' '}<br />Four defenses.</h2>
      <div className="agent-study-story">
        <SecurityStoryNav index={scene.run.index} onSelect={i => { scene.select(i); setPlaying(true); }} />
        <p>{scene.story.detail}</p>
        <a href={scene.story.source} target="_blank" rel="noreferrer">Read about the defense ↗</a>
      </div>
      <div className="agent-style-switch" role="group" aria-label="Character art style">
        <button type="button" aria-pressed={variant === 'pixel'} onClick={() => setVariant('pixel')}>Pixel art</button>
        <button type="button" aria-pressed={variant === 'illustrated'} onClick={() => setVariant('illustrated')}>Illustrated</button>
      </div>
      <p>{variant === 'pixel' ? 'Armored silhouettes, sharp pixel edges, a scarf caught in the action.' : 'Smooth contours and expressive capes, with the same choreography.'}</p>
      <div className="agent-study-moments">
        {moments.map(moment => <button key={moment.name} type="button" onClick={() => seek(moment.time)} aria-pressed={!playing && scene.run.startAt === moment.time}>
          <span>{moment.name}<ArrowUpRight size={15} /></span><small>{moment.detail}</small>
        </button>)}
      </div>
      <p className="agent-study-note">Choose a moment to hold the scene. Reduced motion keeps the portrait visible. These are illustrative scenarios, not this website’s infrastructure.</p>
    </aside>
  </div>;
}
