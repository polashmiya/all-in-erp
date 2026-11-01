// AntD v5 needs this shim to render static methods (message/modal) under React 19.
import '@ant-design/v5-patch-for-react-19';

export { LoginIllustration } from './auth/LoginIllustration';
export { LoginLayout } from './auth/LoginLayout';
export type { LoginLayoutProps } from './auth/LoginLayout';
export { BrandMark } from './components/BrandMark';
export { BusinessUnitSwitcher } from './components/BusinessUnitSwitcher';
export type { BusinessUnitOption, BusinessUnitSwitcherProps } from './components/BusinessUnitSwitcher';
export { FullPageLoader } from './components/FullPageLoader';
export { LanguageSwitch, NotificationBell, ThemeToggle } from './components/HeaderActions';
export { ThemeSettingsButton, ThemeSettingsDrawer } from './components/ThemeSettings';
export {
  ErrorBoundary,
  ErrorResult,
  ForbiddenResult,
  NotFoundResult,
  RouteErrorResult,
} from './components/ResultPages';
export { SystemStatusCard } from './components/SystemStatusCard';
export type { SystemStatus, SystemStatusCardProps } from './components/SystemStatusCard';
export { initI18n, useLanguageStore } from './i18n/i18n';
export type { AppResources } from './i18n/i18n';
export { languageNames, languages, localize } from './i18n/language';
export type { Language, LocalizedText } from './i18n/language';
export { UiProvider } from './providers/UiProvider';
export { AppShell } from './shell/AppShell';
export type { AppShellProps, ShellUser } from './shell/AppShell';
export { collectGroupKeys, filterMenu, findTrail, flattenLeaves } from './shell/menu';
export type { MenuNode } from './shell/menu';
export { PlaceholderPage } from './shell/PlaceholderPage';
export type { PlaceholderPageProps } from './shell/PlaceholderPage';
export { iconNames, resolveIcon } from './shell/icons';
export { useHomePath, useShell } from './shell/ShellContext';
export { ShellFooter } from './shell/ShellFooter';
export { ShellPage } from './shell/ShellPage';
export type { ShellPageProps } from './shell/ShellPage';
export { buildBrand, siderStyles } from './theme/brand';
export type { Brand, SiderColors, SiderStyle, ThemeMode } from './theme/brand';
export { useBrand } from './theme/brand-context';
export { alpha, contrast, mix } from './theme/color';
export { DEFAULT_PRESET, findPreset, themePresets } from './theme/presets';
export type { ThemePreset, ThemePresetKey } from './theme/presets';
export { defaultAppearance, useResolvedMode, useThemeStore } from './theme/theme-store';
export type { ModePreference } from './theme/theme-store';
export { buildTheme, fontFamily } from './theme/tokens';
export type { ThemeOptions } from './theme/tokens';
