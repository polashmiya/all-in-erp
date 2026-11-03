import { PlaceholderPage } from '@erp/ui';
import { useTranslation } from 'react-i18next';

export function SectionPlaceholderPage() {
  const { t } = useTranslation();

  return <PlaceholderPage title={t('placeholder.title')} description={t('placeholder.text')} />;
}
