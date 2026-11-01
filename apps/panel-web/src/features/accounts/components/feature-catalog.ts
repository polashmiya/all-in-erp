import { useGetErpMenuCatalog, type ErpMenuModule } from '@erp/api-client';
import { useMemo } from 'react';

/** The ERP menu catalog (all modules, sub-modules and features) plus every feature code. */
export function useFeatureCatalog() {
  const query = useGetErpMenuCatalog({ query: { staleTime: 10 * 60_000 } });
  const modules = useMemo<ErpMenuModule[]>(() => query.data ?? [], [query.data]);
  const allCodes = useMemo(() => modules.flatMap((m) => m.subModules.flatMap((s) => s.features.map((f) => f.code))), [modules]);
  return { modules, allCodes, loading: query.isPending };
}
