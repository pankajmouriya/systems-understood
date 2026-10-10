'use client';

import dynamic from 'next/dynamic';
import { FlowLines } from '@/components/effects/FlowLines';
import { useThreatAudio } from '@/components/effects/use-threat-audio';
import { AgentDuel } from '@/components/effects/AgentDuel';
import { SecurityStoryNav } from '@/components/effects/SecurityStoryNav';
import { useSceneVisibility, useSecurityStories } from '@/components/effects/use-security-stories';
import Image from 'next/image';
import { Component, useCallback, useRef, useState, type ReactNode } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

const IdCard = dynamic(() => import('@/components/ui/id-card'), { ssr: false });

class CardBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function PortraitLanyard() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);

  const { motion, visible } = useSceneVisibility(host);
  const animated = motion && !failed;
  const active = motion && visible && !paused && (ready || failed);
  const sound = useThreatAudio(active);
  const scene = useSecurityStories(active, sound.play);
  const phase = motion ? scene.phase : 'portrait';
  return <div ref={host} className="profile-lanyard" data-ready={animated && ready} data-flow-active={active} data-scene-active={active} data-phase={phase}>
    <FlowLines />
    <div className="security-story-header">
      <h3>{scene.story.title}</h3>
      <SecurityStoryNav index={scene.run.index} onSelect={i => scene.select(i)} />
      {motion && <button className="security-sound-toggle" type="button" aria-label={sound.enabled ? 'Mute scene sound' : 'Enable scene sound'} aria-pressed={sound.enabled} onClick={async () => { if (await sound.toggle()) { setPaused(false); scene.select(scene.run.index); } }}>{sound.enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}{sound.enabled ? 'Sound on' : 'Sound off'}</button>}
    </div>
    <div className="security-portrait" aria-hidden={phase === 'combat'}>
    <div className="profile-card-fallback" aria-hidden={animated && ready}>
      <span className="profile-cord" /><span className="profile-clip" />
      <div className="profile-photo"><Image src="/images/profile/pankaj-portrait.png" alt="Pankaj Mouriya" width={740} height={758} priority /><span>Pankaj Mouriya<small>Engineering · Security · Writing</small></span></div>
    </div>
    {animated && <div className="profile-canvas" role="img" aria-label="Animated portrait of Pankaj Mouriya on a draggable lanyard">
      <CardBoundary onFailure={onFailure}><IdCard frontImage="/images/profile/pankaj-portrait.png" active={visible && !paused && phase !== 'combat'} onReady={onReady} onFailure={onFailure} /></CardBoundary>
    </div>}
    </div>
    <AgentDuel key={scene.run.id} variant="illustrated" entranceFromName story={scene.story} active={active} startAt={scene.run.startAt} />
    {motion && <div className="profile-card-controls"><span>{phase === 'combat' ? 'Illustrative security story' : 'Drag the card'}</span>{phase === 'combat' && <button type="button" onClick={() => scene.select(scene.run.index, 18)}>Show photo</button>}<button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume scene animation' : 'Pause scene animation'}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? 'Resume' : 'Pause'}</button></div>}
  </div>;
}
