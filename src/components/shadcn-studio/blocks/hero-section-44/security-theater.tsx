'use client';

import { FlowLines } from '@/components/effects/FlowLines';
import { useThreatAudio } from '@/components/effects/use-threat-audio';
import { AgentDuel } from '@/components/effects/AgentDuel';
import { SecurityStoryNav } from '@/components/effects/SecurityStoryNav';
import { useSceneVisibility, useSecurityStories } from '@/components/effects/use-security-stories';
import { useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

export function SecurityTheater() {
  const host = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const { motion, visible } = useSceneVisibility(host);
  const active = motion && visible && !paused;
  const sound = useThreatAudio(active);
  const scene = useSecurityStories(active, sound.play, motion);
  const phase = motion ? scene.phase : 'arrival';
  return <div ref={host} className="profile-lanyard security-theater" data-flow-active={active} data-scene-active={active} data-phase={phase}>
    <FlowLines key={`flow-${scene.run.id}`} mode={motion ? scene.signal : 'idle'} />
    <div className="security-story-header">
      <h3>{scene.story.title}</h3>
      <SecurityStoryNav index={scene.run.index} onSelect={i => scene.select(i)} />
      {motion && <button className="security-sound-toggle" type="button" aria-label={sound.enabled ? 'Mute scene sound' : 'Enable scene sound'} aria-pressed={sound.enabled} onClick={async () => { if (await sound.toggle()) { setPaused(false); scene.select(scene.run.index); } }}>{sound.enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}{sound.enabled ? 'Sound on' : 'Sound off'}</button>}
    </div>
    <AgentDuel key={`agents-${scene.run.id}`} variant="illustrated" entranceFromName story={scene.story} signal={motion ? scene.signal : 'idle'} active={active} startAt={scene.run.startAt} />
    <div className="profile-card-controls"><span>Illustrative security story</span>{motion && <button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume scene animation' : 'Pause scene animation'}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? 'Resume' : 'Pause'}</button>}</div>
  </div>;
}
