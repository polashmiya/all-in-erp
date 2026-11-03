import { createContext, useContext } from 'react';
import { buildBrand, type Brand } from './brand';
import { findPreset } from './presets';

export const BrandContext = createContext<Brand>(
  buildBrand(findPreset(undefined), 'light', 'light'),
);

export function useBrand() {
  return useContext(BrandContext);
}
