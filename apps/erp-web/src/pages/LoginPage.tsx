import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { LoginForm, ProFormText, type ProFormInstance } from '@ant-design/pro-components';
import { erpLogin, errorStatus, selectBusinessUnit, type ApiError, type LoginRequest } from '@erp/api-client';
import { BrandMark } from '@erp/ui';
import { Alert, Button } from 'antd';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthFrame } from '@/components/AuthFrame';
import { useAuthStore } from '@/state/auth-store';

function loginErrorMessage(error: unknown, t: (key: string) => string) {
  switch (errorStatus(error)) {
    case 0:
      return t('auth.serverUnreachable');
    case 401:
      return t('auth.invalidCredentials');
    case 429:
      return t('auth.tooManyAttempts');
    case 403:
      return (error as ApiError).problem?.detail ?? t('auth.unexpected');
    default:
      return t('auth.unexpected');
  }
}

export function LoginPage() {
  const { t } = useTranslation();
  const formRef = useRef<ProFormInstance<LoginRequest>>(undefined);
  const [error, setError] = useState<string | null>(null);
  const signIn = useAuthStore((s) => s.signIn);
  const selectUnit = useAuthStore((s) => s.selectUnit);

  // The session is committed to the store in one go; the GuestOnly guard then routes to the picker or onward.
  const submit = async (values: LoginRequest) => {
    setError(null);
    try {
      const login = await erpLogin(values);
      const only = login.businessUnits.length === 1 ? login.businessUnits[0] : undefined;
      const selection = only
        ? await selectBusinessUnit(
            { businessUnitId: only.id },
            { headers: { Authorization: `Bearer ${login.accessToken}` } },
          )
        : undefined;

      signIn(login);
      if (selection) selectUnit(selection);
    } catch (e) {
      setError(loginErrorMessage(e, t));
    }
  };

  return (
    <AuthFrame>
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
            description="admin@demopharma.com · Demo@12345"
            action={
              <Button
                size="small"
                onClick={() => formRef.current?.setFieldsValue({ email: 'admin@demopharma.com', password: 'Demo@12345' })}
              >
                {t('auth.useDemo')}
              </Button>
            }
          />
        )}
      </LoginForm>
    </AuthFrame>
  );
}
