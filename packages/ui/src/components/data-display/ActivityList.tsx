import type { ReactNode } from 'react';
import { initials } from '../../utils/format';
import type { StatTint } from './StatCard';

export interface ActivityItem {
  key: string;
  icon?: ReactNode;
  tint?: StatTint;
  actor?: string;
  text: ReactNode;
  meta?: ReactNode;
}

export function ActivityList({ items, gap = 0 }: { items: ActivityItem[]; gap?: number }) {
  return (
    <ul className="erp-activity" style={{ gap }}>
      {items.map((item) => (
        <li key={item.key} className="erp-activity__item">
          {item.icon ? (
            <span className={`erp-tile erp-tile--${item.tint ?? 'slate'} is-sm`} aria-hidden="true">
              {item.icon}
            </span>
          ) : (
            <span className="erp-activity__avatar" aria-hidden="true">
              {initials(item.actor)}
            </span>
          )}
          <div className="erp-activity__text">
            <span>{item.text}</span>
            {item.meta && <span className="erp-activity__meta">{item.meta}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export interface TimelineItem {
  key: string;
  title: ReactNode;
  detail?: ReactNode;
  meta?: ReactNode;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ul className="erp-timeline">
      {items.map((item) => (
        <li key={item.key}>
          <span className="erp-timeline__dot" aria-hidden="true" />
          <div>
            <span className="erp-timeline__title">{item.title}</span>
            {item.detail && <span className="erp-timeline__detail">{item.detail}</span>}
            {item.meta && <span className="erp-timeline__meta">{item.meta}</span>}
          </div>
        </li>
      ))}
    </ul>
  );
}
