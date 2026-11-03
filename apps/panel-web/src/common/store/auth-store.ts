import { isTokenActive, type PanelLoginResponse, type PanelUserDto } from '@erp/api-client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthData {
  accessToken: string | null;
  expiresAt: string | null;
  user: PanelUserDto | null;
}

interface AuthState extends AuthData {
  signIn: (login: PanelLoginResponse) => void;
  setUser: (user: PanelUserDto) => void;
  signOut: () => void;
}

export const signedOut: AuthData = { accessToken: null, expiresAt: null, user: null };

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...signedOut,
      signIn: (login) => set({ accessToken: login.accessToken, expiresAt: login.expiresAt, user: login.user }),
      setUser: (user) => set({ user }),
      signOut: () => set(signedOut),
    }),
    { name: 'panel.auth' },
  ),
);

export const isSignedIn = (state: AuthData) => isTokenActive(state.accessToken, state.expiresAt);
