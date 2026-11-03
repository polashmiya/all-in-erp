import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router';
import { isSignedIn, useAuthStore } from '@/common/store/auth-store';
import { redirectTarget } from './redirect';

export function RequireSignedIn({ children }: { children: ReactNode }) {
  const signedIn = useAuthStore(isSignedIn);
  const location = useLocation();

  return signedIn ? children : <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const signedIn = useAuthStore(isSignedIn);
  const location = useLocation();

  return signedIn ? <Navigate to={redirectTarget(location.state)} replace /> : children;
}
