import { InboxOutlined } from '@ant-design/icons';
import type { ReactNode } from 'react';

export function EmptyState({
  icon = <InboxOutlined />,
  title,
  description,
  actions,
}: {
  icon?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="erp-empty">
      <span className="erp-tile erp-tile--primary is-lg">{icon}</span>
      <span className="erp-empty__title">{title}</span>
      {description && <span className="erp-empty__text">{description}</span>}
      {actions && <div className="erp-empty__actions">{actions}</div>}
    </div>
  );
}
