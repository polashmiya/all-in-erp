import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown, type MenuProps } from 'antd';
import { useTranslation } from 'react-i18next';

export interface ActionMenuProps {
  items: NonNullable<MenuProps['items']>;
  onSelect: (key: string) => void;
  bordered?: boolean;
  label?: string;
}

export function ActionMenu({ items, onSelect, bordered = false, label }: ActionMenuProps) {
  const { t } = useTranslation();

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      menu={{ items, onClick: ({ key, domEvent }) => (domEvent.stopPropagation(), onSelect(key)) }}
    >
      <Button
        type={bordered ? 'default' : 'text'}
        size={bordered ? 'middle' : 'small'}
        icon={<MoreOutlined />}
        aria-label={label ?? t('table.moreActions')}
        onClick={(e) => e.stopPropagation()}
      />
    </Dropdown>
  );
}
