import { createContext, useContext } from 'react';
import type { MenuNode } from './menu';

export interface ShellContextValue {
  menu: MenuNode[];
  /** Root-to-leaf menu chain for the current route (empty when the route is not in the menu). */
  trail: MenuNode[];
}

export const ShellContext = createContext<ShellContextValue>({ menu: [], trail: [] });

export function useShell() {
  return useContext(ShellContext);
}
