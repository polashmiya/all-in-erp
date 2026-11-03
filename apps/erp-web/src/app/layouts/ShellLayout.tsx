import { useGetErpSession, useSelectBusinessUnit, useSystemStatus } from '@erp/api-client';
import { AppShell, BusinessUnitSwitcher } from '@erp/ui';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { useShallow } from 'zustand/react/shallow';
import { appConfig } from '@/common/config/app.config';
import { footerMenu } from '@/common/navigation/footer-menu';
import { useErpNavigation } from '@/common/navigation/useErpNavigation';
import { selectCurrentUnit, useAuthStore } from '@/common/store/auth-store';

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
  const session = useGetErpSession({ query: { staleTime: appConfig.sessionStaleMs } });
  const select = useSelectBusinessUnit();
  const navigation = useErpNavigation();

  useEffect(() => {
    if (session.data) refreshSession(session.data);
  }, [session.data, refreshSession]);

  const switchBusinessUnit = async (businessUnitId: string) => {
    try {
      const selection = await select.mutateAsync({ data: { businessUnitId } });
      selectUnit(selection);
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

  const role = currentUnit?.roleName;

  return (
    <AppShell
      workspace={{ name: user?.accountName ?? appConfig.name, subtitle: t('shell.productName') }}
      menu={navigation.menu}
      footerMenu={footerMenu}
      menuLoading={navigation.loading}
      version={status?.version}
      user={{
        name: user?.fullName ?? '',
        email: user?.email,
        role,
        tags: [
          [role, user?.isPrimaryAdmin ? t('shell.primaryAdmin') : undefined]
            .filter(Boolean)
            .join(' · '),
          t('shell.businessUnitCount', { count: businessUnits.length }),
        ].filter(Boolean),
      }}
      businessUnit={
        <BusinessUnitSwitcher
          units={businessUnits.map((u) => ({
            id: u.id,
            code: u.code,
            name: u.name,
            description: u.roleName,
          }))}
          currentId={currentUnit?.id}
          onChange={(id) => void switchBusinessUnit(id)}
        />
      }
      onLogout={logout}
    >
      <Outlet />
    </AppShell>
  );
}
