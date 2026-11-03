import { useGetPanelSession, useSystemStatus } from '@erp/api-client';
import { AppShell } from '@erp/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { appConfig } from '@/common/config/app.config';
import { useNavigation } from '@/common/navigation/useNavigation';
import { useAuthStore } from '@/common/store/auth-store';

export function ShellLayout() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const signOut = useAuthStore((s) => s.signOut);
  const { status } = useSystemStatus();
  const session = useGetPanelSession({ query: { staleTime: appConfig.sessionStaleMs } });
  const navigation = useNavigation();

  useEffect(() => {
    if (session.data) setUser(session.data);
  }, [session.data, setUser]);

  const logout = () => {
    signOut();
    queryClient.clear();
  };

  const role = user ? t(`role.${user.role}`) : undefined;

  return (
    <AppShell
      workspace={{ name: appConfig.name, subtitle: t('shell.panelSubtitle') }}
      menu={navigation.menu}
      menuLoading={navigation.loading}
      version={status?.version}
      user={{
        name: user?.fullName ?? '',
        email: user?.email,
        role,
        tags: role ? [role] : undefined,
      }}
      onLogout={logout}
    >
      <Outlet />
    </AppShell>
  );
}
