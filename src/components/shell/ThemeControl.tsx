'use client';

import { useTheme } from 'next-themes';
import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export function ThemeControl() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  return (
    <label className="theme-control">
      <span className="sr-only">Color theme</span>
      <select
        aria-label="Color theme"
        value={mounted ? theme : 'system'}
        onChange={(event) => setTheme(event.target.value)}
        disabled={!mounted}
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}
