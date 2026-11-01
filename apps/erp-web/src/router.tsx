import { FullPageLoader, RouteErrorResult } from '@erp/ui';
import { createBrowserRouter, Navigate } from 'react-router';
import { ShellLayout } from '@/layout/ShellLayout';
import { LoginPage } from '@/pages/LoginPage';
import { SelectUnitPage } from '@/pages/SelectUnitPage';
import { GuestOnly, RequireBusinessUnit, RequireSignedIn } from '@/routes/guards';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <GuestOnly>
        <LoginPage />
      </GuestOnly>
    ),
    errorElement: <RouteErrorResult />,
  },
  {
    path: '/select-unit',
    element: (
      <RequireSignedIn>
        <SelectUnitPage />
      </RequireSignedIn>
    ),
    errorElement: <RouteErrorResult />,
  },
  {
    element: (
      <RequireSignedIn>
        <RequireBusinessUnit>
          <ShellLayout />
        </RequireBusinessUnit>
      </RequireSignedIn>
    ),
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
