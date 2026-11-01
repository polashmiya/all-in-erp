import { DeleteOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Flex, Form, Popconfirm, Tag, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldPath } from '../setup-model';

/** Card for one entry of a setup list; the title follows the entry's name and code as they are typed. */
export function ItemCard({
  path,
  icon,
  fallbackTitle,
  onRemove,
  removeDisabled,
  confirmRemove,
  children,
}: {
  path: FieldPath;
  icon: ReactNode;
  fallbackTitle: string;
  onRemove: () => void;
  removeDisabled?: boolean;
  /** Ask before removing (used when removing also drops nested entries). */
  confirmRemove?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const form = Form.useFormInstance();
  const name = Form.useWatch([...path, 'name'], form) as string | undefined;
  const code = Form.useWatch([...path, 'code'], form) as string | undefined;

  const removeButton = (
    <Button type="text" danger icon={<DeleteOutlined />} disabled={removeDisabled} aria-label={t('setup.remove')} onClick={confirmRemove ? undefined : onRemove} />
  );

  return (
    <Card
      size="small"
      styles={{ header: { background: token.colorFillQuaternary } }}
      title={
        <Flex align="center" gap={10} style={{ minWidth: 0 }}>
          <Avatar size="small" shape="square" icon={icon} style={{ background: token.colorPrimaryBg, color: token.colorPrimary, flexShrink: 0 }} />
          <Typography.Text strong ellipsis>
            {name?.trim() || fallbackTitle}
          </Typography.Text>
          {code && (
            <Tag bordered={false} style={{ fontFamily: 'ui-monospace, monospace', marginInlineEnd: 0 }}>
              {code}
            </Tag>
          )}
        </Flex>
      }
      extra={
        confirmRemove && !removeDisabled ? (
          <Popconfirm title={confirmRemove} okText={t('setup.remove')} okButtonProps={{ danger: true }} cancelText={t('setup.keep')} onConfirm={onRemove}>
            {removeButton}
          </Popconfirm>
        ) : (
          removeButton
        )
      }
    >
      {children}
    </Card>
  );
}
