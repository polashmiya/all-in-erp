import { FullPageLoader, RouteErrorResult } from '@erp/ui';
import { createBrowserRouter, Navigate } from 'react-router';
import { HOME_PATH, LOGIN_PATH, SELECT_UNIT_PATH } from '@/common/constants/routes';
import { GuestOnly, RequireBusinessUnit, RequireSignedIn } from '@/common/guards';
import { moduleRoutes } from '@/modules';
import { ShellLayout } from './layouts/ShellLayout';

export const router = createBrowserRouter([
  {
    path: LOGIN_PATH,
    lazy: async () => {
      const { LoginPage } = await import('@/modules/auth/pages/LoginPage');
      return {
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      };
    },
    errorElement: <RouteErrorResult />,
    hydrateFallbackElement: <FullPageLoader />,
  },
  {
    path: SELECT_UNIT_PATH,
    lazy: async () => {
      const { SelectUnitPage } = await import('@/modules/auth/pages/SelectUnitPage');
      return {
        element: (
          <RequireSignedIn>
            <SelectUnitPage />
          </RequireSignedIn>
        ),
      };
    },
    errorElement: <RouteErrorResult />,
    hydrateFallbackElement: <FullPageLoader />,
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
      { index: true, element: <Navigate to={HOME_PATH} replace /> },
      ...moduleRoutes,
      {
        path: 'app/:module/:feature/*',
        lazy: async () => ({
          Component: (await import('@/common/pages/FeaturePlaceholderPage')).FeaturePlaceholderPage,
        }),
      },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('@/common/pages/SectionPlaceholderPage')).SectionPlaceholderPage,
        }),
      },
    ],
  },
]);
