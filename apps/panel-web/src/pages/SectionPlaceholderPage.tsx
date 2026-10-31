import { PlaceholderPage, useShell } from '@erp/ui';
import { useTranslation } from 'react-i18next';
import { plannedPhase } from '@/navigation/menu';

/** Catch-all: menu destinations without a page yet get a placeholder, anything else a 404. */
export function SectionPlaceholderPage() {
  const { t } = useTranslation();
  const { trail } = useShell();
  const phase = plannedPhase[trail.at(-1)?.key ?? ''];

  return (
    <PlaceholderPage
      title={t('placeholder.title')}
      description={phase ? t('placeholder.text') : t('placeholder.genericText')}
      tag={phase ? t('placeholder.phase', { phase }) : undefined}
    />
  );
}
