import {
  ApartmentOutlined,
  BankOutlined,
  InboxOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { ProTable, type ActionType, type ProColumns } from '@ant-design/pro-components';
import { listAccounts, type AccountListItem, type AccountSummary } from '@erp/api-client';
import { mix, ShellPage, useBrand, useLanguageStore } from '@erp/ui';
import { Avatar, Badge, Button, Card, Col, Empty, Flex, Row, Space, Statistic, Tooltip, Typography, theme } from 'antd';
import dayjs from 'dayjs';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { AccountDetailDrawer } from './AccountDetailDrawer';
import { useStructureColors } from './components/structure-colors';
import { countryName, initials } from './format';

type StatusFilter = 'all' | 'active' | 'inactive';

const SORT_FIELDS: Record<string, string> = { name: 'name', createdAt: 'createdAt' };

function StatCard({
  icon,
  title,
  value,
  hint,
  loading,
  color,
}: {
  icon: ReactNode;
  title: string;
  value?: number;
  hint?: string;
  loading: boolean;
  color: string;
}) {
  const brand = useBrand();
  return (
    <Card style={{ height: '100%', overflow: 'hidden' }} styles={{ body: { padding: 20, position: 'relative' } }}>
      {/* a soft corner glow in the card's colour */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          insetInlineEnd: -28,
          top: -28,
          width: 96,
          height: 96,
          borderRadius: '50%',
          background: mix(color, brand.containerBg, 0.08),
        }}
      />
      <Flex align="center" gap={16} style={{ position: 'relative' }}>
        <Avatar
          shape="square"
          size={48}
          icon={icon}
          style={{ background: mix(color, brand.containerBg, 0.14), color, flexShrink: 0, borderRadius: 12 }}
        />
        <div>
          <Statistic title={title} value={value ?? 0} loading={loading} valueStyle={{ fontSize: 24, fontWeight: 600 }} />
          {hint && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {hint}
            </Typography.Text>
          )}
        </div>
      </Flex>
    </Card>
  );
}

