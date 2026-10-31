import { theme, type ThemeConfig } from 'antd';

export type ThemeMode = 'light' | 'dark';

export interface ThemeOptions {
  mode: ThemeMode;
  compact: boolean;
}

export const brand = {
  primary: '#2F54EB',
  success: '#389E0D',
  warning: '#D48806',
  error: '#CF1322',
} as const;

export const fontFamily =
  "'Inter Variable', 'Inter', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

const surfaces = {
  light: { layout: '#F4F6FA', container: '#FFFFFF', tableHeader: '#F7F8FA' },
  dark: { layout: '#0E1117', container: '#161B22', tableHeader: '#1C222B' },
} as const;

/** Builds the AntD theme for both apps. Every visual decision lives here, not in components. */
export function buildTheme({ mode, compact }: ThemeOptions): ThemeConfig {
  const surface = surfaces[mode];
  const algorithm = [mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm];
  if (compact) algorithm.push(theme.compactAlgorithm);

  return {
    algorithm,
    token: {
      colorPrimary: brand.primary,
      colorInfo: brand.primary,
      colorSuccess: brand.success,
      colorWarning: brand.warning,
      colorError: brand.error,
      colorBgLayout: surface.layout,
      colorBgContainer: surface.container,
      borderRadius: 8,
      borderRadiusLG: 10,
      fontFamily,
      fontSize: 14,
      wireframe: false,
    },
    components: {
      Button: { primaryShadow: 'none', defaultShadow: 'none', dangerShadow: 'none', fontWeight: 500 },
      Card: { headerFontSize: 15 },
      Menu: { itemBorderRadius: 6, subMenuItemBorderRadius: 6, itemMarginInline: 8 },
      Table: { headerBg: surface.tableHeader, headerSplitColor: 'transparent' },
      Tabs: { horizontalMargin: '0 0 16px 0' },
    },
  };
}
