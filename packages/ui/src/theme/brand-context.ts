import { createContext, useContext } from 'react';
import { buildBrand, type Brand } from './brand';
import { findPreset } from './presets';

export const BrandContext = createContext<Brand>(buildBrand(findPreset(undefined), 'light', 'tinted'));

/** The active theme's derived colours (primary/accent palettes, surfaces, sidebar, hero). */
export function useBrand() {
  return useContext(BrandContext);
}
