import { theme, type ThemeConfig } from 'antd';
import type { Brand, ThemeMode } from './brand';

export type { ThemeMode } from './brand';

export interface ThemeOptions {
  mode: ThemeMode;
  compact: boolean;
  brand: Brand;
}

export const fontFamily =
  "'Inter Variable', 'Inter', 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

/** Builds the AntD theme for both apps from the active brand. Every visual decision lives here, not in components. */
export function buildTheme({ mode, compact, brand }: ThemeOptions): ThemeConfig {
  const light = mode === 'light';
  const algorithm = [light ? theme.defaultAlgorithm : theme.darkAlgorithm];
  if (compact) algorithm.push(theme.compactAlgorithm);

  return {
    algorithm,
    token: {
      colorPrimary: brand.primary,
      colorInfo: brand.info,
      colorSuccess: light ? '#16A34A' : '#22C55E',
      colorWarning: light ? '#D97706' : '#F59E0B',
      colorError: light ? '#DC2626' : '#F87171',
      colorLink: light ? brand.primary : brand.palette[3],
      colorBgLayout: brand.layoutBg,
      colorBgContainer: brand.containerBg,
      colorBorderSecondary: brand.borderSecondary,
      colorTextHeading: brand.textStrong,
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 6,
      fontFamily,
      fontSize: 14,
      wireframe: false,
    },
    components: {
      Button: {
        primaryShadow: light ? `0 2px 6px ${brand.palette[2]}` : 'none',
        defaultShadow: 'none',
        dangerShadow: 'none',
        fontWeight: 500,
      },
      Card: { headerFontSize: 15 },
      Menu: { itemBorderRadius: 8, subMenuItemBorderRadius: 8, itemMarginInline: 8 },
      Table: {
        headerBg: brand.tableHeaderBg,
        headerColor: brand.textStrong,
        headerSplitColor: 'transparent',
        rowHoverBg: brand.rowHoverBg,
      },
      Tabs: { horizontalMargin: '0 0 16px 0' },
      Steps: { iconSize: 30 },
      Segmented: { itemSelectedColor: light ? brand.palette[7] : '#FFFFFF' },
    },
  };
}
