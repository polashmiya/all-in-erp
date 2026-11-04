import type { RouteObject } from 'react-router';
import { itemManagementPaths } from '../common/master-data';

export const itemSubCategoryRoutes: RouteObject[] = [
  {
    path: itemManagementPaths.subCategory.slice(1),
    lazy: async () => ({
      Component: (await import('./pages/ItemSubCategoryPage')).ItemSubCategoryPage,
    }),
  },
];
