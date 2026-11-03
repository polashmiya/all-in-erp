import { GlobalOutlined, LayoutOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useSystemStatus } from '@erp/api-client';
import { LoginLayout } from '@erp/ui';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const { status } = useSystemStatus();
  const online = status === undefined || (status.apiOnline && status.databaseHealthy !== false);

  return (
    <LoginLayout
      appName="myErp"
      announcement={t('login.announcement')}
      headline={t('login.headline')}
      description={t('login.description')}
      preview={{
        stats: ['1,248', '৳ 4.8 Cr', '37'],
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
      footerNote={t('login.footer', { year: new Date().getFullYear() })}
      footerExtra={
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: online ? '#22C55E' : '#F59E0B',
            }}
          />
          {online ? t('login.statusOk') : t('login.statusDown')}
        </span>
      }
    >
      {children}
    </LoginLayout>
  );
}
