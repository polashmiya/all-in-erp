import { AppstoreOutlined, ControlOutlined, EyeOutlined } from '@ant-design/icons';
import { errorStatus, panelLogin, type LoginRequest } from '@erp/api-client';
import { AuthHeading, LoginLayout, SignInForm } from '@erp/ui';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { appConfig } from '@/common/config/app.config';
import { useAuthStore } from '@/common/store/auth-store';

const ERROR_KEYS: Record<number, string> = {
  0: 'auth.serverUnreachable',
  401: 'auth.invalidCredentials',
  429: 'auth.tooManyAttempts',
};

export function LoginPage() {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);

  const submit = async (values: LoginRequest) => {
    setError(null);
    setLoading(true);
    try {
      signIn(await panelLogin(values));
    } catch (e) {
      setError(t(ERROR_KEYS[errorStatus(e)] ?? 'auth.unexpected'));
      setLoading(false);
    }
  };

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
        { icon: <ControlOutlined />, title: t('login.point1'), description: t('login.point1Text') },
        {
          icon: <AppstoreOutlined />,
          title: t('login.point2'),
          description: t('login.point2Text'),
        },
        { icon: <EyeOutlined />, title: t('login.point3'), description: t('login.point3Text') },
      ]}
      footerNote={t('login.footer', { year: new Date().getFullYear(), app: appConfig.name })}
    >
      <AuthHeading title={t('login.welcome')} lead={t('login.lead', { app: appConfig.name })} />
      <SignInForm
        onSubmit={submit}
        error={error}
        loading={loading}
        demo={appConfig.demoAccount}
        footer={t('login.internalOnly')}
      />
    </LoginLayout>
  );
}
