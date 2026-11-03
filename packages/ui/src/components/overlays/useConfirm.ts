import { App } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActionConfirm } from '../actions/types';

export function useConfirm() {
  const { modal } = App.useApp();
  const { t } = useTranslation();

  return useCallback(
    (options: ActionConfirm) =>
      new Promise<boolean>((resolve) => {
        modal.confirm({
          title: options.title,
          content: options.description,
          okText: options.okText ?? t('common.confirm'),
          cancelText: options.cancelText ?? t('common.cancel'),
          okButtonProps: { danger: options.danger },
          onOk: () => resolve(true),
          onCancel: () => resolve(false),
        });
      }),
    [modal, t],
  );
}
