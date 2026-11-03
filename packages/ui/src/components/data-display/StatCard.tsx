import type { ReactNode } from 'react';
import { Sparkline } from '../charts/Sparkline';
import { StatusTag, type StatusTone } from './StatusTag';

export type StatTint = 'primary' | 'blue' | 'amber' | 'violet' | 'green' | 'slate';

export interface StatCardProps {
  icon: ReactNode;
  tint?: StatTint;
  label: ReactNode;
  value: ReactNode;
  caption?: ReactNode;
  delta?: { text: string; tone: StatusTone };
  trend?: number[];
}

export function StatCard({
  icon,
  tint = 'primary',
  label,
  value,
  caption,
  delta,
  trend,
}: StatCardProps) {
  return (
    <section className="erp-card erp-stat">
      <div className="erp-stat__head">
        <span className={`erp-tile erp-tile--${tint}`}>{icon}</span>
        <span className="erp-stat__label">{label}</span>
        {delta && <StatusTag tone={delta.tone}>{delta.text}</StatusTag>}
      </div>
      <div className="erp-stat__body">
        <div className="erp-stat__values">
          <span className="erp-stat__value">{value}</span>
          {caption && <span className="erp-stat__caption">{caption}</span>}
        </div>
        {trend && (
          <Sparkline
            values={trend}
            color={tint === 'primary' ? 'var(--erp-primary)' : `var(--erp-tile-${tint})`}
          />
        )}
      </div>
    </section>
  );
}

export function MiniStat({
  label,
  value,
  caption,
}: {
  label: ReactNode;
  value: ReactNode;
  caption?: ReactNode;
}) {
  return (
    <div className="erp-ministat">
      <span className="erp-ministat__label">{label}</span>
      <span className="erp-ministat__value">{value}</span>
      {caption && <span className="erp-ministat__caption">{caption}</span>}
    </div>
  );
}
