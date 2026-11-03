import {
  CheckCircleOutlined,
  ImportOutlined,
  InboxOutlined,
  MoreOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  TagOutlined,
  UserAddOutlined,
  WalletOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  ActivityList,
  BarLineChart,
  BarList,
  ChartLegend,
  formatDelta,
  formatMoneyCompact,
  formatNumber,
  SectionCard,
  StatCard,
  StatusTag,
  type ActivityItem,
  type StatTint,
} from '@erp/ui';
import { App, Button, Segmented, Table, type TableColumnsType } from 'antd';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { itemPaths } from '@/modules/system-setup/item-management/item-profile/constants';
import type {
  ActivityKind,
  DashboardSummary,
  ReorderRow,
  SalesRange,
} from '../services/dashboard.types';

export function KpiGrid({ kpis }: { kpis: DashboardSummary['kpis'] }) {
  const { t } = useTranslation();

  return (
    <div className="erp-grid erp-grid--4">
      <StatCard
        icon={<InboxOutlined />}
        label={t('dashboard.totalItems')}
        value={formatNumber(kpis.totalItems.value)}
        caption={t('dashboard.vsLastMonth')}
        delta={{ text: formatDelta(kpis.totalItems.delta ?? 0), tone: 'success' }}
        trend={kpis.totalItems.trend}
      />
      <StatCard
        icon={<WalletOutlined />}
        tint="blue"
        label={t('dashboard.stockValue')}
        value={formatMoneyCompact(kpis.stockValue.value)}
        caption={t('dashboard.atPurchasePrice')}
        delta={{ text: formatDelta(kpis.stockValue.delta ?? 0), tone: 'success' }}
        trend={kpis.stockValue.trend}
      />
      <StatCard
        icon={<WarningOutlined />}
        tint="amber"
        label={t('dashboard.lowStock')}
        value={formatNumber(kpis.lowStock.value)}
        caption={t('dashboard.belowReorder')}
        delta={{ text: formatDelta(kpis.lowStock.delta ?? 0, ''), tone: 'warning' }}
        trend={kpis.lowStock.trend}
      />
      <StatCard
        icon={<ShoppingCartOutlined />}
        tint="violet"
        label={t('dashboard.pendingPos')}
        value={formatNumber(kpis.pendingPurchaseOrders.value)}
        caption={t('dashboard.awaitingReceipt')}
        delta={{ text: formatMoneyCompact(kpis.pendingPurchaseOrders.amount), tone: 'neutral' }}
        trend={kpis.pendingPurchaseOrders.trend}
      />
    </div>
  );
}

export function SalesChartCard({
  data,
  range,
  onRangeChange,
}: {
  data: DashboardSummary['sales'];
  range: SalesRange;
  onRangeChange: (range: SalesRange) => void;
}) {
  const { t } = useTranslation();
  const period = {
    '12m': t('dashboard.period12m'),
    '6m': t('dashboard.period6m'),
    '30d': t('dashboard.period30d'),
  }[range];

  return (
    <SectionCard
      title={t('dashboard.salesVsPurchases')}
      subtitle={t('dashboard.salesSubtitle', { period })}
      extra={
        <>
          <ChartLegend lineName={t('dashboard.sales')} barName={t('dashboard.purchases')} />
          <Segmented<SalesRange>
            size="small"
            value={range}
            onChange={onRangeChange}
            options={[
              { value: '12m', label: '12M' },
              { value: '6m', label: '6M' },
              { value: '30d', label: '30D' },
            ]}
          />
        </>
      }
    >
      <BarLineChart
        data={data}
        lineName={t('dashboard.sales')}
        barName={t('dashboard.purchases')}
        format={(v) => `${Math.round(v)}`}
        height={250}
      />
    </SectionCard>
  );
}

