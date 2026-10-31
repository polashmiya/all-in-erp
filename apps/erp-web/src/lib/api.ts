import { configureApiClient } from '@erp/api-client';
import { QueryClient } from '@tanstack/react-query';

configureApiClient({ baseUrl: import.meta.env.VITE_API_BASE_URL });

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});
