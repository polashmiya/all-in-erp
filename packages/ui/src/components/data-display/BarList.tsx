import type { ReactNode } from 'react';

export interface BarListItem {
  key: string;
  label: ReactNode;
  value: ReactNode;
  percent: number;
}

export function BarList({ items, gap = 14 }: { items: BarListItem[]; gap?: number }) {
  return (
    <div className="erp-barlist" style={{ gap }}>
      {items.map((item) => (
        <div key={item.key} className="erp-barlist__item">
          <div className="erp-barlist__row">
            <span className="erp-barlist__label">{item.label}</span>
            <span className="erp-barlist__value">{item.value}</span>
          </div>
          <ProgressBar percent={item.percent} />
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({ percent, label }: { percent: number; label?: string }) {
  const value = Math.max(0, Math.min(100, percent));
  return (
    <div
      className="erp-progress"
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div className="erp-progress__fill" style={{ width: `${value}%` }} />
    </div>
  );
}
