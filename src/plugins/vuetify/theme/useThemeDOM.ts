// useThemeDOM.ts
import { DARK_THEMES, type ResolvedThemeMode } from './theme.types';

export function useThemeDOM() {
  const applyTheme = (mode: ResolvedThemeMode) => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-theme', mode);
    document.documentElement.classList.toggle('dark', DARK_THEMES.has(mode));
  };

  return { applyTheme };
}