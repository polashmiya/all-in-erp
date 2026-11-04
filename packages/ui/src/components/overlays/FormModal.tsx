import { Form, type FormInstance } from 'antd';
import { useEffect, useState, type ReactNode } from 'react';
import { AppModal, type OverlaySize } from './AppModal';

export interface FormModalProps<T> {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  subtitle?: ReactNode;
  size?: OverlaySize;
  initialValues?: Partial<T>;
  submitText?: string;
  danger?: boolean;
  onSubmit: (values: T) => Promise<unknown> | unknown;
  form?: FormInstance<T>;
  children: ReactNode;
}

export function FormModal<T extends object>({
  open,
  onClose,
  title,
  subtitle,
  size,
  initialValues,
  submitText,
  danger,
  onSubmit,
  form: external,
  children,
}: FormModalProps<T>) {
  const [own] = Form.useForm<T>();
  const form = external ?? own;
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      form.resetFields();
      if (initialValues)
        form.setFieldsValue(initialValues as Parameters<typeof form.setFieldsValue>[0]);
    }
  }, [open, form, initialValues]);

  const submit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      await onSubmit(values);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size={size}
      okText={submitText}
      okLoading={saving}
      danger={danger}
      onOk={() => submit().catch(() => undefined)}
    >
      <Form<T>
        form={form}
        layout="vertical"
        className="erp-form"
        onFinish={() => submit().catch(() => undefined)}
      >
        {children}
      </Form>
    </AppModal>
  );
}
