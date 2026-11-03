import type { PageStatus, Tone } from '@erp/ui';
import type { useTranslation } from 'react-i18next';
import type { StockLevel } from '../types/item.types';

type TFunction = ReturnType<typeof useTranslation>['t'];

export const STOCK_TONE: Record<StockLevel, Tone> = {
  ok: 'success',
  low: 'warning',
  out: 'danger',
};

export const stockLabel = (t: TFunction, level: StockLevel) =>
  ({ ok: t('item.stockOk'), low: t('item.stockLow'), out: t('item.stockOut') })[level];

export function itemStatus(
  t: TFunction,
  item: { isActive: boolean; isDraft?: boolean },
): PageStatus {
  if (item.isDraft) return { tone: 'warning', label: t('item.draft') };
  return item.isActive
    ? { tone: 'success', label: t('item.active') }
    : { tone: 'neutral', label: t('item.inactive') };
}
