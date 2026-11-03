import './accounts.css';
import type { RouteObject } from 'react-router';

export const accountsRoutes: RouteObject[] = [
  {
    path: 'accounts',
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./account-list/pages/AccountsPage')).AccountsPage,
        }),
      },
      {
        path: 'new',
        lazy: async () => ({
          Component: (await import('./account-setup/pages/AccountSetupPage')).AccountSetupPage,
        }),
      },
    ],
  },
];
