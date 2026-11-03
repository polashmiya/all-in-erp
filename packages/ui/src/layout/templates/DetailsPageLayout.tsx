import { Tabs } from 'antd';
import type { ReactNode } from 'react';
import type { ActionItem } from '../../components/actions/types';
import { RecordHeader, type RecordHeaderProps } from '../../components/data-display/RecordHeader';
import { MiniStatGrid, type MiniStatItem } from '../../components/data-display/StatGrid';
import { PageState } from '../../components/feedback/PageState';
import { PageContainer } from '../page/PageContainer';
import { SplitLayout } from '../page/CardGrid';

export interface DetailsTab {
  key: string;
  label: ReactNode;
  content: ReactNode;
}

export interface DetailsPageLayoutProps {
  loading?: boolean;
  missing?: boolean;
  missingTitle?: ReactNode;
  missingActions?: ActionItem[];
  crumbs?: string[];
  header?: RecordHeaderProps;
  stats?: MiniStatItem[];
  tabs?: DetailsTab[];
  tabsLabel?: string;
  children?: ReactNode;
  aside?: ReactNode;
}

export function DetailsPageLayout({
  loading,
  missing,
  missingTitle,
  missingActions,
  crumbs,
  header,
  stats,
  tabs,
  tabsLabel,
  children,
  aside,
}: DetailsPageLayoutProps) {
  return (
    <PageState
      loading={loading}
      missing={missing}
      missingTitle={missingTitle}
      missingActions={missingActions}
    >
      <PageContainer title={false} crumbs={crumbs}>
        {header && <RecordHeader {...header} />}
        {stats && stats.length > 0 && <MiniStatGrid items={stats} />}
        <SplitLayout
          aside={aside}
          main={
            <section className="erp-card">
              {tabs ? (
                <Tabs
                  className="erp-card-tabs"
                  aria-label={tabsLabel}
                  items={tabs.map((tb) => ({ key: tb.key, label: tb.label, children: tb.content }))}
                />
              ) : (
                children
              )}
            </section>
          }
        />
      </PageContainer>
    </PageState>
  );
}
