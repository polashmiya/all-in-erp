import { MoreOutlined } from '@ant-design/icons';
import { Button, Dropdown } from 'antd';
import { useTranslation } from 'react-i18next';
import { ActionButton } from './ActionButton';
import type { ActionItem, ActionSize } from './types';
import { toMenuItems, useRunAction } from './useRunAction';

export interface ActionGroupProps {
  actions: ActionItem[];
  size?: ActionSize;
  overflowAfter?: number;
  className?: string;
}

export function ActionGroup({ actions, size, overflowAfter, className }: ActionGroupProps) {
  const { t } = useTranslation();
  const run = useRunAction();
  const visible = actions.filter((action) => !action.hidden);
  const inline = overflowAfter === undefined ? visible : visible.slice(0, overflowAfter);
  const overflow = overflowAfter === undefined ? [] : visible.slice(overflowAfter);

  return (
    <div className={className ? `erp-action-group ${className}` : 'erp-action-group'}>
      {inline.map((action) => (
        <ActionButton key={action.key} action={action} size={size} />
      ))}
      {overflow.length > 0 && (
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          menu={{ items: toMenuItems(overflow, run) }}
        >
          <Button
            type="text"
            size={size}
            icon={<MoreOutlined />}
            aria-label={t('common.moreActions')}
            onClick={(event) => event.stopPropagation()}
          />
        </Dropdown>
      )}
    </div>
  );
}
