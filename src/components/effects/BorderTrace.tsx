'use client';

import { useRef } from 'react';
import { useSceneVisibility } from './use-security-stories';

/** A finite pair of hairline highlights; the containing surface owns layout. */
export function BorderTrace() {
  const ref = useRef<HTMLSpanElement>(null);
  const { motion, visible } = useSceneVisibility(ref);
  return <span ref={ref} className="border-trace" data-active={motion && visible} aria-hidden="true">
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" fill="none"><rect className="border-trace-ink" x=".15" y=".15" width="99.7" height="99.7" rx="1" pathLength="100" /><rect className="border-trace-accent" x=".15" y=".15" width="99.7" height="99.7" rx="1" pathLength="100" /></svg>
  </span>;
}
