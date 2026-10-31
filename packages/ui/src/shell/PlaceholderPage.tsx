import { Card, Descriptions, Result, Tag } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';
import { NotFoundResult } from '../components/ResultPages';
import { useShell } from './ShellContext';
import { ShellPage } from './ShellPage';

export interface PlaceholderPageProps {
  icon?: ReactNode;
  title: string;
  description: string;
  /** Label/value rows shown under the message, e.g. feature key and route. */
  details?: { label: string; value: ReactNode }[];
  tag?: string;
}

/**
 * Frame for menu destinations that exist in navigation but are not built yet.
 * Routes that are not in the menu at all fall through to a 404.
 */
export function PlaceholderPage({ icon, title, description, details = [], tag }: PlaceholderPageProps) {
  const { t } = useTranslation();
  const { trail } = useShell();
  const { pathname } = useLocation();
  const leaf = trail.at(-1);

  if (!leaf) return <NotFoundResult />;

  return (
    <ShellPage tags={tag ? <Tag color="processing">{tag}</Tag> : undefined}>
      <Card>
        <Result
          icon={icon ?? leaf.icon}
          title={title}
          subTitle={description}
          style={{ paddingBlock: 32 }}
          extra={
            <Descriptions
              column={1}
              size="small"
              bordered
              style={{ maxWidth: 520, margin: '0 auto', textAlign: 'start' }}
              items={[
                ...details.map((row) => ({ key: row.label, label: row.label, children: row.value })),
                { key: '__route', label: t('shell.route'), children: <code>{pathname}</code> },
              ]}
            />
          }
        />
      </Card>
    </ShellPage>
  );
}
