import { Drawer, Grid } from 'antd';
import type { ReactNode } from 'react';
import { sizes } from '../../theme/design-tokens';
import { ActionGroup } from '../actions/ActionGroup';
import type { ActionItem } from '../actions/types';
import type { OverlaySize } from './AppModal';

export interface AppDrawerProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  size?: OverlaySize;
  extra?: ActionItem[];
  actions?: ActionItem[];
  loading?: boolean;
  placement?: 'left' | 'right';
  children: ReactNode;
}

export function AppDrawer({
  open,
  onClose,
  title,
  subtitle,
  size = 'md',
  extra,
  actions,
  loading,
  placement = 'right',
  children,
}: AppDrawerProps) {
  const screens = Grid.useBreakpoint();

  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement={placement}
      width={screens.sm === false ? '100%' : sizes.drawer[size]}
      loading={loading}
      destroyOnHidden
      className="erp-drawer"
      title={
        <div className="erp-overlay__title">
          <span>{title}</span>
          {subtitle && <span className="erp-overlay__sub">{subtitle}</span>}
        </div>
      }
      extra={extra?.length ? <ActionGroup actions={extra} size="small" /> : undefined}
      footer={
        actions?.length ? (
          <ActionGroup actions={actions} className="erp-overlay__footer" />
        ) : undefined
      }
    >
      {children}
    </Drawer>
  );
}
