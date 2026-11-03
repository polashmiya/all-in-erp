import { ArrowRightOutlined, LockOutlined, MailOutlined, WarningOutlined } from '@ant-design/icons';
import {
  erpLogin,
  errorStatus,
  selectBusinessUnit,
  type ApiError,
  type LoginRequest,
} from '@erp/api-client';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { AuthLayout } from '../components/AuthLayout';
import { useAuthStore } from '@/common/store/auth-store';

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
  const [form] = Form.useForm<LoginRequest>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);
  const selectUnit = useAuthStore((s) => s.selectUnit);

  const submit = async (values: LoginRequest) => {
    setError(null);
    setSubmitting(true);
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
      setSubmitting(false);
    }
  };

  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(event.getModifierState('CapsLock'));

  return (
    <AuthLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <h1>{t('login.welcome')}</h1>
          <p className="erp-login__lead">{t('login.lead')}</p>
        </div>

        <Form<LoginRequest>
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={submit}
          className="erp-form"
          disabled={submitting}
        >
          {error && <Alert type="error" showIcon message={error} style={{ marginBottom: 20 }} />}
          <Form.Item
            name="email"
            label={t('login.email')}
            rules={[
              { required: true, message: t('auth.emailRequired') },
              { type: 'email', message: t('auth.emailInvalid') },
            ]}
          >
            <Input size="large" prefix={<MailOutlined />} autoComplete="username" autoFocus />
          </Form.Item>
          <Form.Item
            name="password"
            label={t('auth.password')}
            rules={[{ required: true, message: t('auth.passwordRequired') }]}
            extra={
              capsLock && (
                <Typography.Text type="warning" style={{ fontSize: 12 }}>
                  <WarningOutlined /> {t('login.capsOn')}
                </Typography.Text>
              )
            }
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              autoComplete="current-password"
              onKeyDown={trackCapsLock}
              onKeyUp={trackCapsLock}
            />
          </Form.Item>

          {import.meta.env.DEV && (
            <Alert
              type="info"
              showIcon
              style={{ marginBottom: 20 }}
              message={t('auth.demoAccount')}
              description="admin@demopharma.com · Demo@12345"
              action={
                <Button
                  size="small"
                  onClick={() =>
                    form.setFieldsValue({ email: 'admin@demopharma.com', password: 'Demo@12345' })
                  }
                >
                  {t('auth.useDemo')}
                </Button>
              }
            />
          )}

          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={submitting}
            style={{ height: 48, fontSize: 15, fontWeight: 600, borderRadius: 10 }}
          >
            {t('auth.signIn')} <ArrowRightOutlined />
          </Button>
        </Form>

        <Typography.Text type="secondary" style={{ fontSize: 13 }}>
          {t('login.newToTeam')} {t('login.askAdmin')}
        </Typography.Text>
      </div>
    </AuthLayout>
  );
}
