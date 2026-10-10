'use client';

import { useEffect, useRef, useState } from 'react';
import { COMBAT_START, PORTRAIT_RETURN, SECURITY_STORIES, STORY_SECONDS, scenePhaseAt, type ScenePhase } from './security-stories';

/** Three phase changes and one story change per cycle; no animation-frame React updates. */
export function useSecurityStories(active: boolean) {
  const [run, setRun] = useState({ id: 0, index: 0, startAt: 0 });
  const [phase, setPhase] = useState<ScenePhase>('portrait');
  const pausedClock = useRef({ id: -1, elapsed: 0 });
  useEffect(() => {
    if (!active) return;
    const base = pausedClock.current.id === run.id ? pausedClock.current.elapsed : run.startAt;
    const started = performance.now();
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      const elapsed = base + (performance.now() - started) / 1000;
      const next = [COMBAT_START, PORTRAIT_RETURN, 18, STORY_SECONDS].find(t => t > elapsed + .002) ?? STORY_SECONDS;
      timer = setTimeout(() => {
        if (next === STORY_SECONDS) {
          setPhase('portrait');
          setRun(r => ({ id: r.id + 1, index: (r.index + 1) % SECURITY_STORIES.length, startAt: 0 }));
        } else {
          setPhase(scenePhaseAt(next));
          schedule();
        }
      }, Math.max(0, (next - elapsed) * 1000));
    };
    schedule();
    return () => {
      clearTimeout(timer);
      pausedClock.current = { id: run.id, elapsed: Math.min(STORY_SECONDS, base + (performance.now() - started) / 1000) };
    };
  }, [active, run.id, run.startAt]);

  function select(index: number, startAt = 0) {
    const safeTime = Math.max(0, Math.min(STORY_SECONDS - .01, startAt));
    setPhase(scenePhaseAt(safeTime));
    setRun(r => ({ id: r.id + 1, index: ((index % SECURITY_STORIES.length) + SECURITY_STORIES.length) % SECURITY_STORIES.length, startAt: safeTime }));
  }
  return { run, phase, story: SECURITY_STORIES[run.index], select };
}

export function useSceneVisibility(ref: { current: HTMLElement | null }) {
  const [visible, setVisible] = useState(true);
  const [motion, setMotion] = useState(false);
  useEffect(() => {
    let inView = true;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { setMotion(!media.matches); setVisible(inView && !document.hidden); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); });
    if (ref.current) observer.observe(ref.current);
    media.addEventListener('change', update);
    document.addEventListener('visibilitychange', update);
    update();
    return () => { observer.disconnect(); media.removeEventListener('change', update); document.removeEventListener('visibilitychange', update); };
  }, [ref]);
  return { visible, motion };
}
