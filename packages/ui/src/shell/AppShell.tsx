import { LogoutOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { ProLayout, type MenuDataItem } from '@ant-design/pro-components';
import { Dropdown, Input, Tag, Typography, theme, type MenuProps } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { BrandMark } from '../components/BrandMark';
import { LanguageSwitch, NotificationBell, ThemeToggle } from '../components/HeaderActions';
import { ThemeSettingsButton } from '../components/ThemeSettings';
import { ErrorBoundary } from '../components/ResultPages';
import { useLanguageStore } from '../i18n/i18n';
import { localize, type Language } from '../i18n/language';
import { useBrand } from '../theme/brand-context';
import { useThemeStore } from '../theme/theme-store';
import { collectGroupKeys, filterMenu, findTrail, type MenuNode } from './menu';
import { ShellContext, useHomePath } from './ShellContext';

export interface ShellUser {
  name: string;
  /** Second line in the user menu, e.g. role or company. */
  description?: string;
  avatarUrl?: string;
}

export interface AppShellProps {
  appName: string;
  /** Small tag beside the product name, e.g. "Panel" or "ERP". */
  appBadge?: string;
  menu: MenuNode[];
  /** Shows a skeleton in the sider while a server-provided menu loads. */
  menuLoading?: boolean;
  user: ShellUser;
  /** Rendered first in the header actions, e.g. the business-unit switcher. */
  headerExtra?: ReactNode;
  /** Extra user-menu entries shown above "Sign out". */
  userMenuItems?: NonNullable<MenuProps['items']>;
  onUserMenuClick?: (key: string) => void;
  onLogout?: () => void;
  footer?: ReactNode;
  children: ReactNode;
}

/** Group nodes have no route; ProLayout still needs a unique path to key them. */
const GROUP_PATH_PREFIX = '/__menu/';

function toRoutes(nodes: MenuNode[], language: Language): MenuDataItem[] {
  return nodes.map((node) => ({
    key: node.key,
    path: node.path ?? `${GROUP_PATH_PREFIX}${node.key}`,
    name: localize(node.label, language),
    icon: node.icon,
    children: node.children ? toRoutes(node.children, language) : undefined,
  }));
}

/**
 * The application frame shared by Panel and ERP: ProLayout in "mix" mode (full-width header,
 * collapsible sider), a searchable three-level menu, and the standard header actions.
 */
export function AppShell({
  appName,
  appBadge,
  menu,
  menuLoading = false,
  user,
  headerExtra,
  userMenuItems = [],
  onUserMenuClick,
  onLogout,
  footer,
  children,
}: AppShellProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { pathname } = useLocation();
  const homePath = useHomePath();
  const brand = useBrand();
  const language = useLanguageStore((s) => s.language);
  const collapsed = useThemeStore((s) => s.siderCollapsed);
  const setCollapsed = useThemeStore((s) => s.setSiderCollapsed);
  const [keyword, setKeyword] = useState('');

  const searching = keyword.trim().length > 0;
  const filtered = useMemo(() => filterMenu(menu, keyword, language), [menu, keyword, language]);
  const route = useMemo(() => ({ path: '/', children: toRoutes(filtered, language) }), [filtered, language]);
  const trail = useMemo(() => findTrail(menu, pathname), [menu, pathname]);
  const shell = useMemo(() => ({ menu, trail }), [menu, trail]);

  // Header, sidebar and page background come from the brand (theme colour + sidebar style + mode).
  const layoutToken = useMemo(
    () => ({
      bgLayout: brand.layoutBg,
      header: {
        colorBgHeader: brand.headerBg,
        colorHeaderTitle: brand.textStrong,
        colorTextRightActionsItem: token.colorTextSecondary,
        colorBgRightActionsItemHover: brand.tintBg,
        heightLayoutHeader: 60,
      },
      sider: {
        colorMenuBackground: brand.sider.bg,
        colorMenuItemDivider: brand.sider.border,
        colorTextMenu: brand.sider.text,
        colorTextMenuSecondary: brand.sider.textMuted,
        colorTextMenuTitle: brand.sider.text,
        colorTextMenuActive: brand.sider.hoverText,
        colorTextMenuItemHover: brand.sider.hoverText,
        colorTextMenuSelected: brand.sider.selectedText,
        colorBgMenuItemHover: brand.sider.hoverBg,
        colorBgMenuItemSelected: brand.sider.selectedBg,
        colorBgMenuItemCollapsedElevated: brand.sider.inverse ? brand.sider.bg : brand.containerBg,
        colorBgCollapsedButton: brand.containerBg,
        colorTextCollapsedButton: token.colorTextSecondary,
        colorTextCollapsedButtonHover: brand.primary,
      },
      pageContainer: {
        colorBgPageContainer: 'transparent',
        paddingBlockPageContainerContent: 16,
        paddingInlinePageContainerContent: 24,
      },
    }),
    [brand, token.colorTextSecondary],
  );

  const userMenu: MenuProps = {
    items: [
      {
        key: '__identity',
        disabled: true,
        style: { cursor: 'default' },
        label: (
          <div style={{ minWidth: 180 }}>
            <Typography.Text strong>{user.name}</Typography.Text>
            {user.description && (
              <div>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {user.description}
                </Typography.Text>
              </div>
            )}
          </div>
        ),
      },
      { type: 'divider' },
      { key: 'profile', icon: <UserOutlined />, label: t('shell.profile') },
      ...userMenuItems,
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: t('shell.logout'), danger: true, disabled: !onLogout },
    ],
    onClick: ({ key }) => (key === 'logout' ? onLogout?.() : onUserMenuClick?.(key)),
  };

  return (
    <ShellContext.Provider value={shell}>
      <ProLayout
        layout="mix"
        splitMenus={false}
        fixedHeader
        fixSiderbar
        siderWidth={256}
        token={layoutToken}
        logo={<BrandMark />}
        title={appName}
        menuHeaderRender={false}
        headerTitleRender={(logo, title) => (
          <Link to={homePath} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {logo}
            {title}
            {appBadge && (
              <Tag
                bordered={false}
                style={{ marginInlineEnd: 0, fontWeight: 600, background: brand.tintBg, color: brand.mode === 'light' ? brand.palette[7] : brand.palette[2] }}
              >
                {appBadge}
              </Tag>
            )}
          </Link>
        )}
        location={{ pathname }}
        route={route}
        menu={{ locale: false, loading: menuLoading }}
        openKeys={searching ? collectGroupKeys(filtered) : undefined}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        menuItemRender={(item, dom) =>
          item.path && !item.path.startsWith(GROUP_PATH_PREFIX) ? <Link to={item.path}>{dom}</Link> : dom
        }
        menuExtraRender={({ collapsed: isCollapsed }) =>
          isCollapsed ? undefined : (
            <div style={{ padding: '8px 4px 4px' }}>
              <Input
                allowClear
                className={`erp-sider-search${brand.sider.inverse ? ' is-inverse' : ''}`}
                prefix={<SearchOutlined style={{ color: brand.sider.textMuted }} />}
                placeholder={t('shell.searchMenu')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                style={{
                  background: brand.sider.inverse ? brand.sider.hoverBg : brand.containerBg,
                  borderColor: brand.sider.border,
                  color: brand.sider.text,
                }}
              />
              {searching && filtered.length === 0 && (
                <Typography.Text style={{ display: 'block', padding: '12px 4px', fontSize: 13, color: brand.sider.textMuted }}>
                  {t('shell.noMenuMatch')}
                </Typography.Text>
              )}
            </div>
          )
        }
        actionsRender={() => [
          headerExtra ? <span key="extra">{headerExtra}</span> : null,
          <LanguageSwitch key="language" />,
          <ThemeToggle key="theme" />,
          <ThemeSettingsButton key="appearance" />,
          <NotificationBell key="notifications" />,
        ]}
        avatarProps={{
          src: user.avatarUrl,
          icon: user.avatarUrl ? undefined : <UserOutlined />,
          size: 'small',
          style: { background: user.avatarUrl ? undefined : token.colorPrimary },
          title: user.name,
          render: (_props, dom) => (
            <Dropdown menu={userMenu} trigger={['click']} placement="bottomRight">
              {dom}
            </Dropdown>
          ),
        }}
        footerRender={footer ? () => footer : false}
      >
        <ErrorBoundary key={pathname}>{children}</ErrorBoundary>
      </ProLayout>
    </ShellContext.Provider>
  );
}
