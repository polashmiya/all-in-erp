import {
  ControlOutlined,
  DashboardOutlined,
  QuestionCircleOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import type { MenuNode } from '@erp/ui';

export const panelMenu: MenuNode[] = [
  { key: 'dashboard', label: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, icon: <DashboardOutlined />, path: '/dashboard' },
  {
    key: 'tenants',
    label: { en: 'Tenants', bn: 'টেন্যান্ট' },
    icon: <TeamOutlined />,
    children: [
      { key: 'tenants.accounts', label: { en: 'Accounts', bn: 'অ্যাকাউন্ট' }, path: '/tenants/accounts' },
      {
        key: 'tenants.business-units',
        label: { en: 'Business Units', bn: 'বিজনেস ইউনিট' },
        path: '/tenants/business-units',
      },
    ],
  },
  {
    key: 'configuration',
    label: { en: 'Configuration', bn: 'কনফিগারেশন' },
    icon: <ControlOutlined />,
    children: [
      {
        key: 'configuration.features',
        label: { en: 'Feature Catalog', bn: 'ফিচার ক্যাটালগ' },
        path: '/configuration/features',
      },
      {
        key: 'configuration.fields',
        label: { en: 'Field Manager', bn: 'ফিল্ড ম্যানেজার' },
        path: '/configuration/fields',
      },
      {
        key: 'configuration.layouts',
        label: { en: 'Layout Builder', bn: 'লেআউট বিল্ডার' },
        path: '/configuration/layouts',
      },
    ],
  },
  {
    key: 'administration',
    label: { en: 'Administration', bn: 'অ্যাডমিনিস্ট্রেশন' },
    icon: <SafetyCertificateOutlined />,
    children: [
      { key: 'administration.users', label: { en: 'Panel Users', bn: 'প্যানেল ইউজার' }, path: '/administration/users' },
      { key: 'administration.audit-log', label: { en: 'Audit Log', bn: 'অডিট লগ' }, path: '/administration/audit-log' },
    ],
  },
  { key: 'settings', label: { en: 'Settings', bn: 'সেটিংস' }, icon: <SettingOutlined />, path: '/settings' },
  { key: 'help', label: { en: 'Help & Support', bn: 'সহায়তা' }, icon: <QuestionCircleOutlined />, path: '/help' },
];

/** Which roadmap phase delivers each Panel section (shown on its placeholder page). */
export const plannedPhase: Record<string, number> = {
  'tenants.accounts': 6,
  'tenants.business-units': 6,
  'configuration.features': 6,
  'configuration.fields': 6,
  'configuration.layouts': 7,
  'administration.users': 1,
  'administration.audit-log': 8,
};
