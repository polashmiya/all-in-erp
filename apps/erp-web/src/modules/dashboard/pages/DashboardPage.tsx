import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@erp/ui';
import { Button, Flex, Segmented, Skeleton, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { selectCurrentUnit, useAuthStore } from '@/common/store/auth-store';
import { downloadCsv } from '@/common/utils/download';
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
  const firstName = user?.fullName.split(' ')[0] ?? '';

  const exportReorder = () =>
    data &&
    downloadCsv(t('dashboard.exportFile'), data.reorder, [
      { header: t('dashboard.colItem'), value: (r) => r.name },
      { header: 'Code', value: (r) => r.id },
      { header: 'On hand', value: (r) => r.onHand },
      { header: 'Reorder level', value: (r) => r.reorderLevel },
    ]);

  return (
    <PageContainer
      title={t(greetingKey(now.hour()), { name: firstName })}
      subTitle={
        <Tooltip title={t('dashboard.sampleData')} placement="bottomLeft">
          <span>
            {t('dashboard.context', {
              unit: unit?.name ?? '—',
              date: now.format('dddd, D MMMM YYYY'),
            })}
          </span>
        </Tooltip>
      }
      extra={
        <>
          <Segmented<DashboardRange>
            aria-label={t('dashboard.range')}
            value={range}
            onChange={setRange}
            options={(['today', '7d', '30d', 'qtr'] as const).map((value) => ({
              value,
              label: t(`dashboard.${value}`),
            }))}
          />
          <Button icon={<DownloadOutlined />} onClick={exportReorder} disabled={!data}>
            {t('dashboard.export')}
          </Button>
          <Link to={itemPaths.create}>
            <Button type="primary" icon={<PlusOutlined />}>
              {t('dashboard.newItem')}
            </Button>
          </Link>
        </>
      }
    >
      {isPending || !data ? (
        <Flex vertical gap={16}>
          <Skeleton active paragraph={{ rows: 2 }} />
          <Skeleton active paragraph={{ rows: 8 }} />
        </Flex>
      ) : (
        <>
          <KpiGrid kpis={data.kpis} />
          <div className="erp-grid erp-grid--2-1">
            <SalesChartCard data={data.sales} range={salesRange} onRangeChange={setSalesRange} />
            <StockByCategoryCard rows={data.stockByCategory} />
          </div>
          <div className="erp-grid erp-grid--2-1">
            <ReorderCard rows={data.reorder} total={data.kpis.lowStock.value} />
            <RecentActivityCard events={data.activity} />
          </div>
        </>
      )}
    </PageContainer>
  );
}
