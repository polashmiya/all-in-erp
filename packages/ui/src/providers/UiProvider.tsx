import { ProConfigProvider } from '@ant-design/pro-components';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import bnBD from 'antd/es/locale/bn_BD';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import { useEffect, useMemo, type ReactNode } from 'react';
import { useLanguageStore } from '../i18n/i18n';
import { buildTheme } from '../theme/tokens';
import { useThemeStore } from '../theme/theme-store';
import { proIntl } from './pro-intl';

const antdLocales = { en: enUS, bn: bnBD } as const;

/** Keeps <html>/<body> in step with the active theme so scrollbars and overscroll match. */
function DocumentThemeSync() {
  const { token } = theme.useToken();
  const mode = useThemeStore((s) => s.mode);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = mode;
    root.style.colorScheme = mode;
    document.body.style.background = token.colorBgLayout;
    document.body.style.color = token.colorText;
  }, [mode, token.colorBgLayout, token.colorText]);

  return null;
}

/** Theme, locale and AntD app context (message/modal/notification) for both apps. */
export function UiProvider({ children }: { children: ReactNode }) {
  const mode = useThemeStore((s) => s.mode);
  const compact = useThemeStore((s) => s.compact);
  const language = useLanguageStore((s) => s.language);
  const themeConfig = useMemo(() => buildTheme({ mode, compact }), [mode, compact]);

  // ProConfigProvider sets the global dayjs locale (falling back to zh-cn) in its own effect.
  // Parent effects run after child effects, so re-asserting it here keeps dates in our language.
  useEffect(() => {
    dayjs.locale(language);
  }, [language]);

  return (
    <ConfigProvider theme={themeConfig} locale={antdLocales[language]}>
      <ProConfigProvider dark={mode === 'dark'} intl={proIntl[language]} hashed={false}>
        <AntApp>
          <DocumentThemeSync />
          {children}
        </AntApp>
      </ProConfigProvider>
    </ConfigProvider>
  );
}
