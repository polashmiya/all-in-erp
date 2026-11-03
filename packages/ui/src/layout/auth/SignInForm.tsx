import { ArrowRightOutlined, LockOutlined, MailOutlined, WarningOutlined } from '@ant-design/icons';
import { Alert, Button, Form, Input, Typography } from 'antd';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface SignInValues {
  email: string;
  password: string;
}

export interface SignInFormProps {
  onSubmit: (values: SignInValues) => Promise<unknown>;
  error?: string | null;
  loading?: boolean;
  demo?: SignInValues;
  footer?: ReactNode;
}

export function AuthHeading({ title, lead }: { title: ReactNode; lead?: ReactNode }) {
  return (
    <div className="erp-auth__heading">
      <h1>{title}</h1>
      {lead && <p>{lead}</p>}
    </div>
  );
}

export function SignInForm({ onSubmit, error, loading, demo, footer }: SignInFormProps) {
  const { t } = useTranslation();
  const [form] = Form.useForm<SignInValues>();
  const [capsLock, setCapsLock] = useState(false);
  const trackCapsLock = (event: KeyboardEvent<HTMLInputElement>) =>
    setCapsLock(event.getModifierState('CapsLock'));

  return (
    <Form<SignInValues>
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={onSubmit}
      className="erp-form erp-auth__form"
      disabled={loading}
    >
      {error && <Alert type="error" showIcon message={error} className="erp-auth__alert" />}
      <Form.Item
        name="email"
        label={t('auth.email')}
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
            <Typography.Text type="warning">
              <WarningOutlined /> {t('auth.capsOn')}
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
      {demo && (
        <Alert
          type="info"
          showIcon
          className="erp-auth__alert"
          message={t('auth.demoAccount')}
          description={`${demo.email} · ${demo.password}`}
          action={
            <Button size="small" onClick={() => form.setFieldsValue(demo)}>
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
        loading={loading}
        className="erp-auth__submit"
      >
        {t('auth.signIn')} <ArrowRightOutlined />
      </Button>
      {footer && (
        <Typography.Text type="secondary" className="erp-auth__note">
          {footer}
        </Typography.Text>
      )}
    </Form>
  );
}
