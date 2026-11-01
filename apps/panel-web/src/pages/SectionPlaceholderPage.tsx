import { PlaceholderPage } from '@erp/ui';
import { useTranslation } from 'react-i18next';

/**
 * Catch-all: a menu entry from the database whose screen is not built yet gets a placeholder;
 * a path that is not in the menu at all gets a 404.
 */
export function SectionPlaceholderPage() {
  const { t } = useTranslation();

  return <PlaceholderPage title={t('placeholder.title')} description={t('placeholder.text')} />;
}
