import { ProConfigProvider } from '@ant-design/pro-components';
import { App as AntApp, ConfigProvider } from 'antd';
import bnBD from 'antd/es/locale/bn_BD';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import { useEffect, useMemo, type ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useLanguageStore } from '../i18n/i18n';
import { HomePathContext } from '../shell/ShellContext';
import { buildBrand, type Brand } from '../theme/brand';
import { BrandContext } from '../theme/brand-context';
import { findPreset } from '../theme/presets';
import { buildTheme } from '../theme/tokens';
import { useResolvedMode, useThemeStore } from '../theme/theme-store';
import { proIntl } from './pro-intl';

const antdLocales = { en: enUS, bn: bnBD } as const;

/** Keeps <html>/<body> and a few CSS variables in step with the active theme. */
function DocumentThemeSync({ brand }: { brand: Brand }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = brand.mode;
    root.style.colorScheme = brand.mode;
    root.style.setProperty('--erp-card-shadow', brand.cardShadow);
    root.style.setProperty('--erp-primary', brand.primary);
    root.style.setProperty('--erp-scrollbar', brand.mode === 'light' ? brand.palette[2]! : 'rgba(255, 255, 255, 0.18)');
    document.body.style.background = brand.layoutBg;
    document.body.style.color = brand.textStrong;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', brand.primary);
  }, [brand]);

  return null;
}

/** Theme (colour preset, mode, sidebar style, density), locale and AntD app context for both apps. */
export function UiProvider({ children, homePath = '/dashboard' }: { children: ReactNode; homePath?: string }) {
  const { preset, sider, compact } = useThemeStore(useShallow((s) => ({ preset: s.preset, sider: s.sider, compact: s.compact })));
  const mode = useResolvedMode();
  const language = useLanguageStore((s) => s.language);

  const brand = useMemo(() => buildBrand(findPreset(preset), mode, sider), [preset, mode, sider]);
  const themeConfig = useMemo(() => buildTheme({ mode, compact, brand }), [mode, compact, brand]);

  // ProConfigProvider sets the global dayjs locale (falling back to zh-cn) in its own effect.
  // Parent effects run after child effects, so re-asserting it here keeps dates in our language.
  useEffect(() => {
    dayjs.locale(language);
  }, [language]);

  return (
    <ConfigProvider theme={themeConfig} locale={antdLocales[language]}>
      <ProConfigProvider dark={mode === 'dark'} intl={proIntl[language]} hashed={false}>
        <AntApp>
          <BrandContext.Provider value={brand}>
            <DocumentThemeSync brand={brand} />
            <HomePathContext.Provider value={homePath}>{children}</HomePathContext.Provider>
          </BrandContext.Provider>
        </AntApp>
      </ProConfigProvider>
    </ConfigProvider>
  );
}
