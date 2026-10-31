import { ApiOutlined, DatabaseOutlined, ReloadOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Descriptions, Skeleton, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';

export interface SystemStatus {
  apiOnline: boolean;
  databaseHealthy: boolean | undefined;
  databaseLatencyMs?: number;
  version?: string;
  environment?: string;
}

export interface SystemStatusCardProps {
  status: SystemStatus | undefined;
  loading: boolean;
  refreshing?: boolean;
  onRefresh: () => void;
}

/** Presentational card; apps feed it from the generated API hooks. */
export function SystemStatusCard({ status, loading, refreshing, onRefresh }: SystemStatusCardProps) {
  const { t } = useTranslation();

  return (
    <Card
      title={t('status.title')}
      extra={
        <Tooltip title={t('status.refresh')}>
          <Button type="text" size="small" icon={<ReloadOutlined spin={refreshing} />} onClick={onRefresh} />
        </Tooltip>
      }
    >
      {loading || !status ? (
        <Skeleton active paragraph={{ rows: 3 }} title={false} />
      ) : (
        <Descriptions column={1} size="small" colon={false} styles={{ label: { width: 120 } }}>
          <Descriptions.Item label={<><ApiOutlined /> {t('status.api')}</>}>
            <Badge
              status={status.apiOnline ? 'success' : 'error'}
              text={status.apiOnline ? t('status.online') : t('status.offline')}
            />
          </Descriptions.Item>
          <Descriptions.Item label={<><DatabaseOutlined /> {t('status.database')}</>}>
            {status.databaseHealthy === undefined ? (
              <Badge status="default" text="—" />
            ) : (
              <Badge
                status={status.databaseHealthy ? 'success' : 'error'}
                text={
                  (status.databaseHealthy ? t('status.healthy') : t('status.unhealthy')) +
                  (status.databaseLatencyMs !== undefined
                    ? ` · ${t('status.latency', { ms: status.databaseLatencyMs })}`
                    : '')
                }
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label={t('status.version')}>{status.version ?? '—'}</Descriptions.Item>
          <Descriptions.Item label={t('status.environment')}>{status.environment ?? '—'}</Descriptions.Item>
        </Descriptions>
      )}
    </Card>
  );
}
