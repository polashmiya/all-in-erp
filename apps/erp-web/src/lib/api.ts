import { configureApiClient } from '@erp/api-client';
import { QueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/state/auth-store';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

configureApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  getAccessToken: () => useAuthStore.getState().accessToken,
  getBusinessUnitId: () => useAuthStore.getState().currentBusinessUnitId,
  // Expired or revoked token: drop the session; the route guards send the user to /login.
  onUnauthorized: () => {
    if (!useAuthStore.getState().accessToken) return;
    useAuthStore.getState().signOut();
    queryClient.clear();
  },
});
