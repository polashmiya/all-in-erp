import type { RouteObject } from 'react-router';
import { itemManagementPaths } from '../common/master-data';

export const itemCategoryRoutes: RouteObject[] = [
  {
    path: itemManagementPaths.category.slice(1),
    lazy: async () => ({
      Component: (await import('./pages/ItemCategoryPage')).ItemCategoryPage,
    }),
  },
];
