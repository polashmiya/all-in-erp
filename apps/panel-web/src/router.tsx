import { FullPageLoader, RouteErrorResult } from '@erp/ui';
import { createBrowserRouter, Navigate } from 'react-router';
import { ShellLayout } from '@/layout/ShellLayout';
import { LoginPage } from '@/pages/LoginPage';
import { GuestOnly, RequireSignedIn } from '@/routes/guards';

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
    element: (
      <RequireSignedIn>
        <ShellLayout />
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
        path: '*',
        lazy: async () => ({ Component: (await import('@/pages/SectionPlaceholderPage')).SectionPlaceholderPage }),
      },
    ],
  },
]);
