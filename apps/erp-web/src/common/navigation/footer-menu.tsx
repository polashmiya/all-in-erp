import { QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuNode } from '@erp/ui';

export const footerMenu: MenuNode[] = [
  {
    key: 'settings',
    label: { en: 'Settings', bn: 'সেটিংস' },
    icon: <SettingOutlined />,
    path: '/settings',
  },
  {
    key: 'help',
    label: { en: 'Help & support', bn: 'সহায়তা' },
    icon: <QuestionCircleOutlined />,
    path: '/help',
  },
];
