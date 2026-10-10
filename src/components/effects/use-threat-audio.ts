'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** A quiet, descending dissonant cue, synthesized only after an explicit gesture. */
export function useThreatAudio(active: boolean) {
  const context = useRef<AudioContext | null>(null);
  const voices = useRef<OscillatorNode[]>([]);
  const [enabled, setEnabled] = useState(false);
  const stop = useCallback(() => {
    voices.current.forEach(voice => { try { voice.stop(); } catch { /* already ended */ } });
    voices.current = [];
  }, []);
  useEffect(() => {
    if (!active || !enabled) { stop(); void context.current?.suspend(); }
    else if (context.current) void context.current.resume().catch(() => {});
  }, [active, enabled, stop]);
  useEffect(() => () => { stop(); void context.current?.close(); }, [stop]);
  const play = useCallback(() => {
    const ctx = context.current;
    if (!enabled || !active || !ctx || ctx.state !== 'running') return;
    stop();
    const gain = ctx.createGain();
    gain.connect(ctx.destination);
    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.025, now + .04);
    gain.gain.exponentialRampToValueAtTime(.0001, now + .6);
    [146, 155].forEach(frequency => {
      const voice = ctx.createOscillator();
      voice.type = 'triangle';
      voice.frequency.setValueAtTime(frequency, now);
      voice.frequency.exponentialRampToValueAtTime(frequency * .48, now + .6);
      voice.connect(gain);
      voice.onended = () => { voice.disconnect(); gain.disconnect(); };
      voice.start(now);
      voice.stop(now + .62);
      voices.current.push(voice);
    });
  }, [active, enabled, stop]);
  async function toggle() {
    if (enabled) { stop(); setEnabled(false); return false; }
    try {
      context.current ??= new AudioContext();
      await context.current.resume();
      setEnabled(true);
      return true;
    } catch { return false; }
  }
  return { enabled, toggle, play };
}
