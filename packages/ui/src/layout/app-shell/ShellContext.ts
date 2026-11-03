import { createContext, useContext, useEffect } from 'react';
import type { MenuNode } from '../../utils/menu';

export interface ShellContextValue {
  menu: MenuNode[];
  trail: MenuNode[];
  setCrumbs: (crumbs: string[]) => void;
}

export const ShellContext = createContext<ShellContextValue>({
  menu: [],
  trail: [],
  setCrumbs: () => undefined,
});

export function useShell() {
  return useContext(ShellContext);
}

export function useShellCrumbs(crumbs: string[]) {
  const { setCrumbs } = useShell();
  const key = crumbs.join('\u0000');

  useEffect(() => {
    setCrumbs(key ? key.split('\u0000') : []);
    return () => setCrumbs([]);
  }, [key, setCrumbs]);
}

export const HomePathContext = createContext('/dashboard');

export function useHomePath() {
  return useContext(HomePathContext);
}
