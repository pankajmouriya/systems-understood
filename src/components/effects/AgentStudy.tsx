'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Pause, Play, RotateCcw, ArrowUpRight } from 'lucide-react';
import { AgentDuel, type AgentStyle } from './AgentDuel';

const moments = [
  { time: 1.6, name: 'Breach', detail: 'The rogue slips through a rift.' },
  { time: 5.3, name: 'Intercept', detail: 'The sentinel meets the incoming fragment.' },
  { time: 7.5, name: 'Repel', detail: 'The shield sends it back to the sender.' },
  { time: 10.1, name: 'All clear', detail: 'A small victory. Back on watch.' },
];

export function AgentStudy() {
  const [variant, setVariant] = useState<AgentStyle>('pixel');
  const [playing, setPlaying] = useState(true);
  const [startAt, setStartAt] = useState(0);
  const [take, setTake] = useState(0);
  function seek(time: number) { setStartAt(time); setPlaying(false); setTake(take + 1); }
  function replay() { setStartAt(0); setPlaying(true); setTake(take + 1); }
  return <div className="agent-study-composition">
    <div className="agent-study-theater">
      <div className="agent-study-stage">
        <div className="agent-study-cord" />
        <div className="agent-study-photo"><span className="agent-study-clip" /><Image src="/images/profile/pankaj-portrait.png" alt="Pankaj Mouriya" width={740} height={758} priority /></div>
        <AgentDuel key={take} variant={variant} active={playing} startAt={startAt} />
      </div>
      <div className="agent-study-playback">
        <button type="button" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Pause scene' : 'Play scene'}>{playing ? <Pause size={15} /> : <Play size={15} />}{playing ? 'Pause' : 'Play'}</button>
        <button type="button" onClick={replay}><RotateCcw size={15} />Replay</button>
        <span>14 seconds · a tiny security incident</span>
      </div>
    </div>
    <aside className="agent-study-director">
      <h2>Same story.{' '}<br />Two art styles.</h2>
      <div className="agent-style-switch" role="group" aria-label="Character art style">
        <button type="button" aria-pressed={variant === 'pixel'} onClick={() => setVariant('pixel')}>Pixel art</button>
        <button type="button" aria-pressed={variant === 'illustrated'} onClick={() => setVariant('illustrated')}>Illustrated</button>
      </div>
      <p>{variant === 'pixel' ? 'Armored silhouettes, sharp pixel edges, a scarf caught in the action.' : 'Smooth contours and expressive capes, with the same choreography.'}</p>
      <div className="agent-study-moments">
        {moments.map(moment => <button key={moment.name} type="button" onClick={() => seek(moment.time)} aria-pressed={!playing && startAt === moment.time}>
          <span>{moment.name}<ArrowUpRight size={15} /></span><small>{moment.detail}</small>
        </button>)}
      </div>
      <p className="agent-study-note">Choose a moment to hold the scene. Reduced motion shows a still composition.</p>
    </aside>
  </div>;
}
