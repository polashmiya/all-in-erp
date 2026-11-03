import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  keys: string[];
  toggle: (key: string) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set) => ({
      keys: [],
      toggle: (key) =>
        set((s) => ({
          keys: s.keys.includes(key) ? s.keys.filter((k) => k !== key) : [...s.keys, key],
        })),
    }),
    { name: 'erp.ui.favorites' },
  ),
);
