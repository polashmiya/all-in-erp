import { Field, FormModal } from '@erp/ui';
import { Input, Radio } from 'antd';
import { useTranslation } from 'react-i18next';

export interface ChangeStatusValues {
  isActive: boolean;
  reason?: string;
}

const REASON_MAX = 200;

export function ChangeStatusModal({
  open,
  count,
  onClose,
  onSubmit,
}: {
  open: boolean;
  count: number;
  onClose: () => void;
  onSubmit: (values: ChangeStatusValues) => Promise<unknown>;
}) {
  const { t } = useTranslation();

  return (
    <FormModal<ChangeStatusValues>
      open={open}
      onClose={onClose}
      size="sm"
      title={t('item.changeStatusTitle', { count })}
      submitText={t('item.update')}
      initialValues={{ isActive: true }}
      onSubmit={onSubmit}
    >
      <Field name="isActive" label={t('item.newStatus')} rules={[{ required: true }]}>
        <Radio.Group
          options={[
            { value: true, label: t('item.active') },
            { value: false, label: t('item.inactive') },
          ]}
        />
      </Field>
      <Field name="reason" label={t('item.reason')} extra={t('item.reasonHint')}>
        <Input.TextArea maxLength={REASON_MAX} showCount autoSize={{ minRows: 2, maxRows: 4 }} />
      </Field>
    </FormModal>
  );
}
