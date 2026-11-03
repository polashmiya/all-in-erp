import { StatusTag, formatNumber } from '@erp/ui';
import { useTranslation } from 'react-i18next';
import type { StockLevel } from '../types/item.types';

const TINTS = [
  { fg: 'var(--erp-primary)', bg: 'var(--erp-primary-soft)' },
  { fg: '#1D4ED8', bg: '#DBEAFE' },
  { fg: '#6D28D9', bg: '#EDE9FE' },
  { fg: '#B45309', bg: '#FEF3C7' },
];

export function ItemThumb({ name, index = 0 }: { name: string; index?: number }) {
  const tint = TINTS[index % TINTS.length]!;
  return (
    <span className="erp-thumb" style={{ color: tint.fg, background: tint.bg }} aria-hidden="true">
      {name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function StockCell({ value, level }: { value: number; level: StockLevel }) {
  const { t } = useTranslation();
  const label = { ok: t('item.stockOk'), low: t('item.stockLow'), out: t('item.stockOut') }[level];
  return (
    <span className={`erp-stock erp-stock--${level}`} title={label}>
      {formatNumber(value)}
      <span className="sr-only">{label}</span>
    </span>
  );
}

export function ItemStatusTag({ active, draft = false }: { active: boolean; draft?: boolean }) {
  const { t } = useTranslation();
  if (draft)
    return (
      <StatusTag tone="warning" dot>
        {t('item.draft')}
      </StatusTag>
    );
  return (
    <StatusTag tone={active ? 'success' : 'neutral'} dot>
      {active ? t('item.active') : t('item.inactive')}
    </StatusTag>
  );
}
