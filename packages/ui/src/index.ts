import '@ant-design/v5-patch-for-react-19';

export * from './components/actions';
export * from './components/brand';
export * from './components/charts';
export * from './components/data-display';
export * from './components/dropdown';
export * from './components/feedback';
export * from './components/fields';
export * from './components/filters';
export * from './components/icons';
export * from './components/navigation';
export * from './components/overlays';
export * from './components/table';
export * from './components/upload';
export * from './hooks';
export { initI18n, mergeResources, useLanguageStore } from './i18n/i18n';
export type { AppResources } from './i18n/i18n';
export { languageNames, languages, localize } from './i18n/language';
export type { Language, LocalizedText } from './i18n/language';
export * from './layout/app-shell';
export * from './layout/auth';
export * from './layout/page';
export * from './layout/templates';
export { UiProvider } from './providers/UiProvider';
export { buildBrand, shade, siderStyles } from './theme/brand';
export type { Brand, SiderColors, SiderStyle, ThemeMode } from './theme/brand';
export { useBrand } from './theme/brand-context';
export { alpha, contrast, mix } from './theme/color';
export {
  CUSTOM_PRESET,
  DEFAULT_PRESET,
  findPreset,
  resolvePreset,
  themePresets,
} from './theme/presets';
export type { ThemePreset, ThemePresetKey } from './theme/presets';
export { defaultAppearance, useResolvedMode, useThemeStore } from './theme/theme-store';
export type { ModePreference } from './theme/theme-store';
export { buildTheme } from './theme/tokens';
export {
  breakpoints,
  controlHeight,
  fontFamily,
  fontSize,
  radius,
  sizes,
  space,
  tintOrder,
  tones,
  tints,
} from './theme/design-tokens';
export type { Tint, Tone, ToneColors } from './theme/design-tokens';
export type { ThemeOptions } from './theme/tokens';
export * from './utils';
