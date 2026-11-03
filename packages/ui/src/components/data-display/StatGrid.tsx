import type { ReactNode } from 'react';
import { MiniStat, StatCard, type StatCardProps } from './StatCard';

export type StatGridItem = StatCardProps & { key: string };

export interface MiniStatItem {
  key: string;
  label: ReactNode;
  value: ReactNode;
  caption?: ReactNode;
}

export function StatGrid({ items }: { items: StatGridItem[] }) {
  return (
    <div className="erp-grid erp-grid--stats">
      {items.map(({ key, ...item }) => (
        <StatCard key={key} {...item} />
      ))}
    </div>
  );
}

export function MiniStatGrid({ items }: { items: MiniStatItem[] }) {
  return (
    <div className="erp-grid erp-grid--stats">
      {items.map(({ key, ...item }) => (
        <MiniStat key={key} {...item} />
      ))}
    </div>
  );
}
