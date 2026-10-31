import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from './tokens';

interface ThemeState {
  mode: ThemeMode;
  compact: boolean;
  siderCollapsed: boolean;
  toggleMode: () => void;
  setCompact: (compact: boolean) => void;
  setSiderCollapsed: (collapsed: boolean) => void;
}

function preferredMode(): ThemeMode {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Per-browser UI preferences (theme, density, sider), persisted in localStorage. */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: preferredMode(),
      compact: false,
      siderCollapsed: false,
      toggleMode: () => set((s) => ({ mode: s.mode === 'dark' ? 'light' : 'dark' })),
      setCompact: (compact) => set({ compact }),
      setSiderCollapsed: (siderCollapsed) => set({ siderCollapsed }),
    }),
    { name: 'erp.ui.preferences' },
  ),
);
