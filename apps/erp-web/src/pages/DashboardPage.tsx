import { ArrowRightOutlined } from '@ant-design/icons';
import { useSystemStatus } from '@erp/api-client';
import { flattenLeaves, localize, ShellPage, SystemStatusCard, useBrand, useLanguageStore, type MenuNode } from '@erp/ui';
import { Avatar, Card, Col, Flex, List, Row, Space, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { erpMenu } from '@/navigation/menu';
import { selectCurrentUnit, useAuthStore } from '@/state/auth-store';

function greetingKey(hour: number) {
  if (hour < 12) return 'dashboard.greetingMorning';
  if (hour < 17) return 'dashboard.greetingAfternoon';
  return 'dashboard.greetingEvening';
}

const modules = erpMenu.filter((node) => node.children?.length);

function ModuleCard({ module }: { module: MenuNode }) {
  const { t } = useTranslation();
  const brand = useBrand();
  const language = useLanguageStore((s) => s.language);
  const features = flattenLeaves([module]);
  const first = features[0];

  return (
    <Card
      hoverable
      styles={{ body: { padding: 20 } }}
      actions={
        first?.path
          ? [
              <Link key="open" to={first.path}>
                {t('dashboard.open')} <ArrowRightOutlined />
              </Link>,
            ]
          : undefined
      }
    >
      <Flex gap={14} align="flex-start">
        <Avatar
          shape="square"
          size={44}
          icon={module.icon}
          style={{ background: brand.tintBg, color: brand.mode === 'light' ? brand.primary : brand.palette[3], flexShrink: 0, borderRadius: 12 }}
        />
        <div style={{ minWidth: 0 }}>
          <Typography.Title level={5} style={{ margin: 0 }}>
            {localize(module.label, language)}
          </Typography.Title>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {t('dashboard.subModuleCount', { count: module.children?.length ?? 0 })} ·{' '}
            {t('dashboard.featureCount', { count: features.length })}
          </Typography.Text>
          <div style={{ marginTop: 12 }}>
            {features.slice(0, 4).map((feature) => (
              <Tag key={feature.key} bordered={false} style={{ marginBottom: 6 }}>
                <Link to={feature.path!}>{localize(feature.label, language)}</Link>
              </Tag>
            ))}
            {features.length > 4 && <Tag bordered={false}>+{features.length - 4}</Tag>}
          </div>
        </div>
      </Flex>
    </Card>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const brand = useBrand();
  const user = useAuthStore((s) => s.user);
  const unit = useAuthStore(selectCurrentUnit);
  const userName = user?.fullName ?? '';
  const accountName = user?.accountName ?? '';
  const systemStatus = useSystemStatus();
  const now = dayjs();

  return (
    <ShellPage title={false} breadcrumb={undefined}>
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <Card
          variant="borderless"
          style={{
            background: brand.hero,
            overflow: 'hidden',
          }}
          styles={{ body: { padding: '28px 32px' } }}
        >
          <Typography.Text style={{ color: 'rgba(255,255,255,0.75)' }}>{now.format('dddd, D MMMM YYYY')}</Typography.Text>
          <Typography.Title level={3} style={{ color: '#fff', margin: '6px 0 4px' }}>
            {t(greetingKey(now.hour()), { name: userName })}
          </Typography.Title>
          <Typography.Text style={{ color: 'rgba(255,255,255,0.85)' }}>
            {t('dashboard.context', { account: accountName, unit: unit?.name ?? '—' })}
          </Typography.Text>
        </Card>

        <Row gutter={[16, 16]}>
          <Col xs={24} xl={16}>
            <Card title={t('dashboard.modules')} extra={<Typography.Text type="secondary">{t('dashboard.modulesHint')}</Typography.Text>}>
              <List
                grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 3 }}
                dataSource={modules}
                renderItem={(module) => (
                  <List.Item>
                    <ModuleCard module={module} />
                  </List.Item>
                )}
              />
            </Card>
          </Col>
          <Col xs={24} xl={8}>
            <SystemStatusCard {...systemStatus} />
          </Col>
        </Row>
      </Space>
    </ShellPage>
  );
}
