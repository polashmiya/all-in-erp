import { DeleteOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Popconfirm, Tag, Typography } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { FieldPath } from '../../model/setup-model';

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
  confirmRemove?: string;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const name = Form.useWatch([...path, 'name'], form) as string | undefined;
  const code = Form.useWatch([...path, 'code'], form) as string | undefined;

  const removeButton = (
    <Button
      type="text"
      danger
      icon={<DeleteOutlined />}
      disabled={removeDisabled}
      aria-label={t('setup.remove')}
      onClick={confirmRemove ? undefined : onRemove}
    />
  );

  return (
    <Card
      size="small"
      className="acc-itemcard"
      title={
        <Flex align="center" gap={10} className="acc-node">
          <span className="erp-tile erp-tile--primary is-sm">{icon}</span>
          <Typography.Text strong ellipsis>
            {name?.trim() || fallbackTitle}
          </Typography.Text>
          {code && (
            <Tag bordered={false} className="erp-code erp-flush">
              {code}
            </Tag>
          )}
        </Flex>
      }
      extra={
        confirmRemove && !removeDisabled ? (
          <Popconfirm
            title={confirmRemove}
            okText={t('setup.remove')}
            okButtonProps={{ danger: true }}
            cancelText={t('setup.keep')}
            onConfirm={onRemove}
          >
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
