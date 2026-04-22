// useSystemTheme.ts
import { SystemScheme, type SystemColorScheme } from './types';

const DARK_MQ = '(prefers-color-scheme: dark)' as const;

const fromMatches = (matches: boolean): SystemColorScheme =>
  matches ? SystemScheme.Dark : SystemScheme.Light;

export function useSystemTheme() {
  const getSystemColorScheme = (): SystemColorScheme => {
    if (typeof window === 'undefined') return SystemScheme.Light;
    return fromMatches(window.matchMedia(DARK_MQ).matches);
  };

  /** Trả về hàm cleanup để gọi khi unmount. */
  const watchSystemColorScheme = (onChange: (scheme: SystemColorScheme) => void): () => void => {
    if (typeof window === 'undefined') return () => {};
    const mq       = window.matchMedia(DARK_MQ);
    const listener = (e: MediaQueryListEvent) => onChange(fromMatches(e.matches));
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  };

  return { getSystemColorScheme, watchSystemColorScheme };
}