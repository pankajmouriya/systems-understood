'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Pause, Play } from 'lucide-react';

const IdCard = dynamic(() => import('@/components/ui/id-card'), { ssr: false });

class CardBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function PortraitLanyard() {
  const host = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setFailed(true), []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(!media.matches);
    update();
    media.addEventListener('change', update);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (host.current) observer.observe(host.current);
    return () => { media.removeEventListener('change', update); observer.disconnect(); };
  }, []);

  const animated = enabled && !failed;
  return <div ref={host} className="profile-lanyard" data-ready={animated && ready}>
    <div className="profile-card-fallback" aria-hidden={animated && ready}>
      <span className="profile-cord" /><span className="profile-clip" />
      <div className="profile-photo"><Image src="/images/profile/pankaj-portrait.png" alt="Pankaj Mouriya" width={740} height={758} priority /><span>Pankaj Mouriya<small>Engineering · Security · Writing</small></span></div>
    </div>
    {animated && <div className="profile-canvas" role="img" aria-label="Animated portrait of Pankaj Mouriya on a draggable lanyard">
      <CardBoundary onFailure={onFailure}><IdCard frontImage="/images/profile/pankaj-portrait.png" active={visible && !paused} onReady={onReady} onFailure={onFailure} /></CardBoundary>
    </div>}
    {animated && ready && <div className="profile-card-controls"><span>Drag the card</span><button type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume card animation' : 'Pause card animation'}>{paused ? <Play size={14} /> : <Pause size={14} />}{paused ? 'Resume' : 'Pause'}</button></div>}
  </div>;
}
