type AgentDuelProps = {
  variant?: 'pixel' | 'illustrated';
  active?: boolean;
};

function PixelAgent({ side }: { side: 'defender' | 'rogue' }) {
  return <svg viewBox="0 0 36 36" shapeRendering="crispEdges" aria-hidden="true">
    <rect x="15" y="2" width="6" height="4" fill="var(--agent-glow)" />
    <rect x="12" y="6" width="12" height="3" fill="var(--agent-dark)" />
    {side === 'rogue' && <><rect x="7" y="5" width="4" height="5" fill="var(--agent-dark)" /><rect x="25" y="5" width="4" height="5" fill="var(--agent-dark)" /></>}
    <rect x="8" y="9" width="20" height="15" fill="var(--agent-dark)" />
    <rect x="10" y="10" width="16" height="12" fill="var(--agent-shell)" />
    <rect x="11" y="14" width="14" height="5" fill="var(--agent-dark)" />
    <rect x="13" y="15" width="10" height="2" fill="var(--agent-glow)" />
    <rect x="5" y="21" width="26" height="8" fill="var(--agent-dark)" />
    <rect x="9" y="22" width="18" height="7" fill="var(--agent-shell)" />
    <rect x="15" y="23" width="6" height="4" fill="var(--agent-glow)" />
    <rect x="4" y="20" width="5" height="8" fill="var(--agent-shell)" />
    <rect x="27" y="20" width="5" height="8" fill="var(--agent-shell)" />
    <rect x="11" y="29" width="5" height="5" fill="var(--agent-dark)" />
    <rect x="20" y="29" width="5" height="5" fill="var(--agent-dark)" />
    <rect x="9" y="33" width="8" height="2" fill="var(--agent-shell)" />
    <rect x="19" y="33" width="8" height="2" fill="var(--agent-shell)" />
  </svg>;
}

function IllustratedAgent({ side }: { side: 'defender' | 'rogue' }) {
  return <svg viewBox="0 0 64 68" fill="none" aria-hidden="true">
    <path d="M32 8V16" stroke="var(--agent-dark)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="7" r="3.5" fill="var(--agent-glow)" />
    <path d="M19 43 12 52M45 43l7 9" stroke="var(--agent-dark)" strokeWidth="5" strokeLinecap="round" />
    <rect x="17" y="36" width="30" height="25" rx="10" fill="var(--agent-shell)" stroke="var(--agent-dark)" strokeWidth="2" />
    <rect x="14" y="15" width="36" height="31" rx="13" fill="var(--agent-shell)" stroke="var(--agent-dark)" strokeWidth="2" />
    <rect x="19" y="25" width="26" height="12" rx="6" fill="var(--agent-dark)" />
    <circle cx="26" cy="31" r="2.7" fill="var(--agent-glow)" />
    <circle cx="38" cy="31" r="2.7" fill="var(--agent-glow)" />
    {side === 'defender' ? <path d="m28 51 3 3 6-7" stroke="var(--agent-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> : <path d="m29 48 6 6m0-6-6 6" stroke="var(--agent-dark)" strokeWidth="2.5" strokeLinecap="round" />}
    <path d="M24 60v4m16-4v4" stroke="var(--agent-dark)" strokeWidth="4" strokeLinecap="round" />
  </svg>;
}

export function AgentDuel({ variant = 'pixel', active = false }: AgentDuelProps) {
  const Agent = variant === 'pixel' ? PixelAgent : IllustratedAgent;
  return <div className={`agent-duel agent-duel-${variant}`} data-active={active} role="img" aria-label="A defender AI agent and a rogue AI agent clash beside the portrait">
    <span className="agent-unit agent-defender" aria-hidden="true"><Agent side="defender" /></span>
    <span className="agent-unit agent-rogue" aria-hidden="true"><Agent side="rogue" /></span>
    <span className="agent-clash" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M12 1 14 8 22 5 17 12 23 15 15 16 12 23 9 16 1 19 7 12 2 7 10 8Z" fill="currentColor" /></svg></span>
  </div>;
}
