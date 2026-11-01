import { UiProvider } from '@erp/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router';
import { queryClient } from '@/lib/api';
import { router } from '@/router';
import { HOME_PATH } from '@/routes/redirect';

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UiProvider homePath={HOME_PATH}>
        <RouterProvider router={router} />
      </UiProvider>
    </QueryClientProvider>
  );
}
