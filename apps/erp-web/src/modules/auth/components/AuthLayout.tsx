import { GlobalOutlined, LayoutOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useSystemStatus } from '@erp/api-client';
import { LoginLayout } from '@erp/ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { appConfig } from '@/common/config/app.config';

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { status } = useSystemStatus();
  const online = status === undefined || (status.apiOnline && status.databaseHealthy !== false);

  return (
    <LoginLayout
      appName={appConfig.name}
      announcement={t('login.announcement')}
      headline={t('login.headline')}
      description={t('login.description')}
      preview={{
        stats: [t('login.previewStat1'), t('login.previewStat2'), t('login.previewStat3')],
        publishedTitle: t('login.previewPublished'),
        publishedMeta: t('login.previewPublishedMeta'),
        roleNote: t('login.previewRole'),
      }}
      features={[
        {
          icon: <LayoutOutlined />,
          title: t('login.featureConfig'),
          description: t('login.featureConfigText'),
        },
        {
          icon: <SafetyCertificateOutlined />,
          title: t('login.featureAccess'),
          description: t('login.featureAccessText'),
        },
        {
          icon: <GlobalOutlined />,
          title: t('login.featureLanguage'),
          description: t('login.featureLanguageText'),
        },
      ]}
      footerNote={t('login.footer', { year: new Date().getFullYear(), app: appConfig.name })}
      footerExtra={
        <span className={`erp-status-dot erp-status-dot--${online ? 'success' : 'warning'}`}>
          {online ? t('login.statusOk') : t('login.statusDown')}
        </span>
      }
    >
      {children}
    </LoginLayout>
  );
}
