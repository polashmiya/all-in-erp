import type { LocalizedText } from '../i18n/language';

/**
 * A theme colour preset: the primary drives every surface, the accent is used for highlights and decoration.
 * Primaries are deep enough for white text to meet WCAG AA (enforced by a unit test).
 */
export interface ThemePreset {
  key: string;
  name: LocalizedText;
  primary: string;
  accent: string;
}

export const themePresets = [
  { key: 'teal', name: { en: 'Teal', bn: 'টিল' }, primary: '#0B8478', accent: '#F59E0B' },
  { key: 'ocean', name: { en: 'Ocean', bn: 'সমুদ্র' }, primary: '#0369A1', accent: '#F97316' },
  { key: 'indigo', name: { en: 'Indigo', bn: 'ইন্ডিগো' }, primary: '#4F46E5', accent: '#06B6D4' },
  { key: 'emerald', name: { en: 'Emerald', bn: 'পান্না' }, primary: '#047857', accent: '#8B5CF6' },
  { key: 'violet', name: { en: 'Violet', bn: 'বেগুনি' }, primary: '#6D28D9', accent: '#EC4899' },
  { key: 'rose', name: { en: 'Rose', bn: 'গোলাপ' }, primary: '#BE123C', accent: '#0EA5E9' },
  { key: 'sunset', name: { en: 'Sunset', bn: 'সূর্যাস্ত' }, primary: '#C2410C', accent: '#14B8A6' },
  { key: 'graphite', name: { en: 'Graphite', bn: 'গ্রাফাইট' }, primary: '#334155', accent: '#14B8A6' },
  { key: 'royal', name: { en: 'Royal', bn: 'রয়্যাল' }, primary: '#2F54EB', accent: '#13C2C2' },
] as const satisfies readonly ThemePreset[];

export type ThemePresetKey = (typeof themePresets)[number]['key'];

export const DEFAULT_PRESET: ThemePresetKey = 'teal';

export function findPreset(key: string | undefined): ThemePreset {
  return themePresets.find((p) => p.key === key) ?? themePresets[0];
}
