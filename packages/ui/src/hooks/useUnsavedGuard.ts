import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlocker } from 'react-router';
import { useConfirm } from '../components/overlays/useConfirm';

export function useUnsavedGuard(
  shouldBlock: boolean | (() => boolean),
  warnOnUnload = typeof shouldBlock === 'boolean' && shouldBlock,
) {
  const { t } = useTranslation();
  const confirm = useConfirm();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (typeof shouldBlock === 'function' ? shouldBlock() : shouldBlock) &&
      currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    void confirm({
      title: t('common.discardTitle'),
      okText: t('common.discard'),
      danger: true,
    }).then((ok) => (ok ? blocker.proceed() : blocker.reset()));
  }, [blocker, confirm, t]);

  useEffect(() => {
    if (!warnOnUnload) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [warnOnUnload]);
}
