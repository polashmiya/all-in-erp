import { configureApiClient } from '@erp/api-client';
import { QueryClient } from '@tanstack/react-query';
import { appConfig } from '@/common/config/app.config';
import { useAuthStore } from '@/common/store/auth-store';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: appConfig.queryStaleMs, retry: 1, refetchOnWindowFocus: false },
  },
});

configureApiClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  getAccessToken: () => useAuthStore.getState().accessToken,
  onUnauthorized: () => {
    if (!useAuthStore.getState().accessToken) return;
    useAuthStore.getState().signOut();
    queryClient.clear();
  },
});
