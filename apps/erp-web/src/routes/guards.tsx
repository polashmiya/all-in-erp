import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { isSignedIn, useAuthStore } from '@/state/auth-store';
import { redirectTarget } from './redirect';

function useFrom() {
  const location = useLocation();
  return `${location.pathname}${location.search}`;
}

/** Sends visitors without a valid (unexpired) token to /login, remembering where they were going. */
export function RequireSignedIn({ children }: { children: ReactNode }) {
  const signedIn = useAuthStore(isSignedIn);
  const from = useFrom();

  return signedIn ? children : <Navigate to="/login" replace state={{ from }} />;
}

/** Business screens need a selected business unit; without one, show the picker first. */
export function RequireBusinessUnit({ children }: { children: ReactNode }) {
  const unitId = useAuthStore((s) => s.currentBusinessUnitId);
  const from = useFrom();

  return unitId ? children : <Navigate to="/select-unit" replace state={{ from }} />;
}

/** The login page is for signed-out users only; signed-in users continue to where they were heading. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const signedIn = useAuthStore(isSignedIn);
  const hasUnit = useAuthStore((s) => s.currentBusinessUnitId !== null);
  const location = useLocation();
  const target = redirectTarget(location.state);

  if (!signedIn) return children;
  return hasUnit ? <Navigate to={target} replace /> : <Navigate to="/select-unit" replace state={{ from: target }} />;
}
