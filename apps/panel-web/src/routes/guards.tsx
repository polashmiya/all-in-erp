import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { isSignedIn, useAuthStore } from '@/state/auth-store';
import { redirectTarget } from './redirect';

/** Sends visitors without a valid (unexpired) token to /login, remembering where they were going. */
export function RequireSignedIn({ children }: { children: ReactNode }) {
  const signedIn = useAuthStore(isSignedIn);
  const location = useLocation();

  return signedIn ? children : <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
}

/** The login page is for signed-out users only. */
export function GuestOnly({ children }: { children: ReactNode }) {
  const signedIn = useAuthStore(isSignedIn);
  const location = useLocation();

  return signedIn ? <Navigate to={redirectTarget(location.state)} replace /> : children;
}
