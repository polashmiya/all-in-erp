import { useSystemStatus } from '@erp/api-client';
import { AppShell, ShellFooter } from '@erp/ui';
import { Outlet } from 'react-router';
import { panelMenu } from '@/navigation/menu';

export function ShellLayout() {
  const { status } = useSystemStatus();

  return (
    // Placeholder identity until Phase 1 adds Panel login (SuperAdmin / Implementer).
    <AppShell
      appName="myErp"
      appBadge="Panel"
      menu={panelMenu}
      user={{ name: 'Super Admin', description: 'myErp implementation team' }}
      footer={<ShellFooter appName="myErp Panel" version={status?.version} />}
    >
      <Outlet />
    </AppShell>
  );
}
