import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/common/store/auth-store';
import { simulateLatency } from '@/common/utils/mock';
import { buildDashboard } from './dashboard.mock';
import type { DashboardRange, DashboardSummary, SalesRange } from './dashboard.types';

export function fetchDashboard(
  range: DashboardRange,
  salesRange: SalesRange,
): Promise<DashboardSummary> {
  return simulateLatency(buildDashboard(range, salesRange));
}

export function useDashboard(range: DashboardRange, salesRange: SalesRange) {
  const unitId = useAuthStore((s) => s.currentBusinessUnitId);
  return useQuery({
    queryKey: ['dashboard', unitId, range, salesRange],
    queryFn: () => fetchDashboard(range, salesRange),
    placeholderData: keepPreviousData,
  });
}
