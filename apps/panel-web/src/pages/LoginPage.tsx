import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText, type ProFormInstance } from '@ant-design/pro-components';
import { errorStatus, panelLogin, type LoginRequest } from '@erp/api-client';
import { BrandMark, LoginLayout } from '@erp/ui';
import { Alert, Button } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/state/auth-store';

const errorKeys: Record<number, string> = {
  0: 'auth.serverUnreachable',
  401: 'auth.invalidCredentials',
  429: 'auth.tooManyAttempts',
};

export function LoginPage() {
  const { t } = useTranslation();
  const formRef = useRef<ProFormInstance<LoginRequest>>(undefined);
  const [error, setError] = useState<string | null>(null);
  const signIn = useAuthStore((s) => s.signIn);

  const submit = async (values: LoginRequest) => {
    setError(null);
    try {
      signIn(await panelLogin(values)); // GuestOnly then moves on to the requested page
    } catch (e) {
      setError(t(errorKeys[errorStatus(e)] ?? 'auth.unexpected'));
    }
  };

  return (
    <LoginLayout
      appName="myErp"
      appBadge="Panel"
      headline={t('login.headline')}
      description={t('login.description')}
      highlights={[t('login.point1'), t('login.point2'), t('login.point3')]}
    >
      <LoginForm<LoginRequest>
        formRef={formRef}
        logo={<BrandMark size={40} />}
        title={t('auth.signInTitle')}
        subTitle={t('auth.signInSubtitle')}
        onFinish={submit}
        containerStyle={{ paddingInline: 0 }}
        contentStyle={{ minWidth: 0, width: '100%', maxWidth: 380 }}
        submitter={{
          searchConfig: { submitText: t('auth.signIn') },
          submitButtonProps: { size: 'large', block: true },
        }}
      >
        {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 20 }} />}
        <ProFormText
          name="email"
          placeholder={t('auth.email')}
          fieldProps={{ size: 'large', prefix: <MailOutlined />, autoComplete: 'username', autoFocus: true }}
          rules={[
            { required: true, message: t('auth.emailRequired') },
            { type: 'email', message: t('auth.emailInvalid') },
          ]}
        />
        <ProFormText.Password
          name="password"
          placeholder={t('auth.password')}
          fieldProps={{ size: 'large', prefix: <LockOutlined />, autoComplete: 'current-password' }}
          rules={[{ required: true, message: t('auth.passwordRequired') }]}
        />
        {import.meta.env.DEV && (
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
            message={t('auth.demoAccount')}
            description="superadmin@myerp.local · Admin@12345"
            action={
              <Button
                size="small"
                onClick={() => formRef.current?.setFieldsValue({ email: 'superadmin@myerp.local', password: 'Admin@12345' })}
              >
                {t('auth.useDemo')}
              </Button>
            }
          />
        )}
      </LoginForm>
    </LoginLayout>
  );
}
