import {
  ApartmentOutlined,
  AppstoreOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  BookOutlined,
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
  TagOutlined,
  TeamOutlined,
  ToolOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import type { ComponentType, ReactNode } from 'react';

const registry: Record<string, ComponentType> = {
  apartment: ApartmentOutlined,
  appstore: AppstoreOutlined,
  audit: AuditOutlined,
  bank: BankOutlined,
  'bar-chart': BarChartOutlined,
  book: BookOutlined,
  box: InboxOutlined,
  cart: ShoppingCartOutlined,
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
  shield: SafetyCertificateOutlined,
  shop: ShopOutlined,
  'shopping-cart': ShoppingCartOutlined,
  sliders: ControlOutlined,
  tag: TagOutlined,
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
