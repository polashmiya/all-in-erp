// AntD v5 needs this shim to render static methods (message/modal) under React 19.
import '@ant-design/v5-patch-for-react-19';

export { LoginIllustration } from './auth/LoginIllustration';
export { LoginLayout } from './auth/LoginLayout';
export type { LoginLayoutProps } from './auth/LoginLayout';
export { BrandMark } from './components/BrandMark';
export { BusinessUnitSwitcher } from './components/BusinessUnitSwitcher';
export type { BusinessUnitOption, BusinessUnitSwitcherProps } from './components/BusinessUnitSwitcher';
export { FullPageLoader } from './components/FullPageLoader';
export { LanguageSwitch, NotificationBell, PreferencesMenu, ThemeToggle } from './components/HeaderActions';
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
export { useShell } from './shell/ShellContext';
export { ShellFooter } from './shell/ShellFooter';
export { ShellPage } from './shell/ShellPage';
export type { ShellPageProps } from './shell/ShellPage';
export { useThemeStore } from './theme/theme-store';
export { brand, buildTheme, fontFamily } from './theme/tokens';
export type { ThemeMode, ThemeOptions } from './theme/tokens';
