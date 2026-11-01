import { LoginLayout } from '@erp/ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

/** The ERP's sign-in frame: shared split layout with the ERP's own copy. */
export function AuthFrame({ children }: { children: ReactNode }) {
  const { t } = useTranslation();

  return (
    <LoginLayout
      appName="myErp"
      appBadge="ERP"
      headline={t('login.headline')}
      description={t('login.description')}
      highlights={[t('login.point1'), t('login.point2'), t('login.point3')]}
    >
      {children}
    </LoginLayout>
  );
}
