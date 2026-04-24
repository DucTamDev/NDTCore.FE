// useVuetifyThemeSync.ts
import { useTheme as useVuetifyTheme } from 'vuetify';
import { RESOLVED_THEME_MODES, type ResolvedThemeMode } from './theme.types';

export type VuetifyThemeMap = Record<ResolvedThemeMode, string>;

const buildDefaultMap = (): VuetifyThemeMap =>
  Object.fromEntries(RESOLVED_THEME_MODES.map(m => [m, m])) as VuetifyThemeMap;

export function useVuetifyThemeSync(map: VuetifyThemeMap = buildDefaultMap()) {
  const vuetifyTheme = useVuetifyTheme();
  const sync = (mode: ResolvedThemeMode) => vuetifyTheme.change(map[mode]);
  return { sync };
}