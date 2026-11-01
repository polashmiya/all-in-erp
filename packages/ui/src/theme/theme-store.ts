import { useSyncExternalStore } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SiderStyle, ThemeMode } from './brand';
import { DEFAULT_PRESET } from './presets';

export type ModePreference = ThemeMode | 'system';

interface Appearance {
  mode: ModePreference;
  preset: string;
  sider: SiderStyle;
  compact: boolean;
}

interface ThemeState extends Appearance {
  siderCollapsed: boolean;
  setMode: (mode: ModePreference) => void;
  setPreset: (preset: string) => void;
  setSider: (sider: SiderStyle) => void;
  setCompact: (compact: boolean) => void;
  setSiderCollapsed: (collapsed: boolean) => void;
  resetAppearance: () => void;
}

export const defaultAppearance: Appearance = { mode: 'light', preset: DEFAULT_PRESET, sider: 'tinted', compact: false };

/** Per-browser appearance preferences (theme colour, mode, sidebar style, density), persisted in localStorage. */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      ...defaultAppearance,
      siderCollapsed: false,
      setMode: (mode) => set({ mode }),
      setPreset: (preset) => set({ preset }),
      setSider: (sider) => set({ sider }),
      setCompact: (compact) => set({ compact }),
      setSiderCollapsed: (siderCollapsed) => set({ siderCollapsed }),
      resetAppearance: () => set(defaultAppearance),
    }),
    { name: 'erp.ui.preferences' },
  ),
);

const DARK_QUERY = '(prefers-color-scheme: dark)';

function subscribeToSystemMode(onChange: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => undefined;
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function systemMode(): ThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light';
}

/** The mode actually shown: the user's choice, or the operating system's when set to "system". */
export function useResolvedMode(): ThemeMode {
  const preference = useThemeStore((s) => s.mode);
  const system = useSyncExternalStore(subscribeToSystemMode, systemMode, () => 'light' as const);
  return preference === 'system' ? system : preference;
}
