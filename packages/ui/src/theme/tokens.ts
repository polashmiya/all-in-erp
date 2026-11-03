import { theme, type ThemeConfig } from 'antd';
import type { Brand, ThemeMode } from './brand';

export type { ThemeMode } from './brand';

export interface ThemeOptions {
  mode: ThemeMode;
  compact: boolean;
  brand: Brand;
}

export const fontFamily =
  "'Inter Variable', 'Inter', 'Hind Siliguri', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

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
      colorLink: light ? brand.primary : brand.palette[4],
      colorLinkHover: brand.primaryHover,
      colorBgLayout: brand.layoutBg,
      colorBgContainer: brand.containerBg,
      colorBorder: brand.border,
      colorBorderSecondary: brand.borderSecondary,
      colorSplit: brand.divider,
      colorText: brand.text,
      colorTextHeading: brand.textStrong,
      colorTextSecondary: brand.textSecondary,
      colorTextTertiary: brand.textMuted,
      colorTextDescription: brand.textMuted,
      colorTextPlaceholder: light ? '#8A94A3' : '#6B7280',
      colorFillAlter: brand.tableHeaderBg,
      controlOutline: brand.primarySoft,
      controlOutlineWidth: 3,
      borderRadius: 8,
      borderRadiusLG: 12,
      borderRadiusSM: 6,
      controlHeight: 38,
      controlHeightSM: 30,
      controlHeightLG: 46,
      fontFamily,
      fontSize: 14,
      boxShadowSecondary: light
        ? '0 16px 40px rgba(15, 23, 42, 0.16), 0 0 0 1px #E5E8EF'
        : '0 16px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.08)',
      wireframe: false,
    },
    components: {
      Button: {
        controlHeight: 34,
        controlHeightSM: 30,
        controlHeightLG: 46,
        paddingInline: 14,
        primaryShadow: 'none',
        defaultShadow: 'none',
        dangerShadow: 'none',
        fontWeight: 500,
        defaultBorderColor: brand.border,
      },
      Card: { headerFontSize: 15, headerHeight: 52, paddingLG: 20 },
      Menu: {
        itemBorderRadius: 8,
        subMenuItemBorderRadius: 8,
        itemMarginInline: 6,
        itemHeight: 36,
      },
      Dropdown: { paddingBlock: 8 },
      Table: {
        headerBg: brand.tableHeaderBg,
        headerColor: brand.textSecondary,
        headerSplitColor: 'transparent',
        headerBorderRadius: 0,
        borderColor: brand.divider,
        rowHoverBg: brand.rowHoverBg,
        rowSelectedBg: brand.tintBg,
        rowSelectedHoverBg: brand.tintBg,
        cellPaddingBlock: 10,
        cellPaddingInline: 12,
        cellFontSize: 13,
      },
      Tabs: {
        horizontalMargin: '0',
        horizontalItemPadding: '13px 12px',
        horizontalItemGutter: 4,
        itemColor: brand.textSecondary,
        titleFontSize: 14,
      },
      Segmented: {
        trackBg: brand.trackBg,
        trackPadding: 3,
        itemColor: brand.textSecondary,
        itemSelectedColor: brand.textStrong,
        itemSelectedBg: brand.containerBg,
        borderRadius: 8,
        borderRadiusSM: 6,
      },
      Tag: {
        defaultBg: light ? '#F1F5F9' : 'rgba(255, 255, 255, 0.06)',
        defaultColor: brand.textSecondary,
      },
      Switch: { trackHeight: 24, trackMinWidth: 40, handleSize: 20 },
      Checkbox: { borderRadiusSM: 5 },
      Steps: { iconSize: 30 },
      Modal: { borderRadiusLG: 14 },
      Popover: { borderRadiusLG: 14 },
      Pagination: { itemSize: 30, itemActiveBg: brand.textStrong },
    },
  };
}
