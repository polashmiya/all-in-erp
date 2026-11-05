import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const MAX_RECENT = 5;

interface RecentPagesState {
  paths: string[];
  visit: (path: string) => void;
}

export const useRecentPages = create<RecentPagesState>()(
  persist(
    (set) => ({
      paths: [],
      visit: (path) =>
        set((s) => ({ paths: [path, ...s.paths.filter((p) => p !== path)].slice(0, MAX_RECENT) })),
    }),
    { name: 'erp.ui.recent' },
  ),
);
