import { UiProvider } from '@erp/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { HOME_PATH } from '@/common/constants/routes';
import { queryClient } from '@/common/services/api-client';
import { router } from './router';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider homePath={HOME_PATH}>
        <RouterProvider router={router} />
      </UiProvider>
    </QueryClientProvider>
  );
}
