import { generate } from '@ant-design/colors';
import { alpha, mix } from './color';
import type { ThemePreset } from './presets';

export type ThemeMode = 'light' | 'dark';

export type SiderStyle = 'tinted' | 'light' | 'dark' | 'brand';

export const siderStyles: SiderStyle[] = ['tinted', 'light', 'dark', 'brand'];

export interface SiderColors {
  bg: string;
  border: string;
  text: string;
  textMuted: string;
  hoverBg: string;
  hoverText: string;
  selectedBg: string;
  selectedText: string;
  /** Light text on a dark surface (dark / brand styles). */
  inverse: boolean;
}

/** Every colour the shell and pages need, derived from one preset for one mode and sidebar style. */
export interface Brand {
  key: string;
  mode: ThemeMode;
  primary: string;
  accent: string;
  /** Ten shades of the primary, light to dark (antd palette). */
  palette: string[];
  accentPalette: string[];
  /** Accent dark enough for icons on light surfaces. */
  accentIcon: string;
  info: string;
  layoutBg: string;
  containerBg: string;
  headerBg: string;
  borderSecondary: string;
  tableHeaderBg: string;
  rowHoverBg: string;
  /** A soft primary tint for highlighted areas (icon tiles, selected cards). */
  tintBg: string;
  textStrong: string;
  sider: SiderColors;
  /** Background for brand panels (login, dashboard hero): gradient plus accent glow. */
  hero: string;
  cardShadow: string;
}

const WHITE = '#FFFFFF';
const INK = '#111827';

function siderColors(style: SiderStyle, mode: ThemeMode, primary: string, palette: string[], containerBg: string): SiderColors {
  const light = mode === 'light';

  if (style === 'dark' || style === 'brand') {
    const bg =
      style === 'dark'
        ? mix(primary, light ? '#0F172A' : '#0A0E13', light ? 0.14 : 0.08)
        : light
          ? palette[7]!
          : mix(primary, '#0B0F14', 0.42);
    return {
      bg,
      border: mix(WHITE, bg, 0.08),
      text: mix(WHITE, bg, 0.82),
      textMuted: mix(WHITE, bg, 0.62),
      hoverBg: mix(WHITE, bg, 0.08),
      hoverText: WHITE,
      selectedBg: style === 'dark' ? primary : mix('#000000', bg, 0.28),
      selectedText: WHITE,
      inverse: true,
    };
  }

  if (light) {
    const bg = style === 'tinted' ? mix(primary, WHITE, 0.1) : containerBg;
    return {
      bg,
      border: mix(primary, WHITE, style === 'tinted' ? 0.18 : 0.1),
      text: '#1F2937',
      textMuted: '#4B5563',
      hoverBg: mix(primary, bg, 0.08),
      hoverText: INK,
      selectedBg: mix(primary, bg, 0.16),
      selectedText: palette[8]!,
      inverse: false,
    };
  }

  const bg = style === 'tinted' ? mix(primary, '#0F151B', 0.12) : containerBg;
  return {
    bg,
    border: mix(WHITE, bg, 0.07),
    text: '#D1D5DB',
    textMuted: '#9CA3AF',
    hoverBg: mix(WHITE, bg, 0.06),
    hoverText: WHITE,
    selectedBg: mix(primary, bg, 0.45),
    selectedText: WHITE,
    inverse: true,
  };
}

export function buildBrand(preset: ThemePreset, mode: ThemeMode, siderStyle: SiderStyle): Brand {
  const { primary, accent } = preset;
  const palette = generate(primary);
  const accentPalette = generate(accent);
  const light = mode === 'light';

  const layoutBg = light ? mix(primary, '#F7F9FA', 0.05) : mix(primary, '#0B0F14', 0.05);
  const containerBg = light ? WHITE : mix(primary, '#141A21', 0.04);

  return {
    key: preset.key,
    mode,
    primary,
    accent,
    palette,
    accentPalette,
    accentIcon: light ? accentPalette[6]! : accent,
    info: light ? '#2563EB' : '#60A5FA',
    layoutBg,
    containerBg,
    headerBg: containerBg,
    borderSecondary: light ? mix(primary, '#E5E9ED', 0.07) : mix(WHITE, containerBg, 0.08),
    tableHeaderBg: mix(primary, containerBg, light ? 0.06 : 0.1),
    rowHoverBg: mix(primary, containerBg, light ? 0.035 : 0.07),
    tintBg: mix(primary, containerBg, light ? 0.1 : 0.2),
    textStrong: light ? INK : '#F3F4F6',
    sider: siderColors(siderStyle, mode, primary, palette, containerBg),
    // Mid-to-deep shades of the primary with a light glow of its own tint. (An accent glow mixes into mud,
    // e.g. amber over teal turns olive, so the accent is used for details on top instead.)
    hero: [
      `radial-gradient(circle at 94% 6%, ${alpha(palette[2]!, 0.38)} 0%, ${alpha(palette[2]!, 0)} 30%)`,
      `radial-gradient(circle at 0% 100%, ${alpha(WHITE, 0.1)} 0%, ${alpha(WHITE, 0)} 45%)`,
      `linear-gradient(135deg, ${palette[5]} 0%, ${palette[6]} 50%, ${palette[7]} 100%)`,
    ].join(', '),
    cardShadow: light ? '0 1px 2px rgba(16, 24, 40, 0.04), 0 1px 3px rgba(16, 24, 40, 0.06)' : 'none',
  };
}
