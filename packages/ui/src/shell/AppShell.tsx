import { LogoutOutlined, SearchOutlined, UserOutlined } from '@ant-design/icons';
import { ProLayout, type MenuDataItem } from '@ant-design/pro-components';
import { Dropdown, Input, Tag, Typography, theme, type MenuProps } from 'antd';
import { useMemo, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router';
import { BrandMark } from '../components/BrandMark';
import { LanguageSwitch, NotificationBell, PreferencesMenu, ThemeToggle } from '../components/HeaderActions';
import { ErrorBoundary } from '../components/ResultPages';
import { useLanguageStore } from '../i18n/i18n';
import { localize, type Language } from '../i18n/language';
import { useThemeStore } from '../theme/theme-store';
import { collectGroupKeys, filterMenu, findTrail, type MenuNode } from './menu';
import { ShellContext } from './ShellContext';

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
  const language = useLanguageStore((s) => s.language);
  const collapsed = useThemeStore((s) => s.siderCollapsed);
  const setCollapsed = useThemeStore((s) => s.setSiderCollapsed);
  const [keyword, setKeyword] = useState('');

  const searching = keyword.trim().length > 0;
  const filtered = useMemo(() => filterMenu(menu, keyword, language), [menu, keyword, language]);
  const route = useMemo(() => ({ path: '/', children: toRoutes(filtered, language) }), [filtered, language]);
  const trail = useMemo(() => findTrail(menu, pathname), [menu, pathname]);
  const shell = useMemo(() => ({ menu, trail }), [menu, trail]);

  const layoutToken = useMemo(
    () => ({
      bgLayout: token.colorBgLayout,
      header: {
        colorBgHeader: token.colorBgContainer,
        colorHeaderTitle: token.colorText,
        colorTextRightActionsItem: token.colorTextSecondary,
        colorBgRightActionsItemHover: token.colorFillTertiary,
        heightLayoutHeader: 56,
      },
      sider: {
        colorMenuBackground: token.colorBgContainer,
        colorMenuItemDivider: token.colorSplit,
        colorTextMenu: token.colorTextSecondary,
        colorTextMenuSecondary: token.colorTextTertiary,
        colorTextMenuTitle: token.colorText,
        colorTextMenuActive: token.colorText,
        colorTextMenuItemHover: token.colorText,
        colorTextMenuSelected: token.colorPrimary,
        colorBgMenuItemHover: token.colorFillTertiary,
        colorBgMenuItemSelected: token.colorPrimaryBg,
        colorBgCollapsedButton: token.colorBgContainer,
        colorTextCollapsedButton: token.colorTextSecondary,
        colorTextCollapsedButtonHover: token.colorText,
      },
      pageContainer: {
        colorBgPageContainer: 'transparent',
        paddingBlockPageContainerContent: 16,
        paddingInlinePageContainerContent: 24,
      },
    }),
    [token],
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
          <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {logo}
            {title}
            {appBadge && (
              <Tag color="blue" bordered={false} style={{ marginInlineEnd: 0, fontWeight: 500 }}>
                {appBadge}
              </Tag>
            )}
          </Link>
        )}
        location={{ pathname }}
        route={route}
        menu={{ locale: false }}
        openKeys={searching ? collectGroupKeys(filtered) : undefined}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        menuItemRender={(item, dom) =>
          item.path && !item.path.startsWith(GROUP_PATH_PREFIX) ? <Link to={item.path}>{dom}</Link> : dom
        }
        menuExtraRender={({ collapsed: isCollapsed }) =>
          isCollapsed ? undefined : (
            <div style={{ padding: '4px 4px 0' }}>
              <Input
                allowClear
                variant="filled"
                prefix={<SearchOutlined style={{ color: token.colorTextTertiary }} />}
                placeholder={t('shell.searchMenu')}
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              {searching && filtered.length === 0 && (
                <Typography.Text type="secondary" style={{ display: 'block', padding: '12px 4px', fontSize: 13 }}>
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
          <PreferencesMenu key="preferences" />,
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
