import type { RouteObject } from 'react-router';
import { accountsRoutes } from './accounts/routes';

export const moduleRoutes: RouteObject[] = [...accountsRoutes];
