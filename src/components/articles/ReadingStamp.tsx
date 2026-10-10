'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { BookOpenCheck } from 'lucide-react';

const REQUIRED_MS = 120_000;

/** Foreground time + article end. Only the earned flag persists, in this tab's session. */
export function ReadingStamp({ slug }: { slug: string }) {
  const end = useRef<HTMLDivElement>(null);
  const [earned, setEarned] = useState(false);
  const ring = useId().replaceAll(':', '');
  useEffect(() => {
    let alive = true;
    let elapsed = 0;
    let reachedEnd = false;
    let endVisible = false;
    let awarded = false;
    let started: number | null = document.hidden ? null : performance.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    const key = `reading-stamp:${slug}`;
    const award = () => {
      if (!alive || awarded || !reachedEnd || elapsed < REQUIRED_MS) return;
      awarded = true;
      setEarned(true);
      try { sessionStorage.setItem(key, 'earned'); } catch { /* Storage is optional. */ }
    };
    const account = () => {
      if (started !== null) elapsed += performance.now() - started;
      started = document.hidden ? null : performance.now();
    };
    const schedule = () => {
      clearTimeout(timer);
      if (started !== null && elapsed < REQUIRED_MS) timer = setTimeout(() => { account(); award(); schedule(); }, Math.max(1, REQUIRED_MS - elapsed));
    };
    const visibility = () => {
      if (!document.hidden && endVisible) reachedEnd = true;
      account(); award(); schedule();
    };
    const observer = new IntersectionObserver(([entry]) => {
      endVisible = entry.isIntersecting;
      if (endVisible && !document.hidden) { reachedEnd = true; account(); award(); }
    }, { threshold: 0 });
    if (end.current) observer.observe(end.current);
    document.addEventListener('visibilitychange', visibility);
    // Resolve storage after mount without affecting the server-rendered layout.
    const restore = setTimeout(() => {
      try { if (sessionStorage.getItem(key) === 'earned') { awarded = true; setEarned(true); } } catch { /* Continue in-memory. */ }
    }, 0);
    schedule();
    return () => { alive = false; clearTimeout(timer); clearTimeout(restore); observer.disconnect(); document.removeEventListener('visibilitychange', visibility); };
  }, [slug]);
  return <div className="reading-finish" data-earned={earned}>
    <div ref={end} className="reading-end-marker" aria-hidden="true" />
    <div role="status" aria-live="polite" className="reading-stamp-status">
      {earned && <div className="reading-reward">
        <div className="reading-stamp" aria-hidden="true">
          <svg viewBox="0 0 180 180"><defs><path id={ring} d="M90,90 m-69,0 a69,69 0 1,1 138,0 a69,69 0 1,1 -138,0" /></defs><circle cx="90" cy="90" r="85" /><circle cx="90" cy="90" r="79" className="stamp-broken-ring" /><circle cx="90" cy="90" r="56" /><text><textPath href={`#${ring}`} startOffset="3%">CURIOSITY REWARDED · KEEP EXPLORING ·</textPath></text></svg>
          <div className="stamp-center"><BookOpenCheck size={26} /><strong>Well<br />read.</strong><span>PANKAJ MOURIYA</span></div>
        </div>
        <div className="reading-reward-copy"><h2>Curiosity looks good on you.</h2><p>You made time for this one. Thanks for reading all the way through.</p><span>A little stamp for your reading journey.</span></div>
      </div>}
    </div>
  </div>;
}
