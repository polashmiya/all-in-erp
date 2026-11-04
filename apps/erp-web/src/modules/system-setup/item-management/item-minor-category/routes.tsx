import type { RouteObject } from 'react-router';
import { itemManagementPaths } from '../common/master-data';

export const itemMinorCategoryRoutes: RouteObject[] = [
  {
    path: itemManagementPaths.minorCategory.slice(1),
    lazy: async () => ({
      Component: (await import('./pages/ItemMinorCategoryPage')).ItemMinorCategoryPage,
    }),
  },
];
