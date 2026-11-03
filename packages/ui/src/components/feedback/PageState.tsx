import { Skeleton } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { PageContainer } from '../../layout/page/PageContainer';
import { ActionGroup } from '../actions/ActionGroup';
import type { ActionItem } from '../actions/types';
import { EmptyState } from './EmptyState';

export interface PageStateProps {
  loading?: boolean;
  missing?: boolean;
  missingTitle?: ReactNode;
  missingDescription?: ReactNode;
  missingActions?: ActionItem[];
  children: ReactNode;
}

export function PageState({
  loading,
  missing,
  missingTitle,
  missingDescription,
  missingActions = [],
  children,
}: PageStateProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <PageContainer title={false}>
        <section className="erp-card erp-card--pad">
          <Skeleton active paragraph={{ rows: 10 }} />
        </section>
      </PageContainer>
    );
  }

  if (missing) {
    return (
      <PageContainer title={false}>
        <section className="erp-card">
          <EmptyState
            title={missingTitle ?? t('common.notFound')}
            description={missingDescription}
            actions={missingActions.length ? <ActionGroup actions={missingActions} /> : undefined}
          />
        </section>
      </PageContainer>
    );
  }

  return <>{children}</>;
}
