import { createContext, useCallback, useContext, useEffect } from 'react';
import { matchRoutes, type RouteObject } from 'react-router';
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

export const RoutesContext = createContext<RouteObject[]>([]);

const preloaded = new Set<string>();

export function usePreloadRoute() {
  const routes = useContext(RoutesContext);
  return useCallback(
    (href: string) => {
      const path = href.split(/[?#]/)[0]!;
      if (preloaded.has(path)) return;
      preloaded.add(path);
      for (const { route } of matchRoutes(routes, path) ?? []) {
        if (typeof route.lazy === 'function') void route.lazy();
      }
    },
    [routes],
  );
}
