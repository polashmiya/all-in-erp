import { ApiError, getGetAccountQueryKey, useUpdateAccountFeatures } from '@erp/api-client';
import { AppModal } from '@erp/ui';
import { useQueryClient } from '@tanstack/react-query';
import { Alert, App } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
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

  useEffect(() => {
    if (open) setCodes(initial);
  }, [open, initial]);

  const save = async () => {
    try {
      await update.mutateAsync({ id: accountId, data: { featureCodes: codes } });
      await queryClient.invalidateQueries({ queryKey: getGetAccountQueryKey(accountId) });
      void message.success(t('menus.saved'));
      onClose();
    } catch (error) {
      void message.error(
        error instanceof ApiError
          ? (Object.values(error.fieldErrors)[0]?.[0] ?? error.message)
          : t('menus.saveFailed'),
      );
    }
  };

  return (
    <AppModal
      open={open}
      onClose={onClose}
      size="lg"
      title={t('menus.editTitle', { account: accountName })}
      okText={t('menus.save')}
      okLoading={update.isPending}
      onOk={save}
    >
      <div className="erp-stack">
        <Alert type="info" showIcon message={t('menus.adminNote')} />
        <FeatureAccessTree value={codes} onChange={setCodes} />
        {codes.length === 0 && <Alert type="warning" showIcon message={t('menus.noneWarning')} />}
      </div>
    </AppModal>
  );
}
