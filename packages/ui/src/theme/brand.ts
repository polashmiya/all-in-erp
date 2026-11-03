import { generate } from '@ant-design/colors';
import { alpha, mix } from './color';
import type { ThemePreset } from './presets';

export type ThemeMode = 'light' | 'dark';

export type SiderStyle = 'light' | 'dark' | 'brand';

export const siderStyles: SiderStyle[] = ['light', 'dark', 'brand'];

export interface SiderColors {
  bg: string;
  divider: string;
  text: string;
  strong: string;
  muted: string;
  icon: string;
  hoverBg: string;
  guide: string;
  inputBg: string;
  inputShadow: string;
  kbd: string;
  activeBg: string;
  activeText: string;
  activeIcon: string;
  activeShadow: string;
  bar: string;
  badgeBg: string;
  badgeText: string;
  panelBorder: string;
  inverse: boolean;
}

export interface Brand {
  key: string;
  mode: ThemeMode;
  primary: string;
  primaryHover: string;
  primarySoft: string;
  accent: string;
  palette: string[];
  accentPalette: string[];
  accentIcon: string;
  info: string;
  frameBg: string;
  layoutBg: string;
  containerBg: string;
  headerBg: string;
  headerBorder: string;
  border: string;
  borderSecondary: string;
  divider: string;
  tableHeaderBg: string;
  rowHoverBg: string;
  tintBg: string;
  textStrong: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  trackBg: string;
  sider: SiderColors;
  deep: string;
  cardShadow: string;
}

const WHITE = '#FFFFFF';
const BLACK = '#000000';

export function shade(color: string, amount: number): string {
  return mix(BLACK, color, amount);
}

function siderColors(
  style: SiderStyle,
  mode: ThemeMode,
  primary: string,
  palette: string[],
): SiderColors {
  if (style === 'brand') {
    const bg = shade(primary, 0.66);
    const activeBg = mix(WHITE, bg, 0.16);
    return {
      bg,
      divider: alpha(WHITE, 0.1),
      text: mix(WHITE, bg, 0.84),
      strong: WHITE,
      muted: mix(WHITE, bg, 0.66),
      icon: mix(WHITE, bg, 0.72),
      hoverBg: alpha(WHITE, 0.08),
      guide: alpha(WHITE, 0.18),
      inputBg: alpha(WHITE, 0.08),
      inputShadow: `inset 0 0 0 1px ${alpha(WHITE, 0.08)}`,
      kbd: alpha(WHITE, 0.22),
      activeBg,
      activeText: WHITE,
      activeIcon: WHITE,
      activeShadow: `inset 0 0 0 1px ${alpha(WHITE, 0.1)}`,
      bar: WHITE,
      badgeBg: alpha(WHITE, 0.18),
      badgeText: WHITE,
      panelBorder: 'transparent',
      inverse: true,
    };
  }

  if (style === 'dark' || mode === 'dark') {
    const bg = style === 'dark' ? '#0B0F17' : '#0E1218';
    return {
      bg,
      divider: alpha(WHITE, 0.07),
      text: '#C9CED6',
      strong: WHITE,
      muted: '#8B93A1',
      icon: '#8B93A1',
      hoverBg: alpha(WHITE, 0.06),
      guide: '#252B36',
      inputBg: alpha(WHITE, 0.06),
      inputShadow: `inset 0 0 0 1px ${alpha(WHITE, 0.06)}`,
      kbd: alpha(WHITE, 0.14),
      activeBg: mix(WHITE, bg, 0.1),
      activeText: WHITE,
      activeIcon: mode === 'dark' ? palette[4]! : WHITE,
      activeShadow: `inset 0 0 0 1px ${alpha(WHITE, 0.06)}`,
      bar: mode === 'dark' ? palette[4]! : primary,
      badgeBg: alpha(WHITE, 0.12),
      badgeText: '#F3F4F6',
      panelBorder: 'transparent',
      inverse: true,
    };
  }

  return {
    bg: '#F2F3F5',
    divider: '#E3E5E9',
    text: '#3D4452',
    strong: '#0E1320',
    muted: '#626A77',
    icon: '#6B7280',
    hoverBg: 'rgba(15, 23, 42, 0.05)',
    guide: '#D7DAE0',
    inputBg: WHITE,
    inputShadow: '0 0 0 1px #E3E5E9, 0 1px 2px rgba(15, 23, 42, 0.04)',
    kbd: '#E3E5E9',
    activeBg: WHITE,
    activeText: '#0E1320',
    activeIcon: primary,
    activeShadow: '0 0 0 1px #E3E5E9, 0 1px 2px rgba(15, 23, 42, 0.06)',
    bar: primary,
    badgeBg: '#E6E8EC',
    badgeText: '#3D4452',
    panelBorder: '#E3E5E9',
    inverse: false,
  };
}

export function buildBrand(preset: ThemePreset, mode: ThemeMode, siderStyle: SiderStyle): Brand {
  const { primary, accent } = preset;
  const palette = generate(primary);
  const accentPalette = generate(accent);
  const light = mode === 'light';
  const sider = siderColors(siderStyle, mode, primary, palette);

  const containerBg = light ? WHITE : '#161B22';

  return {
    key: preset.key,
    mode,
    primary,
    primaryHover: light ? shade(primary, 0.18) : palette[4]!,
    primarySoft: light ? mix(primary, WHITE, 0.12) : mix(primary, containerBg, 0.24),
    accent,
    palette,
    accentPalette,
    accentIcon: light ? accentPalette[6]! : accent,
    info: light ? '#1D4ED8' : '#60A5FA',
    frameBg: sider.bg,
    layoutBg: light ? '#F7F8FA' : '#10141A',
    containerBg,
    headerBg: containerBg,
    headerBorder: light ? '#ECEEF1' : alpha(WHITE, 0.08),
    border: light ? '#D5DAE3' : '#3A414D',
    borderSecondary: light ? '#E8EAEE' : alpha(WHITE, 0.08),
    divider: light ? '#F0F1F4' : alpha(WHITE, 0.06),
    tableHeaderBg: light ? '#FAFAFB' : '#1B212A',
    rowHoverBg: light ? '#F8FAFF' : alpha(WHITE, 0.03),
    tintBg: light ? mix(primary, WHITE, 0.12) : mix(primary, containerBg, 0.24),
    textStrong: light ? '#0E1320' : '#F3F4F6',
    text: light ? '#1F2937' : '#D1D5DB',
    textSecondary: light ? '#4B5563' : '#A3AAB6',
    textMuted: light ? '#5F6B7A' : '#8B93A1',
    trackBg: light ? '#EEF0F4' : alpha(WHITE, 0.06),
    sider,
    deep: shade(primary, 0.6),
    cardShadow: light ? '0 1px 2px rgba(15, 23, 42, 0.04)' : 'none',
  };
}
