import {
  AppstoreOutlined,
  ArrowRightOutlined,
  ControlOutlined,
  EyeOutlined,
  LockOutlined,
  MailOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import { errorStatus, panelLogin, type LoginRequest } from '@erp/api-client';
import { LoginLayout } from '@erp/ui';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useState, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/common/store/auth-store';

const errorKeys: Record<number, string> = {
  0: 'auth.serverUnreachable',
  401: 'auth.invalidCredentials',
  429: 'auth.tooManyAttempts',
};

export function LoginPage() {
  const { t } = useTranslation();
  const [form] = Form.useForm<LoginRequest>();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);

  const submit = async (values: LoginRequest) => {
    setError(null);
    setSubmitting(true);
    try {
      signIn(await panelLogin(values));
    } catch (e) {
      setError(t(errorKeys[errorStatus(e)] ?? 'auth.unexpected'));
      setSubmitting(false);
    }
  };

  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(event.getModifierState('CapsLock'));

  return (
    <LoginLayout
      appName="myErp Panel"
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
        { icon: <ControlOutlined />, title: t('login.point1'), description: t('login.point1Text') },
        {
          icon: <AppstoreOutlined />,
          title: t('login.point2'),
          description: t('login.point2Text'),
        },
        { icon: <EyeOutlined />, title: t('login.point3'), description: t('login.point3Text') },
      ]}
      footerNote={t('login.footer', { year: new Date().getFullYear() })}
    >
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
              description="superadmin@myerp.local · Admin@12345"
              action={
                <Button
                  size="small"
                  onClick={() =>
                    form.setFieldsValue({
                      email: 'superadmin@myerp.local',
                      password: 'Admin@12345',
                    })
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
          {t('login.internalOnly')}
        </Typography.Text>
      </div>
    </LoginLayout>
  );
}
