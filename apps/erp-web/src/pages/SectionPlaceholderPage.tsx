import { PlaceholderPage } from '@erp/ui';
import { useTranslation } from 'react-i18next';

/** Catch-all: menu destinations without a page yet get a placeholder, anything else a 404. */
export function SectionPlaceholderPage() {
  const { t } = useTranslation();

  return <PlaceholderPage title={t('placeholder.sectionTitle')} description={t('placeholder.sectionText')} />;
}
