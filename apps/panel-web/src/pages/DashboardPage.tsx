import {
  ApartmentOutlined,
  AppstoreAddOutlined,
  BankOutlined,
  CloudUploadOutlined,
  FormOutlined,
  LayoutOutlined,
} from '@ant-design/icons';
import { useSystemStatus } from '@erp/api-client';
import { ShellPage, SystemStatusCard } from '@erp/ui';
import { Avatar, Button, Card, Col, List, Row, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

interface Step {
  key: string;
  icon: ReactNode;
  to: string;
}

const steps: Step[] = [
  { key: 'step1', icon: <BankOutlined />, to: '/tenants/accounts' },
  { key: 'step2', icon: <ApartmentOutlined />, to: '/tenants/business-units' },
  { key: 'step3', icon: <AppstoreAddOutlined />, to: '/configuration/features' },
  { key: 'step4', icon: <FormOutlined />, to: '/configuration/fields' },
  { key: 'step5', icon: <LayoutOutlined />, to: '/configuration/layouts' },
  { key: 'step6', icon: <CloudUploadOutlined />, to: '/configuration/layouts' },
];

export function DashboardPage() {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const systemStatus = useSystemStatus();

  return (
    <ShellPage title={t('dashboard.title')} subTitle={t('dashboard.subtitle')}>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card title={t('dashboard.workflow')}>
            <List
              itemLayout="horizontal"
              dataSource={steps}
              renderItem={(step, index) => (
                <List.Item
                  actions={[
                    <Link key="go" to={step.to}>
                      <Button size="small">{t('dashboard.go')}</Button>
                    </Link>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size={40}
                        icon={step.icon}
                        style={{ background: token.colorPrimaryBg, color: token.colorPrimary }}
                      />
                    }
                    title={
                      <Typography.Text strong>
                        {index + 1}. {t(`dashboard.${step.key}`)}
                      </Typography.Text>
                    }
                    description={t(`dashboard.${step.key}Text`)}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <SystemStatusCard {...systemStatus} />
        </Col>
      </Row>
    </ShellPage>
  );
}
