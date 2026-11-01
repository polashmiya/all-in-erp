import { ApartmentOutlined, EditOutlined, InboxOutlined, ShopOutlined, UserOutlined } from '@ant-design/icons';
import { useGetAccount } from '@erp/api-client';
import { useLanguageStore } from '@erp/ui';
import { Avatar, Badge, Button, Card, Descriptions, Drawer, Flex, Grid, Result, Skeleton, Space, Tag, Typography, theme } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { FeatureAccessSummary } from './components/FeatureAccess';
import { structureFromDetail } from './components/structure';
import { useStructureColors } from './components/structure-colors';
import { StructureTree } from './components/StructureTree';
import { countryName, initials } from './format';
import { MenuAccessModal } from './MenuAccessModal';

export function AccountDetailDrawer({ accountId, onClose }: { accountId: string | undefined; onClose: () => void }) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const screens = Grid.useBreakpoint();
  const language = useLanguageStore((s) => s.language);
  const colors = useStructureColors();
  const query = useGetAccount(accountId ?? '', { query: { enabled: !!accountId } });
  const account = query.data;
  const [editingMenus, setEditingMenus] = useState(false);

  const counts = account && {
    offices: account.businessUnits.reduce((sum, b) => sum + b.offices.length, 0),
    warehouses: account.businessUnits.reduce(
      (sum, b) => sum + b.warehouses.length + b.offices.reduce((s, o) => s + o.warehouses.length, 0),
      0,
    ),
  };

  return (
    <Drawer open={!!accountId} onClose={onClose} width={screens.md ? 720 : '100%'} destroyOnHidden title={t('detail.title')}>
      {query.isPending && <Skeleton active avatar paragraph={{ rows: 8 }} />}
      {query.isError && <Result status="warning" title={t('detail.loadFailed')} />}
      {account && counts && (
        <Space direction="vertical" size={20} style={{ width: '100%' }}>
          <Flex align="center" gap={16}>
            <Avatar shape="square" size={56} style={{ background: token.colorPrimary, fontSize: 20, fontWeight: 600, flexShrink: 0 }}>
              {initials(account.name)}
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <Flex align="center" gap={8} wrap>
                <Typography.Title level={4} style={{ margin: 0 }}>
                  {account.name}
                </Typography.Title>
                <Tag bordered={false} style={{ fontFamily: 'ui-monospace, monospace' }}>
                  {account.code}
                </Tag>
                {account.isActive ? (
                  <Badge status="success" text={t('accounts.status.active')} />
                ) : (
                  <Badge status="default" text={t('accounts.status.inactive')} />
                )}
              </Flex>
              <Typography.Text type="secondary">
                {[account.industry, account.city, countryName(account.country, language)].filter(Boolean).join(' · ')}
              </Typography.Text>
            </div>
          </Flex>

          <Descriptions
            bordered
            size="small"
            column={{ xs: 1, sm: 1, md: 2, lg: 2, xl: 2, xxl: 2 }}
            styles={{ label: { width: 130 } }}
            title={t('detail.profile')}
            items={[
              { key: 'email', label: t('field.email'), children: account.email ? <a href={`mailto:${account.email}`}>{account.email}</a> : '—' },
              { key: 'phone', label: t('field.phone'), children: account.phone ?? '—' },
              {
                key: 'website',
                label: t('field.website'),
                children: account.website ? (
                  <a href={account.website} target="_blank" rel="noreferrer">
                    {account.website}
                  </a>
                ) : (
                  '—'
                ),
              },
              { key: 'tax', label: t('field.taxId'), children: account.taxId ?? '—' },
              { key: 'address', label: t('field.address'), span: 'filled', children: account.address ?? '—' },
              { key: 'currency', label: t('field.baseCurrency'), children: account.baseCurrency },
              { key: 'tz', label: t('field.timeZone'), children: account.timeZone },
              { key: 'created', label: t('detail.created'), children: dayjs(account.createdAt).format('DD MMM YYYY, HH:mm') },
            ]}
          />

          <Card size="small" title={t('detail.admin')}>
            {account.admin ? (
              <Flex align="center" gap={12}>
                <Avatar icon={<UserOutlined />} style={{ background: token.colorPrimaryBg, color: token.colorPrimary }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Typography.Text strong>{account.admin.fullName}</Typography.Text>
                  <div>
                    <Typography.Text type="secondary" copyable={{ text: account.admin.email }}>
                      {account.admin.email}
                    </Typography.Text>
                  </div>
                </div>
                <Typography.Text type="secondary" style={{ fontSize: 12, textAlign: 'end' }}>
                  {t('detail.lastLogin')}
                  <br />
                  {account.admin.lastLoginAt ? dayjs(account.admin.lastLoginAt).format('DD MMM YYYY, HH:mm') : t('detail.never')}
                </Typography.Text>
              </Flex>
            ) : (
              <Typography.Text type="secondary">—</Typography.Text>
            )}
          </Card>

          <Card
            size="small"
            title={t('detail.structure')}
            extra={
              <Space size={14}>
                <span>
                  <ApartmentOutlined style={{ color: colors.unit }} /> {account.businessUnits.length}
                </span>
                <span>
                  <ShopOutlined style={{ color: colors.office }} /> {counts.offices}
                </span>
                <span>
                  <InboxOutlined style={{ color: colors.warehouse }} /> {counts.warehouses}
                </span>
              </Space>
            }
          >
            <StructureTree units={structureFromDetail(account.businessUnits)} />
          </Card>

          <Card
            size="small"
            title={t('menus.title')}
            extra={
              <Button size="small" type="link" icon={<EditOutlined />} onClick={() => setEditingMenus(true)}>
                {t('menus.edit')}
              </Button>
            }
          >
            <FeatureAccessSummary codes={account.featureCodes} />
          </Card>
          <MenuAccessModal
            accountId={account.id}
            accountName={account.name}
            initial={account.featureCodes}
            open={editingMenus}
            onClose={() => setEditingMenus(false)}
          />
        </Space>
      )}
    </Drawer>
  );
}
