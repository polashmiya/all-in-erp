import { SafetyCertificateOutlined } from '@ant-design/icons';
import type { AccountSetupResult } from '@erp/api-client';
import { Alert, Button, Card, Descriptions, Result, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

export function SetupSuccess({ result, onDone, onAnother }: { result: AccountSetupResult; onDone: () => void; onAnother: () => void }) {
  const { t } = useTranslation();
  const password = result.admin.generatedPassword;

  return (
    <Card>
      <Result
        status="success"
        title={t('success.title', { name: result.name })}
        subTitle={t('success.subtitle', {
          code: result.code,
          units: result.businessUnits,
          offices: result.offices,
          warehouses: result.warehouses,
        })}
        extra={[
          <Button key="list" type="primary" onClick={onDone}>
            {t('success.toList')}
          </Button>,
          <Button key="again" onClick={onAnother}>
            {t('success.another')}
          </Button>,
        ]}
      >
        <Card
          size="small"
          title={
            <Space>
              <SafetyCertificateOutlined />
              {t('success.credentials')}
            </Space>
          }
          style={{ maxWidth: 560, margin: '0 auto', textAlign: 'start' }}
        >
          <Descriptions
            column={1}
            size="small"
            items={[
              { key: 'name', label: t('field.fullName'), children: result.admin.fullName },
              { key: 'email', label: t('field.loginEmail'), children: <Typography.Text copyable>{result.admin.email}</Typography.Text> },
              {
                key: 'password',
                label: t('field.password'),
                children: password ? (
                  <Typography.Text copyable code strong style={{ fontSize: 15 }}>
                    {password}
                  </Typography.Text>
                ) : (
                  <Typography.Text type="secondary">{t('success.passwordChosen')}</Typography.Text>
                ),
              },
            ]}
          />
          {password && <Alert type="warning" showIcon message={t('success.passwordOnce')} style={{ marginTop: 12 }} />}
        </Card>
      </Result>
    </Card>
  );
}
