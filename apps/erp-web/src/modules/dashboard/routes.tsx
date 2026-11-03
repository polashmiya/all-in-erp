import type { RouteObject } from 'react-router';

export const dashboardRoutes: RouteObject[] = [
  {
    path: 'dashboard',
    lazy: async () => ({ Component: (await import('./pages/DashboardPage')).DashboardPage }),
  },
];
