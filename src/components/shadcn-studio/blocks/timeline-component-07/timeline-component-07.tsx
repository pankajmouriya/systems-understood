'use client';

import Image from 'next/image';
import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/utils';

export interface ExperienceStep {
  id: string;
  logo?: string;
  company: string;
  role: string;
  period: string;
  status?: { text: string; tone: 'positive' | 'accent' };
  stack: string[];
  achievement: string;
  description: string;
  details?: string[];
}

function ExperiencePanel({ step, direction, reduceMotion }: { step: ExperienceStep; direction: number; reduceMotion: boolean }) {
  return (
    <motion.article
      key={step.id}
      id={`experience-panel-${step.id}`}
      role="tabpanel"
      aria-labelledby={`experience-tab-${step.id}`}
      tabIndex={0}
      className="experience-panel"
      initial={reduceMotion ? false : { opacity: 0, x: direction * 24, filter: 'blur(3px)' }}
      animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      exit={reduceMotion ? undefined : { opacity: 0, x: direction * -14, filter: 'blur(2px)' }}
      transition={{ duration: reduceMotion ? 0 : 0.34, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="experience-panel-heading">
        <span className="experience-company-mark" aria-hidden="true">
          {step.logo ? <Image src={step.logo} alt="" width={44} height={44} /> : step.company.slice(0, 2).toUpperCase()}
        </span>
        <div><p className="experience-company">{step.company}</p><h3>{step.role}</h3></div>
        <p className="experience-period"><Icon name="calendar" />{step.period} {step.status && <span className={cn('experience-status', `experience-status-${step.status.tone}`)}>{step.status.text}</span>}</p>
      </div>

      <div className="experience-panel-body">
        <div>
          <p className="experience-description">{step.description}</p>
          <div className="experience-stack" aria-label="Areas of work">{step.stack.map((tech) => <Badge key={tech} variant="secondary" className="experience-stack-badge">{tech}</Badge>)}</div>
        </div>
        <div>
          <p className="experience-achievement"><Icon name="shield" />{step.achievement}</p>
          {step.details && step.details.length > 0 && <ul className="experience-details">{step.details.map((detail) => <li key={detail}>{detail}</li>)}</ul>}
        </div>
      </div>
    </motion.article>
  );
}

export default function Process({ data, className }: { data: ExperienceStep[]; className?: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const reduceMotion = useReducedMotion() ?? false;
  const active = data[activeIndex];
  const progress = data.length > 1 ? (activeIndex / (data.length - 1)) * 100 : 0;

  const select = (nextIndex: number, moveFocus = false) => {
    setDirection(nextIndex >= activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
    if (moveFocus) requestAnimationFrame(() => tabsRef.current[nextIndex]?.focus());
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % data.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + data.length) % data.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = data.length - 1;
    else return;
    event.preventDefault();
    select(next, true);
  };

  if (!active) return null;

  return (
    <section className={cn('experience-switcher', className)} aria-label="Career timeline">
      <p className="sr-only">Choose a company to read that role. Use the left and right arrow keys to move through the timeline.</p>
      <div className="experience-rail-shell">
        <div className="experience-rail" role="tablist" aria-label="Companies">
          <span className="experience-rail-base" aria-hidden="true"><span style={{ width: `${progress}%` }} /></span>
          {data.map((step, index) => (
            <button
              key={step.id}
              ref={(node) => { tabsRef.current[index] = node; }}
              id={`experience-tab-${step.id}`}
              role="tab"
              type="button"
              aria-selected={index === activeIndex}
              aria-controls={`experience-panel-${step.id}`}
              tabIndex={index === activeIndex ? 0 : -1}
              className="experience-milestone"
              onClick={() => select(index)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="experience-milestone-logo" aria-hidden="true">{step.logo ? <Image src={step.logo} alt="" width={36} height={36} /> : step.company.slice(0, 2).toUpperCase()}</span>
              <span className="experience-milestone-copy"><strong>{step.company}</strong><small>{step.period.replace(' — ', '–')}</small></span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <ExperiencePanel key={active.id} step={active} direction={direction} reduceMotion={reduceMotion} />
      </AnimatePresence>
    </section>
  );
}
