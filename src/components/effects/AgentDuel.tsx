'use client';

import { useId, type CSSProperties } from 'react';

export type AgentStyle = 'pixel' | 'illustrated';

type AgentDuelProps = {
  variant?: AgentStyle;
  active?: boolean;
  startAt?: number;
};

/** One coordinated 14-second scene. Every layer shares a clock and pause state. */
export function AgentDuel({ variant = 'pixel', active = false, startAt = 0 }: AgentDuelProps) {
  const id = useId().replaceAll(':', '');
  const atlas = `/images/agents/sentinel-rogue-${variant}.webp`;
  return <div className={`agent-duel agent-duel-${variant}`} data-active={active}
    style={{ '--scene-delay': `${-startAt}s` } as CSSProperties}
    role="img" aria-label="A rogue AI emerges from a portal and launches a fragment. A green sentinel intercepts it with a shield and sends the rogue tumbling back.">
    <svg className="breach-stage" viewBox="0 0 480 520" fill="none" aria-hidden="true">
      <defs>
        <clipPath id={`${id}-cell`}><rect width="512" height="512" /></clipPath>
        <clipPath id={`${id}-rogue-cell`}><rect className="agent-rogue-crop" width="512" height="512" /></clipPath>
        <linearGradient id={`${id}-trail`} x1="340" y1="90" x2="210" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d87554" stopOpacity="0" /><stop offset="1" stopColor="#e69971" />
        </linearGradient>
      </defs>
      <g className="breach-perimeter" stroke="currentColor" strokeWidth=".8">
        <path d="M112 180v-16h16M352 180v-16h-16M112 422v16h16M352 422v16h-16" />
        <path className="breach-scan" d="M116 176h232" strokeDasharray="3 7" />
      </g>
      <g className="breach-portal" transform="translate(406 273)">
        <ellipse rx="23" ry="57" fill="#bc6449" fillOpacity=".06" stroke="#cb765d" strokeWidth="1.2" />
        <ellipse className="breach-portal-ring" rx="29" ry="65" stroke="#c97960" strokeWidth="1" strokeDasharray="22 9 4 15" />
        <path d="M-9-40 7-20-5 0 9 20-7 40" stroke="#df9875" strokeWidth="2" />
        <path d="M-35-26h10M24 18h16M-29 38h8" stroke="#c97960" strokeWidth="2" />
      </g>
      <path className="breach-attack-trail" d="M367 126Q298 54 217 109" stroke={`url(#${id}-trail)`} strokeWidth="2" strokeDasharray="180" />
      <path className="breach-return-trail" d="M222 109Q310 65 385 172" stroke="#80ba9c" strokeWidth="1.5" strokeDasharray="200" />
      <g className="breach-packet"><path d="m0-6 11 6L0 6-11 0Z" fill="#d37d59" /><path d="m-7 0 7-3 5 3-5 3Z" fill="#ffdfae" /></g>
      <g className="agent-unit agent-defender">
        <ellipse className="agent-ground" cx="64" cy="122" rx="29" ry="3" fill="#295b47" fillOpacity=".13" />
        <svg x="-8" y="-8" width="144" height="144" viewBox="0 0 512 512" overflow="hidden">
          <g clipPath={`url(#${id}-cell)`}><g className="agent-pose-sheet agent-defender-poses"><image href={atlas} width="1536" height="1024" /></g></g>
        </svg>
      </g>
      <g className="agent-unit agent-rogue">
        <svg x="-8" y="-8" width="144" height="144" viewBox="0 0 512 512" overflow="hidden">
          <g clipPath={`url(#${id}-rogue-cell)`}><g className="agent-pose-sheet agent-rogue-poses"><image href={atlas} y="-512" width="1536" height="1024" /></g></g>
        </svg>
      </g>
      <g className="breach-impact" transform="translate(223 111)">
        <circle className="breach-ripple" r="24" stroke="#85bc9c" strokeWidth="1.4" />
        <circle className="breach-ripple breach-ripple-outer" r="38" stroke="#85bc9c" strokeWidth=".7" />
        {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`rotate(${i * 45})`}><path className="breach-shard" d="M12 0h10" stroke={i % 2 ? '#d79068' : '#81b79b'} strokeWidth="2" /></g>)}
      </g>
      <g className="breach-verdict" transform="translate(246 85)">
        <path d="m0 1 3 3 6-7" stroke="currentColor" strokeWidth="1.5" />
        <text x="14" y="4" fill="currentColor">INTERCEPTED</text>
      </g>
      <g className="breach-patrol-label" transform="translate(33 432)" fill="currentColor">
        <circle r="2" /><text x="9" y="3">perimeter secured</text>
      </g>
    </svg>
  </div>;
}
