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
        // Generic feature route: landing, /new, /:id and /:id/edit all live under it (Phase 5).
        path: 'app/:module/:feature/*',
        lazy: async () => ({ Component: (await import('@/pages/FeaturePlaceholderPage')).FeaturePlaceholderPage }),
      },
      {
        path: '*',
        lazy: async () => ({ Component: (await import('@/pages/SectionPlaceholderPage')).SectionPlaceholderPage }),
      },
    ],
  },
]);
