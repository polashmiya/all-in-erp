import { BellOutlined, CheckOutlined, MoonOutlined, SunOutlined, TranslationOutlined } from '@ant-design/icons';
import { Badge, Button, Dropdown, Empty, Popover, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../i18n/i18n';
import { languageNames, languages } from '../i18n/language';
import { useResolvedMode, useThemeStore } from '../theme/theme-store';

/** Quick light/dark switch; the appearance drawer offers "system" and the other options. */
export function ThemeToggle() {
  const { t } = useTranslation();
  const mode = useResolvedMode();
  const setMode = useThemeStore((s) => s.setMode);
  const label = mode === 'dark' ? t('shell.lightMode') : t('shell.darkMode');

  return (
    <Tooltip title={label}>
      <Button
        type="text"
        aria-label={label}
        icon={mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
      />
    </Tooltip>
  );
}

export function LanguageSwitch() {
  const { t } = useTranslation();
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectable: true,
        selectedKeys: [language],
        items: languages.map((lng) => ({
          key: lng,
          label: languageNames[lng],
          extra: lng === language ? <CheckOutlined /> : undefined,
        })),
        onClick: ({ key }) => setLanguage(key as typeof language),
      }}
    >
      <Button type="text" aria-label={t('shell.language')} icon={<TranslationOutlined />}>
        {language === 'en' ? 'EN' : 'বাং'}
      </Button>
    </Dropdown>
  );
}

export function NotificationBell({ count = 0 }: { count?: number }) {
  const { t } = useTranslation();

  return (
    <Popover
      trigger="click"
      placement="bottomRight"
      title={t('shell.notifications')}
      content={
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={t('shell.noNotifications')}
          style={{ width: 260, margin: '8px 0' }}
        />
      }
    >
      <Button
        type="text"
        aria-label={t('shell.notifications')}
        icon={
          <Badge count={count} size="small" offset={[2, -2]}>
            <BellOutlined />
          </Badge>
        }
      />
    </Popover>
  );
}
