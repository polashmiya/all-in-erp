import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../i18n/i18n';
import { languageNames, languages, type Language } from '../../i18n/language';

export function LanguageSegmented({ size = 'middle' }: { size?: 'small' | 'middle' }) {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <Segmented<Language>
      size={size}
      aria-label={t('shell.language')}
      value={language}
      onChange={setLanguage}
      options={languages.map((lng) => ({
        value: lng,
        label: lng === 'en' ? 'EN' : languageNames[lng],
      }))}
    />
  );
}
