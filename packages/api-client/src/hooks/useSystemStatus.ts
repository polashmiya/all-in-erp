import { useGetApiInfo, useGetHealth } from '../generated/endpoints';
import type { HealthResponse } from '../generated/model';

const POLL_MS = 30_000;

/** API reachability, database health and version, polled every 30 s. */
export function useSystemStatus() {
  const info = useGetApiInfo({ query: { retry: false, refetchInterval: POLL_MS } });
  const health = useGetHealth({ query: { retry: false, refetchInterval: POLL_MS } });

  // A 503 still carries the health report in the error body.
  const report = health.data ?? (health.error?.body as HealthResponse | undefined);
  const database = report?.checks.find((c) => c.name === 'database');
  const settled = !info.isPending || !health.isPending;

  return {
    loading: !settled,
    refreshing: info.isFetching || health.isFetching,
    status: settled
      ? {
          apiOnline: info.isSuccess || report !== undefined,
          databaseHealthy: database ? database.status === 'Healthy' : undefined,
          databaseLatencyMs: database?.durationMs,
          version: info.data?.version,
          environment: info.data?.environment,
        }
      : undefined,
    onRefresh: () => {
      void info.refetch();
      void health.refetch();
    },
  };
}