export function AccountsPage() {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const language = useLanguageStore((s) => s.language);
  const colors = useStructureColors();
  const actionRef = useRef<ActionType>(undefined);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [search, setSearch] = useState('');
  const [summary, setSummary] = useState<AccountSummary>();
  const [selectedId, setSelectedId] = useState<string>();

  const startSetup = () => navigate('/accounts/new');
  const filtered = search !== '' || status !== 'all';

  const columns: ProColumns<AccountListItem>[] = [
    {
      title: t('accounts.col.account'),
      dataIndex: 'name',
      sorter: true,
      fixed: 'left',
      width: 250,
      render: (_, account) => (
        <Flex align="center" gap={12}>
          <Avatar shape="square" size={40} style={{ background: token.colorPrimaryBg, color: token.colorPrimary, fontWeight: 600, flexShrink: 0 }}>
            {initials(account.name)}
          </Avatar>
          <div style={{ minWidth: 0 }}>
            <Button type="link" onClick={() => setSelectedId(account.id)} style={{ padding: 0, height: 'auto', fontWeight: 600, maxWidth: '100%' }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.name}</span>
            </Button>
            <Flex align="center" gap={8}>
              <Typography.Text type="secondary" style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace' }}>
                {account.code}
              </Typography.Text>
              <Badge
                status={account.isActive ? 'success' : 'default'}
                text={
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {account.isActive ? t('accounts.status.active') : t('accounts.status.inactive')}
                  </Typography.Text>
                }
              />
            </Flex>
          </div>
        </Flex>
      ),
    },
    {
      title: t('accounts.col.contact'),
      dataIndex: 'email',
      width: 220,
      render: (_, account) => (
        <Space direction="vertical" size={0}>
          <Typography.Text ellipsis style={{ maxWidth: 200 }}>
            <MailOutlined style={{ color: token.colorTextTertiary, marginInlineEnd: 6 }} />
            {account.email ?? '—'}
          </Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            <PhoneOutlined style={{ marginInlineEnd: 6 }} />
            {account.phone ?? '—'}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: t('accounts.col.location'),
      dataIndex: 'city',
      width: 130,
      render: (_, account) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{account.city ?? '—'}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 13 }}>
            {countryName(account.country, language)}
          </Typography.Text>
        </Space>
      ),
    },
    {
      title: t('accounts.col.structure'),
      dataIndex: 'businessUnits',
      width: 140,
      render: (_, account) => (
        <Space size={10}>
          <Tooltip title={t('accounts.stat.businessUnits')}>
            <span>
              <ApartmentOutlined style={{ color: colors.unit }} /> {account.businessUnits}
            </span>
          </Tooltip>
          <Tooltip title={t('accounts.stat.offices')}>
            <span>
              <ShopOutlined style={{ color: colors.office }} /> {account.offices}
            </span>
          </Tooltip>
          <Tooltip title={t('accounts.stat.warehouses')}>
            <span>
              <InboxOutlined style={{ color: colors.warehouse }} /> {account.warehouses}
            </span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: t('accounts.col.admin'),
      dataIndex: 'adminEmail',
      ellipsis: true,
      render: (_, account) => account.adminEmail ?? '—',
    },
    {
      title: t('accounts.col.created'),
      dataIndex: 'createdAt',
      sorter: true,
      width: 125,
      render: (_, account) => dayjs(account.createdAt).format('DD MMM YYYY'),
    },
    {
      title: '',
      valueType: 'option',
      fixed: 'right',
      width: 70,
      render: (_, account) => [
        <Button key="view" type="link" size="small" style={{ padding: 0 }} onClick={() => setSelectedId(account.id)}>
          {t('accounts.view')}
        </Button>,
      ],
    },
  ];

  return (
    <ShellPage
      subTitle={t('accounts.subtitle')}
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={startSetup}>
          {t('accounts.new')}
        </Button>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} xl={6}>
          <StatCard
            icon={<BankOutlined />}
            color={colors.account}
            title={t('accounts.stat.accounts')}
            value={summary?.accounts}
            hint={summary ? t('accounts.stat.active', { count: summary.activeAccounts }) : undefined}
            loading={!summary}
          />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard icon={<ApartmentOutlined />} color={colors.unit} title={t('accounts.stat.businessUnits')} value={summary?.businessUnits} loading={!summary} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard icon={<ShopOutlined />} color={colors.office} title={t('accounts.stat.offices')} value={summary?.offices} loading={!summary} />
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <StatCard icon={<InboxOutlined />} color={colors.warehouse} title={t('accounts.stat.warehouses')} value={summary?.warehouses} loading={!summary} />
        </Col>
      </Row>

      <ProTable<AccountListItem, { search: string; status: StatusFilter }>
        rowKey="id"
        actionRef={actionRef}
        columns={columns}
        params={{ search, status }}
        request={async (params, sort) => {
          const [field, order] = Object.entries(sort ?? {}).find(([, value]) => value) ?? [];
          const sortKey = field && SORT_FIELDS[field] ? `${order === 'descend' ? '-' : ''}${SORT_FIELDS[field]}` : undefined;
          const result = await listAccounts({
            search: params.search || undefined,
            status: params.status,
            sort: sortKey,
            page: params.current,
            pageSize: params.pageSize,
          });
          setSummary(result.summary);
          return { data: result.items, total: result.total, success: true };
        }}
        search={false}
        cardBordered
        scroll={{ x: 1060 }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true }}
        options={{ reload: true, density: true, setting: true }}
        toolbar={{
          menu: {
            type: 'tab',
            activeKey: status,
            items: (['all', 'active', 'inactive'] as const).map((key) => ({ key, label: t(`accounts.tab.${key}`) })),
            onChange: (key) => setStatus((key as StatusFilter) ?? 'all'),
          },
          search: {
            placeholder: t('accounts.search'),
            allowClear: true,
            style: { width: 320 },
            onSearch: (value: string) => setSearch(value.trim()),
          },
        }}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={filtered ? t('accounts.noMatch') : t('accounts.empty')}
              style={{ paddingBlock: 24 }}
            >
              {!filtered && (
                <Button type="primary" icon={<PlusOutlined />} onClick={startSetup}>
                  {t('accounts.setupFirst')}
                </Button>
              )}
            </Empty>
          ),
        }}
      />

      <AccountDetailDrawer accountId={selectedId} onClose={() => setSelectedId(undefined)} />
    </ShellPage>
  );
}
