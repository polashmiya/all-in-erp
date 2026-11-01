import { useGetErpSession, useSelectBusinessUnit, useSystemStatus } from '@erp/api-client';
import { AppShell, BusinessUnitSwitcher, ShellFooter } from '@erp/ui';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { useErpNavigation } from '@/navigation/useErpNavigation';
import { selectCurrentUnit, useAuthStore } from '@/state/auth-store';

export function ShellLayout() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { user, businessUnits, currentUnit, refreshSession, selectUnit, signOut } = useAuthStore(
    useShallow((s) => ({
      user: s.user,
      businessUnits: s.businessUnits,
      currentUnit: selectCurrentUnit(s),
      refreshSession: s.refreshSession,
      selectUnit: s.selectUnit,
      signOut: s.signOut,
    })),
  );
  const { status } = useSystemStatus();
  const session = useGetErpSession({ query: { staleTime: 5 * 60_000 } });
  const select = useSelectBusinessUnit();
  const navigation = useErpNavigation();

  // Keep user and unit list current (e.g. access revoked or units renamed since login).
  useEffect(() => {
    if (session.data) refreshSession(session.data);
  }, [session.data, refreshSession]);

  const switchBusinessUnit = async (businessUnitId: string) => {
    try {
      const selection = await select.mutateAsync({ data: { businessUnitId } });
      selectUnit(selection);
      // Screens and data are business-unit scoped; refetch everything for the new unit.
      await queryClient.invalidateQueries();
      void message.success(t('bu.switched', { name: selection.businessUnit.name }));
    } catch {
      void message.error(t('auth.switchFailed'));
    }
  };

  const logout = () => {
    signOut();
    queryClient.clear();
  };

  return (
    <AppShell
      appName="myErp"
      appBadge="ERP"
      menu={navigation.menu}
      menuLoading={navigation.loading}
      user={{
        name: user?.fullName ?? '',
        description: [user?.accountName, currentUnit?.roleName].filter(Boolean).join(' · '),
      }}
      headerExtra={
        <BusinessUnitSwitcher
          units={businessUnits}
          currentId={currentUnit?.id}
          onChange={(id) => void switchBusinessUnit(id)}
        />
      }
      onLogout={logout}
      footer={<ShellFooter appName="myErp" version={status?.version} />}
    >
      <Outlet />
    </AppShell>
  );
}
