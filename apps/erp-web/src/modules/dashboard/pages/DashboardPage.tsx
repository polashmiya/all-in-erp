import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { CardGrid, downloadCsv, PageContainer, PageState } from '@erp/ui';
import { Segmented } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { selectCurrentUnit, useAuthStore } from '@/common/store/auth-store';
import { itemPaths } from '@/modules/system-setup/item-management/item-profile/constants';
import {
  KpiGrid,
  RecentActivityCard,
  ReorderCard,
  SalesChartCard,
  StockByCategoryCard,
} from '../components/DashboardCards';
import { useDashboard } from '../services/dashboard.service';
import type { DashboardRange, SalesRange } from '../services/dashboard.types';

const RANGES: DashboardRange[] = ['today', '7d', '30d', 'qtr'];
const LONG_DATE = 'dddd, D MMMM YYYY';

function greetingKey(hour: number) {
  if (hour < 12) return 'dashboard.greetingMorning';
  if (hour < 17) return 'dashboard.greetingAfternoon';
  return 'dashboard.greetingEvening';
}

export function DashboardPage() {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const unit = useAuthStore(selectCurrentUnit);
  const [range, setRange] = useState<DashboardRange>('30d');
  const [salesRange, setSalesRange] = useState<SalesRange>('12m');
  const { data, isPending } = useDashboard(range, salesRange);
  const now = dayjs();

  const exportReorder = () =>
    data &&
    downloadCsv(t('dashboard.exportFile'), data.reorder, [
      { header: t('dashboard.colItem'), value: (r) => r.name },
      { header: t('dashboard.colCode'), value: (r) => r.id },
      { header: t('dashboard.colOnHandOnly'), value: (r) => r.onHand },
      { header: t('dashboard.colReorderLevel'), value: (r) => r.reorderLevel },
    ]);

  return (
    <PageState loading={isPending || !data}>
      <PageContainer
        title={t(greetingKey(now.hour()), { name: user?.fullName.split(' ')[0] ?? '' })}
        subTitle={t('dashboard.context', { unit: unit?.name ?? '—', date: now.format(LONG_DATE) })}
        extra={
          <Segmented<DashboardRange>
            aria-label={t('dashboard.range')}
            value={range}
            onChange={setRange}
            options={RANGES.map((value) => ({ value, label: t(`dashboard.${value}`) }))}
          />
        }
        actions={[
          {
            key: 'export',
            label: t('dashboard.export'),
            icon: <DownloadOutlined />,
            onClick: exportReorder,
          },
          {
            key: 'new',
            label: t('dashboard.newItem'),
            icon: <PlusOutlined />,
            variant: 'primary',
            to: itemPaths.create,
          },
        ]}
      >
        {data && (
          <>
            <KpiGrid kpis={data.kpis} />
            <CardGrid columns="2-1">
              <SalesChartCard data={data.sales} range={salesRange} onRangeChange={setSalesRange} />
              <StockByCategoryCard rows={data.stockByCategory} />
            </CardGrid>
            <CardGrid columns="2-1">
              <ReorderCard rows={data.reorder} total={data.kpis.lowStock.value} />
              <RecentActivityCard events={data.activity} />
            </CardGrid>
          </>
        )}
      </PageContainer>
    </PageState>
  );
}
