'use client';

import { useId, type CSSProperties } from 'react';
import { SECURITY_STORIES, type SecurityStory } from './security-stories';

export type AgentStyle = 'pixel' | 'illustrated';

type AgentDuelProps = {
  variant?: AgentStyle;
  active?: boolean;
  startAt?: number;
  story?: SecurityStory;
};

/** One coordinated scene. Every layer shares its clock, story, and pause state. */
export function AgentDuel({ variant = 'illustrated', active = false, startAt = 0, story = SECURITY_STORIES[0] }: AgentDuelProps) {
  const id = useId().replaceAll(':', '');
  const atlas = `/images/agents/sentinel-rogue-${variant}.webp`;
  return <div className={`agent-duel agent-duel-${variant}`} data-active={active} data-story={story.id}
    style={{ '--scene-delay': `${-startAt}s` } as CSSProperties}
    role="img" aria-label={`Illustrative security story: ${story.title}. ${story.detail}`}>
    <svg className="breach-stage" viewBox="0 0 480 520" fill="none" aria-hidden="true">
      <defs>
        <clipPath id={`${id}-cell`}><rect width="512" height="512" /></clipPath>
        <clipPath id={`${id}-rogue-cell`}><rect className="agent-rogue-crop" width="512" height="512" /></clipPath>
        <linearGradient id={`${id}-trail`} x1="340" y1="90" x2="210" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d87554" stopOpacity="0" /><stop offset="1" stopColor="#e69971" />
        </linearGradient>
      </defs>
      <g className="breach-perimeter" stroke="currentColor" strokeWidth=".8">
        <path d="M148 245v-12h12M332 245v-12h-12M148 440v12h12M332 440v12h-12" />
        <path className="breach-scan" d="M152 241h176" strokeDasharray="3 7" />
      </g>
      <g className="breach-portal" transform="translate(406 273)">
        <ellipse rx="23" ry="57" fill="#bc6449" fillOpacity=".06" stroke="#cb765d" strokeWidth="1.2" />
        <ellipse className="breach-portal-ring" rx="29" ry="65" stroke="#c97960" strokeWidth="1" strokeDasharray="22 9 4 15" />
        <path d="M-9-40 7-20-5 0 9 20-7 40" stroke="#df9875" strokeWidth="2" />
        <path d="M-35-26h10M24 18h16M-29 38h8" stroke="#c97960" strokeWidth="2" />
      </g>
      <path className="breach-attack-trail" d="M367 190Q273 101 161 174" stroke={`url(#${id}-trail)`} strokeWidth="2" strokeDasharray="180" />
      <path className="breach-return-trail" d="M161 174Q287 98 385 222" stroke="#80ba9c" strokeWidth="1.5" strokeDasharray="200" />
      <g className="breach-packet"><path d="m0-6 11 6L0 6-11 0Z" fill="#d37d59" /><path d="m-7 0 7-3 5 3-5 3Z" fill="#ffdfae" /><text x="0" y="-13" textAnchor="middle" fill="currentColor">{story.id === 'sqli' ? 'SQLi' : story.id === 'prompt' ? 'prompt' : story.id === 'supply' ? 'pkg' : '>_'}</text></g>
      <g className="story-attack-tag" transform="translate(355 120)">
        <text textAnchor="middle" fill="currentColor">{story.attack}</text>
      </g>
      <StoryMechanism story={story} />
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
      <g className="breach-impact" transform="translate(161 174)">
        <circle className="breach-ripple" r="24" stroke="#85bc9c" strokeWidth="1.4" />
        <circle className="breach-ripple breach-ripple-outer" r="38" stroke="#85bc9c" strokeWidth=".7" />
        {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`rotate(${i * 45})`}><path className="breach-shard" d="M12 0h10" stroke={i % 2 ? '#d79068' : '#81b79b'} strokeWidth="2" /></g>)}
      </g>
      <g className="breach-verdict" transform="translate(165 105)">
        <path d="m0 1 3 3 6-7" stroke="currentColor" strokeWidth="1.5" />
        <text x="14" y="4" fill="currentColor">{story.result.toUpperCase()}</text>
      </g>
      <g className="breach-patrol-label" transform="translate(52 475)" fill="currentColor">
        <circle r="2" /><text x="9" y="3">perimeter secured</text>
      </g>
    </svg>
  </div>;
}

function StoryMechanism({ story }: { story: SecurityStory }) {
  return <g className="story-mechanism" transform="translate(140 256)" stroke="currentColor" color="var(--teal)">
    {story.id === 'sqli' && <g>
      <path d="M0 25h52m96 0h52" strokeDasharray="4 5" />
      {[68, 91, 114].map(x => <rect className="story-wall" key={x} x={x} y="-8" width="16" height="68" rx="3" fill="currentColor" fillOpacity=".12" />)}
      <path d="m84 26 10 10 22-25" strokeWidth="2" />
      <text x="100" y="82" textAnchor="middle" stroke="none" fill="currentColor">SQLi rule matched</text>
    </g>}
    {story.id === 'prompt' && <g>
      <rect x="4" y="-4" width="55" height="57" rx="5" fill="currentColor" fillOpacity=".04" />
      <path d="M16 9h30M16 19h24M16 29h28M16 39h16M68 25h19M100-18v87" strokeDasharray="4 4" />
      <rect x="139" y="17" width="35" height="29" rx="4" fill="currentColor" fillOpacity=".12" />
      <path d="M147 17V8a10 10 0 0 1 20 0v9M156 29v6" strokeWidth="2" />
      <text x="30" y="82" textAnchor="middle" stroke="none" fill="currentColor">Untrusted input</text>
      <text x="158" y="82" textAnchor="middle" stroke="none" fill="currentColor">Tools locked</text>
    </g>}
    {story.id === 'supply' && <g>
      <path d="m9 4 23-12 23 12v33L32 49 9 37Zm0 0 23 13L55 4M32 17v32M64 23h23M123 23h25" />
      <circle cx="105" cy="23" r="18" fill="currentColor" fillOpacity=".07" />
      <path d="m98 16 14 14m0-14-14 14" stroke="var(--accent)" strokeWidth="2" />
      <rect x="158" y="2" width="38" height="43" rx="3" strokeDasharray="3 4" />
      <text x="100" y="82" textAnchor="middle" stroke="none" fill="currentColor">Signature required to deploy</text>
    </g>}
    {story.id === 'rce' && <g>
      <path d="M0 24h29M29-9v66" strokeDasharray="4 4" opacity=".5" />
      <rect x="67" y="-3" width="70" height="56" rx="5" fill="currentColor" fillOpacity=".06" />
      <path d="m81 11 10 10-10 10m17 0h16" strokeWidth="2" />
      <text className="story-runtime-alert" x="100" y="-29" textAnchor="middle" stroke="none" fill="var(--accent)">Falco: suspicious shell</text>
      <path className="story-containment" d="M53 2v-18h19M151 2v-18h-19M53 46v18h19M151 46v18h-19" strokeWidth="2" />
      <text x="100" y="82" textAnchor="middle" stroke="none" fill="currentColor">Detect → respond → isolate</text>
    </g>}
    <text className="story-tool-name" x="100" y="113" textAnchor="middle" stroke="none" fill="currentColor">{story.tool}</text>
    <text className="story-tool-layer" x="100" y="134" textAnchor="middle" stroke="none" fill="currentColor">{story.layer}</text>
  </g>;
}
