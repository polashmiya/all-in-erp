import { useGetPanelSession, useSystemStatus } from '@erp/api-client';
import { AppShell, ShellFooter } from '@erp/ui';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { panelMenu } from '@/navigation/menu';
import { useAuthStore } from '@/state/auth-store';

export function ShellLayout() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const signOut = useAuthStore((s) => s.signOut);
  const { status } = useSystemStatus();
  const session = useGetPanelSession({ query: { staleTime: 5 * 60_000 } });

  useEffect(() => {
    if (session.data) setUser(session.data);
  }, [session.data, setUser]);

  const logout = () => {
    signOut();
    queryClient.clear();
  };

  return (
    <AppShell
      appName="myErp"
      appBadge="Panel"
      menu={panelMenu}
      user={{ name: user?.fullName ?? '', description: user ? t(`role.${user.role}`) : undefined }}
      onLogout={logout}
      footer={<ShellFooter appName="myErp Panel" version={status?.version} />}
    >
      <Outlet />
    </AppShell>
  );
}