export function StockByCategoryCard({ rows }: { rows: DashboardSummary['stockByCategory'] }) {
  const { t } = useTranslation();
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const max = Math.max(...rows.map((r) => r.count), 1);

  return (
    <SectionCard
      title={t('dashboard.stockByCategory')}
      subtitle={t('dashboard.activeItems', { total: formatNumber(total) })}
    >
      <BarList
        items={rows.map((row) => ({
          key: row.category,
          label: row.category,
          value: `${formatNumber(row.count)} · ${Math.round((row.count / total) * 100)}%`,
          percent: (row.count / max) * 100,
        }))}
      />
    </SectionCard>
  );
}

export function ReorderCard({ rows, total }: { rows: ReorderRow[]; total: number }) {
  const { t } = useTranslation();
  const { message } = App.useApp();

  const columns: TableColumnsType<ReorderRow> = [
    {
      key: 'item',
      title: t('dashboard.colItem'),
      render: (_, row) => (
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <Link
            to={itemPaths.view(row.id)}
            style={{ color: 'var(--erp-text-strong)', fontWeight: 500 }}
          >
            {row.name}
          </Link>
          <span style={{ fontSize: 12, color: 'var(--erp-text-muted)' }}>{row.id}</span>
        </span>
      ),
    },
    {
      key: 'onHand',
      title: t('dashboard.colOnHand'),
      render: (_, row) => (
        <span style={{ fontWeight: 600 }}>
          {formatNumber(row.onHand)}{' '}
          <span style={{ color: 'var(--erp-text-muted)', fontWeight: 400 }}>
            / {formatNumber(row.reorderLevel)}
          </span>
        </span>
      ),
    },
    {
      key: 'status',
      title: t('dashboard.colStatus'),
      render: (_, row) =>
        row.onHand === 0 ? (
          <StatusTag tone="danger" dot>
            {t('dashboard.out')}
          </StatusTag>
        ) : (
          <StatusTag tone="warning" dot>
            {t('dashboard.low')}
          </StatusTag>
        ),
    },
    {
      key: 'action',
      title: <span className="sr-only">{t('dashboard.colAction')}</span>,
      align: 'end',
      render: () => (
        <Button
          size="small"
          color="primary"
          variant="filled"
          onClick={() => void message.info(t('dashboard.reorderUnavailable'))}
        >
          {t('dashboard.reorder')}
        </Button>
      ),
    },
  ];

  return (
    <SectionCard
      title={t('dashboard.needsReordering')}
      subtitle={t('dashboard.itemsBelowReorder', { count: total })}
      padding={0}
      extra={
        <Link to={itemPaths.list}>
          <Button size="small">{t('dashboard.viewAll')}</Button>
        </Link>
      }
    >
      <Table<ReorderRow>
        className="erp-table"
        rowKey="id"
        size="middle"
        columns={columns}
        dataSource={rows}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </SectionCard>
  );
}

const ACTIVITY_LOOK: Record<ActivityKind, { icon: ReactNode; tint: StatTint }> = {
  approved: { icon: <CheckCircleOutlined />, tint: 'green' },
  imported: { icon: <ImportOutlined />, tint: 'primary' },
  price: { icon: <TagOutlined />, tint: 'violet' },
  transfer: { icon: <SwapOutlined />, tint: 'amber' },
  user: { icon: <UserAddOutlined />, tint: 'slate' },
  received: { icon: <InboxOutlined />, tint: 'green' },
};

export function RecentActivityCard({ events }: { events: DashboardSummary['activity'] }) {
  const { t } = useTranslation();
  const items: ActivityItem[] = events.map((event) => ({
    key: event.id,
    ...ACTIVITY_LOOK[event.kind],
    text: (
      <Trans
        i18nKey={`dashboard.act.${event.kind}`}
        values={{ ref: event.ref, target: event.target }}
        components={{ b: <b /> }}
      />
    ),
    meta: `${event.actor} · ${event.at}`,
  }));

  return (
    <SectionCard
      title={t('dashboard.recentActivity')}
      extra={
        <Button
          type="text"
          size="small"
          icon={<MoreOutlined />}
          aria-label={t('table.moreActions')}
        />
      }
    >
      <ActivityList items={items} />
    </SectionCard>
  );
}
