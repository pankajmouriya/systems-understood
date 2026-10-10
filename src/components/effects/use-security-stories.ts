'use client';

import { useEffect, useRef, useState } from 'react';
import { COMBAT_START, RECOVERY_START, SECURITY_STORIES, STORY_SECONDS, scenePhaseAt, type ScenePhase, type SignalMode, signalModeAt, securedAt } from './security-stories';

/** Boundary-only clock: CSS handles frames, React owns semantic scene state. */
export function useSecurityStories(active: boolean, onArrival?: () => void, motion = true) {
  const [run, setRun] = useState({ id: 0, index: 1, startAt: 0 });
  const [phase, setPhase] = useState<ScenePhase>('arrival');
  const [signal, setSignal] = useState<SignalMode>('idle');
  const pausedClock = useRef({ id: -1, elapsed: 0 });
  const arrival = useRef(onArrival);
  useEffect(() => { arrival.current = onArrival; }, [onArrival]);
  const [previousMotion, setPreviousMotion] = useState(motion);
  // A changed preference removes CSS animations: reset React's clock in the same render.
  if (motion !== previousMotion) {
    setPreviousMotion(motion);
    if (!motion) {
      setRun(r => ({ ...r, id: r.id + 1, startAt: 0 }));
      setPhase('arrival');
      setSignal('idle');
    }
  }
  useEffect(() => {
    if (!active) return;
    const base = pausedClock.current.id === run.id ? pausedClock.current.elapsed : run.startAt;
    const started = performance.now();
    const story = SECURITY_STORIES[run.index];
    const boundaries = [1.2, COMBAT_START, securedAt(story), RECOVERY_START, 18, STORY_SECONDS];
    let cursor = base;
    let timer: ReturnType<typeof setTimeout>;
    const elapsedNow = () => base + (performance.now() - started) / 1000;
    const schedule = () => {
      const next = boundaries.find(t => t > cursor) ?? STORY_SECONDS;
      timer = setTimeout(() => {
        // Catch up after a blocked main thread; never replay stale phase changes.
        const elapsed = Math.max(next, elapsedNow());
        if (elapsed >= STORY_SECONDS) {
          const cycles = Math.floor(elapsed / STORY_SECONDS);
          const startAt = elapsed % STORY_SECONDS;
          const index = (run.index + cycles) % SECURITY_STORIES.length;
          setPhase(scenePhaseAt(startAt));
          setSignal(signalModeAt(startAt, SECURITY_STORIES[index]));
          setRun(r => ({ id: r.id + 1, index, startAt }));
        } else {
          if (cursor < 1.2 && elapsed >= 1.2 && elapsed < 3) arrival.current?.();
          setPhase(scenePhaseAt(elapsed));
          setSignal(signalModeAt(elapsed, story));
          cursor = elapsed;
          schedule();
        }
      }, Math.max(0, (next - elapsedNow()) * 1000));
    };
    schedule();
    return () => {
      clearTimeout(timer);
      pausedClock.current = { id: run.id, elapsed: elapsedNow() };
    };
  }, [active, run.id, run.index, run.startAt]);

  function select(index: number, startAt = 0) {
    const safeTime = Math.max(0, Math.min(STORY_SECONDS - .01, startAt));
    const safeIndex = ((index % SECURITY_STORIES.length) + SECURITY_STORIES.length) % SECURITY_STORIES.length;
    setPhase(scenePhaseAt(safeTime));
    setSignal(signalModeAt(safeTime, SECURITY_STORIES[safeIndex]));
    setRun(r => ({ id: r.id + 1, index: safeIndex, startAt: safeTime }));
  }
  return { run, phase, signal, story: SECURITY_STORIES[run.index], select };
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
