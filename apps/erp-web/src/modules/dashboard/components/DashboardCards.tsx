import {
  CheckCircleOutlined,
  ImportOutlined,
  InboxOutlined,
  ShoppingCartOutlined,
  SwapOutlined,
  TagOutlined,
  UserAddOutlined,
  WalletOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import {
  ActionButton,
  ActivityList,
  BarLineChart,
  BarList,
  ChartLegend,
  DotValue,
  formatDelta,
  formatMoneyCompact,
  formatNumber,
  SectionCard,
  StatGrid,
  StatusTag,
  TitleCell,
  type ActivityItem,
  type ActionItem,
  type Tint,
} from '@erp/ui';
import { App, Segmented, Table, type TableColumnsType } from 'antd';
import type { ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { itemPaths } from '@/modules/system-setup/item-management/item-profile/constants';
import type {
  ActivityKind,
  DashboardSummary,
  ReorderRow,
  SalesRange,
} from '../services/dashboard.types';

const SALES_RANGES: SalesRange[] = ['12m', '6m', '30d'];
const CHART_HEIGHT = 250;

export function KpiGrid({ kpis }: { kpis: DashboardSummary['kpis'] }) {
  const { t } = useTranslation();

  return (
    <StatGrid
      items={[
        {
          key: 'items',
          icon: <InboxOutlined />,
          label: t('dashboard.totalItems'),
          value: formatNumber(kpis.totalItems.value),
          caption: t('dashboard.vsLastMonth'),
          delta: { text: formatDelta(kpis.totalItems.delta ?? 0), tone: 'success' },
          trend: kpis.totalItems.trend,
        },
        {
          key: 'value',
          icon: <WalletOutlined />,
          tint: 'blue',
          label: t('dashboard.stockValue'),
          value: formatMoneyCompact(kpis.stockValue.value),
          caption: t('dashboard.atPurchasePrice'),
          delta: { text: formatDelta(kpis.stockValue.delta ?? 0), tone: 'success' },
          trend: kpis.stockValue.trend,
        },
        {
          key: 'low',
          icon: <WarningOutlined />,
          tint: 'amber',
          label: t('dashboard.lowStock'),
          value: formatNumber(kpis.lowStock.value),
          caption: t('dashboard.belowReorder'),
          delta: { text: formatDelta(kpis.lowStock.delta ?? 0, ''), tone: 'warning' },
          trend: kpis.lowStock.trend,
        },
        {
          key: 'po',
          icon: <ShoppingCartOutlined />,
          tint: 'violet',
          label: t('dashboard.pendingPos'),
          value: formatNumber(kpis.pendingPurchaseOrders.value),
          caption: t('dashboard.awaitingReceipt'),
          delta: { text: formatMoneyCompact(kpis.pendingPurchaseOrders.amount), tone: 'neutral' },
          trend: kpis.pendingPurchaseOrders.trend,
        },
      ]}
    />
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

  return (
    <SectionCard
      title={t('dashboard.salesVsPurchases')}
      subtitle={t('dashboard.salesSubtitle', { period: t(`dashboard.period${range}`) })}
      extra={
        <>
          <ChartLegend lineName={t('dashboard.sales')} barName={t('dashboard.purchases')} />
          <Segmented<SalesRange>
            size="small"
            value={range}
            onChange={onRangeChange}
            options={SALES_RANGES.map((value) => ({ value, label: t(`dashboard.range${value}`) }))}
          />
        </>
      }
    >
      <BarLineChart
        data={data}
        lineName={t('dashboard.sales')}
        barName={t('dashboard.purchases')}
        format={(v) => formatNumber(v)}
        height={CHART_HEIGHT}
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

  const reorderAction: ActionItem = {
    key: 'reorder',
    label: t('dashboard.reorder'),
    variant: 'soft',
    onClick: () => void message.info(t('dashboard.reorderUnavailable')),
  };

  const columns: TableColumnsType<ReorderRow> = [
    {
      key: 'item',
      title: t('dashboard.colItem'),
      render: (_, row) => <TitleCell title={row.name} subtitle={row.id} />,
    },
    {
      key: 'onHand',
      title: t('dashboard.colOnHand'),
      render: (_, row) => (
        <DotValue tone={row.onHand === 0 ? 'danger' : 'warning'}>
          {formatNumber(row.onHand)} / {formatNumber(row.reorderLevel)}
        </DotValue>
      ),
    },
    {
      key: 'status',
      title: t('dashboard.colStatus'),
      render: (_, row) => (
        <StatusTag tone={row.onHand === 0 ? 'danger' : 'warning'} dot>
          {row.onHand === 0 ? t('dashboard.out') : t('dashboard.low')}
        </StatusTag>
      ),
    },
    {
      key: 'action',
      title: <span className="sr-only">{t('dashboard.colAction')}</span>,
      align: 'end',
      render: () => <ActionButton action={reorderAction} size="small" />,
    },
  ];

  return (
    <SectionCard
      title={t('dashboard.needsReordering')}
      subtitle={t('dashboard.itemsBelowReorder', { count: total })}
      padding="none"
      actions={[{ key: 'all', label: t('dashboard.viewAll'), to: itemPaths.list }]}
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

const ACTIVITY_LOOK: Record<ActivityKind, { icon: ReactNode; tint: Tint }> = {
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
    <SectionCard title={t('dashboard.recentActivity')}>
      <ActivityList items={items} />
    </SectionCard>
  );
}
