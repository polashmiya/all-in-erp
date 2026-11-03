import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { isSignedIn, useAuthStore } from '@/common/store/auth-store';
import { redirectTarget } from './redirect';

function useFrom() {
  const location = useLocation();
  return `${location.pathname}${location.search}`;
}

export function RequireSignedIn({ children }: { children: ReactNode }) {
  const signedIn = useAuthStore(isSignedIn);
  const from = useFrom();

  return signedIn ? children : <Navigate to="/login" replace state={{ from }} />;
}

export function RequireBusinessUnit({ children }: { children: ReactNode }) {
  const unitId = useAuthStore((s) => s.currentBusinessUnitId);
  const from = useFrom();

  return unitId ? children : <Navigate to="/select-unit" replace state={{ from }} />;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const signedIn = useAuthStore(isSignedIn);
  const hasUnit = useAuthStore((s) => s.currentBusinessUnitId !== null);
  const location = useLocation();
  const target = redirectTarget(location.state);

  if (!signedIn) return children;
  return hasUnit ? <Navigate to={target} replace /> : <Navigate to="/select-unit" replace state={{ from: target }} />;
}
