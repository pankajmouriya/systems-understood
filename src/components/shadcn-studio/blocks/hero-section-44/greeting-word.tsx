'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Pause, Play } from 'lucide-react';
import { useSceneVisibility } from '@/components/effects/use-security-stories';
import { Badge } from '@/components/ui/badge';

const GREETINGS = [
  { word: 'Hello', lang: 'en' },
  { word: 'नमस्ते', lang: 'hi' },
  { word: '你好', lang: 'zh' },
  { word: 'Ciao', lang: 'it' },
];

// Adapted from Hero 44; reserve the widest word to prevent layout shifts.
export function HeroGreeting() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const { motion: allowMotion, visible } = useSceneVisibility(heading);
  const reduced = !allowMotion;
  useEffect(() => {
    if (paused || reduced || !visible) return;
    const timer = setInterval(() => setIndex(value => (value + 1) % GREETINGS.length), 2200);
    return () => clearInterval(timer);
  }, [paused, reduced, visible]);
  const greeting = GREETINGS[reduced ? 0 : index];
  return <>
    <div className="profile-status-row">
      <Badge variant="outline" className="profile-available"><span aria-hidden="true" />Available</Badge>
      {!reduced && <button className="profile-greeting-toggle" type="button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Resume greeting animation' : 'Pause greeting animation'} title={paused ? 'Resume greeting' : 'Pause greeting'}>{paused ? <Play size={13} /> : <Pause size={13} />}</button>}
    </div>
    <h1 ref={heading} id="home-title" aria-label="Hello, I’m Pankaj Mouriya">
      <span className="profile-hello" aria-hidden="true">
        <span className="profile-greeting-word">
          {GREETINGS.map(({ word, lang }) => <span className="profile-greeting-sizer" key={word} lang={lang}>{word}</span>)}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={greeting.word} lang={greeting.lang} className="profile-greeting-current" initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '-100%', opacity: 0 }} transition={{ duration: reduced ? 0 : .5, ease: 'easeInOut' }}>{greeting.word}</motion.span>
          </AnimatePresence>
        </span> I’m
      </span>
      Pankaj <span id="guardian-name-anchor">Mouriya</span><span className="profile-period">.</span>
    </h1>
  </>;
}
