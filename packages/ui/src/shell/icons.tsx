import {
  ApartmentOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  ClusterOutlined,
  ControlOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HomeOutlined,
  InboxOutlined,
  ProfileOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import type { ComponentType, ReactNode } from 'react';

/**
 * Icons that menus stored in the database may reference by name (PanelMenuItems.Icon, later ERP menus).
 * Unknown names fall back to a neutral icon instead of breaking the menu.
 */
const registry: Record<string, ComponentType> = {
  apartment: ApartmentOutlined,
  appstore: AppstoreOutlined,
  audit: AuditOutlined,
  bank: BankOutlined,
  'bar-chart': BarChartOutlined,
  cluster: ClusterOutlined,
  control: ControlOutlined,
  dashboard: DashboardOutlined,
  database: DatabaseOutlined,
  file: FileTextOutlined,
  global: GlobalOutlined,
  home: HomeOutlined,
  inbox: InboxOutlined,
  profile: ProfileOutlined,
  question: QuestionCircleOutlined,
  safety: SafetyCertificateOutlined,
  setting: SettingOutlined,
  shop: ShopOutlined,
  'shopping-cart': ShoppingCartOutlined,
  team: TeamOutlined,
  tool: ToolOutlined,
  user: UserOutlined,
  wallet: WalletOutlined,
};

export const iconNames = Object.keys(registry);

export function resolveIcon(name: string | null | undefined): ReactNode {
  if (!name) return undefined;
  const Icon = registry[name] ?? AppstoreOutlined;
  return <Icon />;
}
