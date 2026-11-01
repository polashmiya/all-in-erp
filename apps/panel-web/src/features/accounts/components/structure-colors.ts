import { useBrand } from '@erp/ui';
import { useMemo } from 'react';

/** One colour per level of the account structure, used by the tree, counters and stat cards alike. */
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
