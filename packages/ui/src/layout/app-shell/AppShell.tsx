import { Drawer, Grid } from 'antd';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router';
import { ErrorBoundary } from '../../components/feedback/ResultPages';
import { useHotkey } from '../../hooks/useHotkey';
import { useThemeStore } from '../../theme/theme-store';
import { findTrail, type MenuNode } from '../../utils/menu';
import { CommandPalette, ShortcutsModal } from './CommandPalette';
import type { ShellUser } from './ProfileMenu';
import { ShellContext } from './ShellContext';
import { Sidebar, type SidebarWorkspace } from './Sidebar';
import { Topbar } from './Topbar';

export interface AppShellProps {
  workspace: SidebarWorkspace;
  menu: MenuNode[];
  footerMenu?: MenuNode[];
  menuLoading?: boolean;
  user: ShellUser;
  businessUnit?: ReactNode;
  notifications?: number;
  version?: string;
  onProfile?: () => void;
  onLogout?: () => void;
  children: ReactNode;
}

export function AppShell({
  workspace,
  menu,
  footerMenu = [],
  menuLoading = false,
  user,
  businessUnit,
  notifications,
  version,
  onProfile,
  onLogout,
  children,
}: AppShellProps) {
  const { pathname } = useLocation();
  const screens = Grid.useBreakpoint();
  const mobile = screens.md === false;
  const rail = useThemeStore((s) => s.siderCollapsed);
  const setRail = useThemeStore((s) => s.setSiderCollapsed);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [crumbs, setCrumbs] = useState<string[]>([]);

  const allMenu = useMemo(() => [...menu, ...footerMenu], [menu, footerMenu]);
  const trail = useMemo(() => findTrail(allMenu, pathname), [allMenu, pathname]);
  const stableSetCrumbs = useCallback((next: string[]) => setCrumbs(next), []);
  const shell = useMemo(
    () => ({ menu: allMenu, trail, setCrumbs: stableSetCrumbs }),
    [allMenu, trail, stableSetCrumbs],
  );

  useHotkey('k', () => setSearchOpen(true), { mod: true });
  useHotkey('[', () => setRail(!rail), { enabled: !mobile });
  useHotkey('?', () => setShortcutsOpen(true));

  const sidebar = (inDrawer: boolean) => (
    <Sidebar
      workspace={workspace}
      menu={menu}
      footerMenu={footerMenu}
      loading={menuLoading}
      version={version}
      rail={!inDrawer && rail}
      collapsible={!inDrawer}
      onToggleRail={() => setRail(!rail)}
      onSearch={() => {
        setDrawerOpen(false);
        setSearchOpen(true);
      }}
      onNavigate={inDrawer ? () => setDrawerOpen(false) : undefined}
    />
  );

  return (
    <ShellContext.Provider value={shell}>
      <div className="erp-app">
        {mobile ? (
          <Drawer
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            placement="left"
            width={280}
            closable={false}
            styles={{
              body: { padding: 0, background: 'var(--sb-bg)', display: 'flex' },
              wrapper: { boxShadow: 'none' },
            }}
          >
            {sidebar(true)}
          </Drawer>
        ) : (
          sidebar(false)
        )}
        <div className="erp-main">
          <div className="erp-panel">
            <Topbar
              crumbs={crumbs}
              user={user}
              businessUnit={businessUnit}
              notifications={notifications}
              themeOpen={themeOpen}
              onThemeOpenChange={setThemeOpen}
              onShortcuts={() => setShortcutsOpen(true)}
              onProfile={onProfile}
              onLogout={onLogout}
              onOpenMenu={mobile ? () => setDrawerOpen(true) : undefined}
            />
            <main className="erp-content erp-scroll">
              <ErrorBoundary key={pathname}>{children}</ErrorBoundary>
            </main>
          </div>
        </div>
      </div>
      <CommandPalette open={searchOpen} menu={allMenu} onClose={() => setSearchOpen(false)} />
      <ShortcutsModal open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </ShellContext.Provider>
  );
}
