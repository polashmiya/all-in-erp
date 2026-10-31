import { useSystemStatus } from '@erp/api-client';
import { AppShell, BusinessUnitSwitcher, ShellFooter } from '@erp/ui';
import { useQueryClient } from '@tanstack/react-query';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router';
import { erpMenu } from '@/navigation/menu';
import { useSessionStore } from '@/state/session-store';

export function ShellLayout() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const { userName, accountName, businessUnits, currentBusinessUnitId, setBusinessUnit } = useSessionStore();
  const { status } = useSystemStatus();

  const switchBusinessUnit = (id: string) => {
    setBusinessUnit(id);
    // Screens and data are business-unit scoped; drop everything cached for the previous unit.
    void queryClient.invalidateQueries();
    const unit = businessUnits.find((u) => u.id === id);
    if (unit) void message.success(t('bu.switched', { name: unit.name }));
  };

  return (
    <AppShell
      appName="myErp"
      appBadge="ERP"
      menu={erpMenu}
      user={{ name: userName, description: accountName }}
      headerExtra={
        <BusinessUnitSwitcher
          units={businessUnits}
          currentId={currentBusinessUnitId}
          onChange={switchBusinessUnit}
        />
      }
      footer={<ShellFooter appName="myErp" version={status?.version} />}
    >
      <Outlet />
    </AppShell>
  );
}
