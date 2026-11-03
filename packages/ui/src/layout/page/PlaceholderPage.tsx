import { Descriptions } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { StatusTag } from '../../components/data-display/StatusTag';
import { EmptyState } from '../../components/feedback/EmptyState';
import { NotFoundResult } from '../../components/feedback/ResultPages';
import { useShell } from '../app-shell/ShellContext';
import { PageContainer } from './PageContainer';

export interface PlaceholderPageProps {
  icon?: ReactNode;
  title: string;
  description: string;
  details?: { label: string; value: ReactNode }[];
  tag?: string;
}

export function PlaceholderPage({
  icon,
  title,
  description,
  details = [],
  tag,
}: PlaceholderPageProps) {
  const { t } = useTranslation();
  const { trail } = useShell();
  const { pathname } = useLocation();
  const leaf = trail.at(-1);

  if (!leaf) return <NotFoundResult />;

  return (
    <PageContainer tags={tag ? <StatusTag tone="info">{tag}</StatusTag> : undefined}>
      <section className="erp-card" style={{ padding: '40px 24px' }}>
        <EmptyState
          icon={icon ?? leaf.icon}
          title={title}
          description={description}
          actions={
            <Descriptions
              column={1}
              size="small"
              bordered
              style={{ width: 'min(520px, 100%)', textAlign: 'start' }}
              items={[
                ...details.map((row) => ({
                  key: row.label,
                  label: row.label,
                  children: row.value,
                })),
                { key: '__route', label: t('shell.route'), children: <code>{pathname}</code> },
              ]}
            />
          }
        />
      </section>
    </PageContainer>
  );
}
