import type { RouteObject } from 'react-router';
import { ITEM_PROFILE_PATH } from './constants';

export const itemProfileRoutes: RouteObject[] = [
  {
    path: ITEM_PROFILE_PATH.slice(1),
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('./pages/ItemListPage')).ItemListPage }),
      },
      {
        path: 'new',
        lazy: async () => ({ Component: (await import('./pages/ItemFormPage')).ItemFormPage }),
      },
      {
        path: ':id',
        lazy: async () => ({ Component: (await import('./pages/ItemViewPage')).ItemViewPage }),
      },
      {
        path: ':id/edit',
        lazy: async () => ({ Component: (await import('./pages/ItemFormPage')).ItemFormPage }),
      },
    ],
  },
];
