import { FullPageLoader, RouteErrorResult } from '@erp/ui';
import { createBrowserRouter, Navigate } from 'react-router';
import { ShellLayout } from '@/layout/ShellLayout';

export const router = createBrowserRouter([
  {
    element: <ShellLayout />,
    errorElement: <RouteErrorResult />,
    hydrateFallbackElement: <FullPageLoader />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        lazy: async () => ({ Component: (await import('@/pages/DashboardPage')).DashboardPage }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/pages/SectionPlaceholderPage')).SectionPlaceholderPage }),
      },
    ],
  },
]);
