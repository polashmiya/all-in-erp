import {
  isTokenActive,
  type BusinessUnitAccessDto,
  type ErpLoginResponse,
  type ErpSessionResponse,
  type ErpUserDto,
  type SelectUnitResponse,
} from '@erp/api-client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthData {
  accessToken: string | null;
  expiresAt: string | null;
  user: ErpUserDto | null;
  businessUnits: BusinessUnitAccessDto[];
  lastBusinessUnitId: string | null;
  /** Sent as X-Business-Unit on every request once chosen. */
  currentBusinessUnitId: string | null;
  /** Permission codes in the current business unit (UI hints only; the API enforces). */
  permissions: string[];
}

interface AuthState extends AuthData {
  signIn: (login: ErpLoginResponse) => void;
  refreshSession: (session: ErpSessionResponse) => void;
  selectUnit: (selection: SelectUnitResponse) => void;
  signOut: () => void;
}

export const signedOut: AuthData = {
  accessToken: null,
  expiresAt: null,
  user: null,
  businessUnits: [],
  lastBusinessUnitId: null,
  currentBusinessUnitId: null,
  permissions: [],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...signedOut,
      signIn: (login) =>
        set({
          accessToken: login.accessToken,
          expiresAt: login.expiresAt,
          user: login.user,
          businessUnits: login.businessUnits,
          lastBusinessUnitId: login.lastBusinessUnitId,
          currentBusinessUnitId: null,
          permissions: [],
        }),
      refreshSession: (session) =>
        set((state) => {
          // Access to the current unit may have been revoked since login; drop it so the picker shows again.
          const stillAllowed = session.businessUnits.some((u) => u.id === state.currentBusinessUnitId);
          return {
            user: session.user,
            businessUnits: session.businessUnits,
            lastBusinessUnitId: session.lastBusinessUnitId,
            ...(stillAllowed ? {} : { currentBusinessUnitId: null, permissions: [] }),
          };
        }),
      selectUnit: (selection) =>
        set((state) => ({
          currentBusinessUnitId: selection.businessUnit.id,
          lastBusinessUnitId: selection.businessUnit.id,
          permissions: selection.permissions,
          businessUnits: state.businessUnits.map((u) => (u.id === selection.businessUnit.id ? selection.businessUnit : u)),
        })),
      signOut: () => set(signedOut),
    }),
    { name: 'erp.auth' },
  ),
);

export const isSignedIn = (state: AuthData) => isTokenActive(state.accessToken, state.expiresAt);

export const selectCurrentUnit = (state: AuthData) =>
  state.businessUnits.find((u) => u.id === state.currentBusinessUnitId);
