import { useBrand } from '@erp/ui';
import { useMemo } from 'react';

export function useStructureColors() {
  const brand = useBrand();
  return useMemo(
    () => ({
      account: brand.mode === 'light' ? brand.palette[7]! : brand.palette[4]!,
      unit: brand.mode === 'light' ? brand.primary : brand.palette[4]!,
      office: brand.accentIcon,
      warehouse: brand.info,
    }),
    [brand],
  );
}
