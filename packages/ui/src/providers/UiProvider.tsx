import { ProConfigProvider } from '@ant-design/pro-components';
import { App as AntApp, ConfigProvider } from 'antd';
import bnBD from 'antd/es/locale/bn_BD';
import enUS from 'antd/es/locale/en_US';
import dayjs from 'dayjs';
import { useEffect, useMemo, type ReactNode } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { requiredMark } from '../components/fields/required-mark';
import { useLanguageStore } from '../i18n/i18n';
import { HomePathContext } from '../layout/app-shell/ShellContext';
import { buildBrand, type Brand } from '../theme/brand';
import { BrandContext } from '../theme/brand-context';
import { tokenVariables } from '../theme/design-tokens';
import { resolvePreset } from '../theme/presets';
import { buildTheme } from '../theme/tokens';
import { useResolvedMode, useThemeStore } from '../theme/theme-store';
import { proIntl } from './pro-intl';

const antdLocales = { en: enUS, bn: bnBD } as const;

function cssVariables(brand: Brand): Record<string, string> {
  const { sider } = brand;
  return {
    ...tokenVariables(brand.mode),
    '--erp-primary': brand.primary,
    '--erp-primary-hover': brand.primaryHover,
    '--erp-primary-soft': brand.primarySoft,
    '--erp-frame': brand.frameBg,
    '--erp-panel': brand.layoutBg,
    '--erp-surface': brand.containerBg,
    '--erp-header-border': brand.headerBorder,
    '--erp-border': brand.border,
    '--erp-border-2': brand.borderSecondary,
    '--erp-divider': brand.divider,
    '--erp-text-strong': brand.textStrong,
    '--erp-text': brand.text,
    '--erp-text-2': brand.textSecondary,
    '--erp-text-muted': brand.textMuted,
    '--erp-track': brand.trackBg,
    '--erp-table-head': brand.tableHeaderBg,
    '--erp-row-hover': brand.rowHoverBg,
    '--erp-tint': brand.tintBg,
    '--erp-card-shadow': brand.cardShadow,
    '--erp-deep': brand.deep,
    '--erp-accent': brand.accent,
    '--erp-brand-light': brand.palette[3]!,
    '--erp-brand-mid': brand.palette[5]!,
    '--erp-scrollbar':
      brand.mode === 'light' ? 'rgba(100, 110, 125, 0.35)' : 'rgba(255, 255, 255, 0.18)',
    '--sb-bg': sider.bg,
    '--sb-div': sider.divider,
    '--sb-tx': sider.text,
    '--sb-strong': sider.strong,
    '--sb-muted': sider.muted,
    '--sb-icon': sider.icon,
    '--sb-hv': sider.hoverBg,
    '--sb-guide': sider.guide,
    '--sb-input': sider.inputBg,
    '--sb-input-sh': sider.inputShadow,
    '--sb-kbd': sider.kbd,
    '--sb-act-bg': sider.activeBg,
    '--sb-act-tx': sider.activeText,
    '--sb-act-icon': sider.activeIcon,
    '--sb-act-sh': sider.activeShadow,
    '--sb-bar': sider.bar,
    '--sb-badge-bg': sider.badgeBg,
    '--sb-badge-tx': sider.badgeText,
    '--sb-panel-bd': sider.panelBorder,
  };
}

function DocumentThemeSync({ brand }: { brand: Brand }) {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = brand.mode;
    root.style.colorScheme = brand.mode;
    for (const [name, value] of Object.entries(cssVariables(brand)))
      root.style.setProperty(name, value);
    document.body.style.background = brand.frameBg;
    document.body.style.color = brand.text;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', brand.primary);
  }, [brand]);

  return null;
}

export function UiProvider({
  children,
  homePath = '/dashboard',
}: {
  children: ReactNode;
  homePath?: string;
}) {
  const { preset, customPrimary, sider, compact } = useThemeStore(
    useShallow((s) => ({
      preset: s.preset,
      customPrimary: s.customPrimary,
      sider: s.sider,
      compact: s.compact,
    })),
  );
  const mode = useResolvedMode();
  const language = useLanguageStore((s) => s.language);

  const brand = useMemo(
    () => buildBrand(resolvePreset(preset, customPrimary), mode, sider),
    [preset, customPrimary, mode, sider],
  );
  const themeConfig = useMemo(() => buildTheme({ mode, compact, brand }), [mode, compact, brand]);

  useEffect(() => {
    dayjs.locale(language);
  }, [language]);

  return (
    <ConfigProvider theme={themeConfig} locale={antdLocales[language]} form={{ requiredMark }}>
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
