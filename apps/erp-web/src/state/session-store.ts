import type { BusinessUnitOption } from '@erp/ui';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  userName: string;
  accountName: string;
  businessUnits: BusinessUnitOption[];
  currentBusinessUnitId: string | undefined;
  setBusinessUnit: (id: string) => void;
}

/**
 * Session for the shell. Phase 0 ships the seeded demo tenant so the header is complete;
 * Phase 1 fills this from POST /api/erp/auth/login and /select-unit.
 */
export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      userName: 'Demo Admin',
      accountName: 'Demo Pharma Ltd',
      businessUnits: [
        { id: 'dhaka-depot', code: 'DHK', name: 'Dhaka Depot' },
        { id: 'chattogram-depot', code: 'CTG', name: 'Chattogram Depot' },
      ],
      currentBusinessUnitId: 'dhaka-depot',
      setBusinessUnit: (currentBusinessUnitId) => set({ currentBusinessUnitId }),
    }),
    { name: 'erp.session', partialize: (s) => ({ currentBusinessUnitId: s.currentBusinessUnitId }) },
  ),
);
