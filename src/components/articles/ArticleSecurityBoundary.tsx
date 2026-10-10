'use client';

import { useId, useRef, useState, type CSSProperties } from 'react';
import { Pause, Play, RotateCcw, ShieldCheck, Crosshair } from 'lucide-react';
import { useSceneVisibility } from '@/components/effects/use-security-stories';
import { securityTopics, type SecurityTopic } from './security-topics';

/** A finite, silent title illustration. Labels stay still while packets meet the boundary. */
export function ArticleSecurityBoundary({ topic }: { topic: SecurityTopic }) {
  const host = useRef<HTMLElement>(null);
  const { visible, motion } = useSceneVisibility(host);
  const [paused, setPaused] = useState(false);
  const [finished, setFinished] = useState(false);
  const [run, setRun] = useState(0);
  const clip = useId().replaceAll(':', '');
  const data = securityTopics[topic];
  const active = motion && visible && !paused && !finished;
  return <figure ref={host} className="article-boundary" data-topic={topic} data-active={active} data-pattern={data.motion} aria-label={`${data.name}: illustrative defense layers and threats`}>
    <div className="boundary-heading"><ShieldCheck size={15} /><span>{data.name}</span></div>
    <div className="boundary-field" key={run}>
      <div className="boundary-ring" aria-hidden="true" />
      <div className="boundary-pulse" aria-hidden="true" onAnimationEnd={() => setFinished(true)} />
      <svg className="boundary-guardian" viewBox="0 0 512 512" role="img" aria-label="Green guardian holding a shield">
        <defs><clipPath id={clip}><rect width="512" height="512" /></clipPath></defs>
        <g clipPath={`url(#${clip})`}><image href="/images/agents/sentinel-rogue-illustrated.webp" x="-512" width="1536" height="1024" /></g>
      </svg>
      <ul className="boundary-controls" aria-label="Defense layers">{data.controls.map((label, index) => <li key={label} style={{ '--slot': index } as CSSProperties}>{label}</li>)}</ul>
      <ul className="boundary-threats" aria-label="Threats outside the boundary">{data.threats.map((label, index) => <li key={label} style={{ '--threat': index } as CSSProperties}><Crosshair size={11} aria-hidden="true" />{label}<span className="boundary-packet" aria-hidden="true" /></li>)}</ul>
    </div>
    <figcaption><span>Defense in depth · illustrative</span>{motion && <button type="button" aria-label={finished ? 'Replay security illustration' : paused ? 'Play security illustration' : 'Pause security illustration'} onClick={() => { if (finished) { setRun(value => value + 1); setFinished(false); setPaused(false); } else setPaused(!paused); }}>{finished ? <RotateCcw size={13} /> : paused ? <Play size={13} /> : <Pause size={13} />}{finished ? 'Replay' : paused ? 'Play' : 'Pause'}</button>}</figcaption>
    <details className="boundary-context"><summary>About these layers</summary><p>{data.note}</p><div>{data.sources.map((source, index) => <a key={source} href={source} target="_blank" rel="noreferrer">Reference {index + 1} ↗</a>)}</div></details>
  </figure>;
}
