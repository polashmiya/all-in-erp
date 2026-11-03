import { ApiError, getGetAccountQueryKey, useUpdateAccountFeatures } from '@erp/api-client';
import { Alert, App, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { FeatureAccessTree } from '../../components/FeatureAccess';

export function MenuAccessModal({
  accountId,
  accountName,
  initial,
  open,
  onClose,
}: {
  accountId: string;
  accountName: string;
  initial: string[];
  open: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const queryClient = useQueryClient();
  const [codes, setCodes] = useState(initial);
  const update = useUpdateAccountFeatures();

  const save = async () => {
    try {
      await update.mutateAsync({ id: accountId, data: { featureCodes: codes } });
      await queryClient.invalidateQueries({ queryKey: getGetAccountQueryKey(accountId) });
      void message.success(t('menus.saved'));
      onClose();
    } catch (error) {
      void message.error(error instanceof ApiError ? (Object.values(error.fieldErrors)[0]?.[0] ?? error.message) : t('menus.saveFailed'));
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={() => void save()}
      okText={t('menus.save')}
      confirmLoading={update.isPending}
      title={t('menus.editTitle', { account: accountName })}
      width={640}
      destroyOnHidden
      afterOpenChange={(visible) => visible && setCodes(initial)}
    >
      <Alert type="info" showIcon message={t('menus.adminNote')} style={{ marginBottom: 16 }} />
      <FeatureAccessTree value={codes} onChange={setCodes} />
      {codes.length === 0 && <Alert type="warning" showIcon message={t('menus.noneWarning')} style={{ marginTop: 12 }} />}
    </Modal>
  );
}
