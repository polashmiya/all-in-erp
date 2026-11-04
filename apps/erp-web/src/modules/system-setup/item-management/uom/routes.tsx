import type { RouteObject } from 'react-router';
import { itemManagementPaths } from '../common/master-data';

export const uomRoutes: RouteObject[] = [
  {
    path: itemManagementPaths.uom.slice(1),
    lazy: async () => ({ Component: (await import('./pages/UomPage')).UomPage }),
  },
];
