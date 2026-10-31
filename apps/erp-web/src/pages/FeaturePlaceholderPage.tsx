import { AppstoreAddOutlined } from '@ant-design/icons';
import { PlaceholderPage } from '@erp/ui';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';

/** Stand-in for /app/:module/:feature until Phase 5 renders the resolved screen here. */
export function FeaturePlaceholderPage() {
  const { t } = useTranslation();
  const { module, feature } = useParams();

  return (
    <PlaceholderPage
      icon={<AppstoreAddOutlined />}
      title={t('placeholder.featureTitle')}
      description={t('placeholder.featureText')}
      tag={t('placeholder.status')}
      details={[{ label: t('placeholder.featureKey'), value: <code>{`${module}.${feature}`}</code> }]}
    />
  );
}
