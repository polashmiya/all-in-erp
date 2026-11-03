import type { RouteObject } from 'react-router';
import { dashboardRoutes } from './dashboard/routes';
import { systemSetupRoutes } from './system-setup/routes';

export const moduleRoutes: RouteObject[] = [...dashboardRoutes, ...systemSetupRoutes];
