'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { cn } from '@/lib/utils';

export interface TimelineAnimateEntry {
  index: string;
  content: ReactNode;
}

interface TimelineAnimateProps {
  data: TimelineAnimateEntry[];
  className?: string;
}

function TimelineAnimateRow({ index, content }: TimelineAnimateEntry) {
  const rowRef = useRef<HTMLLIElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start 90%', 'start 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.5 });
  const opacity = useTransform(progress, [0, 1], [0.85, 1]);
  const y = useTransform(progress, [0, 1], [12, 0]);

  return (
    <li ref={rowRef} className="timeline-animate-row">
      <motion.span className="timeline-animate-index" style={reduceMotion ? undefined : { opacity, y }} aria-hidden="true">{index}</motion.span>
      <motion.div className="timeline-animate-content" style={reduceMotion ? undefined : { opacity, y }}>{content}</motion.div>
    </li>
  );
}

export function TimelineAnimate({ data, className }: TimelineAnimateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 80%', 'end 65%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 95, damping: 27, mass: 0.65 });

  return (
    <div ref={containerRef} className={cn('timeline-animate', className)}>
      <div className="timeline-animate-track" aria-hidden="true">
        <motion.div className="timeline-animate-progress" style={reduceMotion ? undefined : { scaleY: progress }} />
      </div>
      <ol className="timeline-animate-list">
        {data.map((item) => <TimelineAnimateRow key={item.index} {...item} />)}
      </ol>
    </div>
  );
}
