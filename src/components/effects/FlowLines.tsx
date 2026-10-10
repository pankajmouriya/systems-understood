import type { SignalMode } from './security-stories';

/** Decorative signal paths. Motion is controlled by the host's CSS and media preferences. */
export function FlowLines({ mode }: { mode?: SignalMode }) {
  return <svg className="flow-lines" data-signal-mode={mode} viewBox="0 0 600 600" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false">
    {Array.from({ length: 7 }, (_, index) => {
      const start = 230 + index * 20;
      const end = 40 + index * 80;
      const d = `M-30 ${start} C200 ${start}, 250 ${end}, 640 ${end}`;
      return <g key={index}><path className="flow-line-track" d={d} /><path className="flow-line-signal" d={d} pathLength="100" style={{ animationDelay: `${index * -1.7}s` }} /></g>;
    })}
  </svg>;
}
