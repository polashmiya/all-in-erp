import type { ReactNode } from 'react';
import { ActionGroup } from '../actions/ActionGroup';
import { BackButton } from '../actions/BackButton';
import type { ActionItem } from '../actions/types';
import type { Tint } from '../../theme/design-tokens';

export interface RecordMeta {
  key: string;
  icon?: ReactNode;
  label: ReactNode;
}

export interface RecordHeaderProps {
  icon?: ReactNode;
  tint?: Tint;
  title: ReactNode;
  tags?: ReactNode;
  meta?: RecordMeta[];
  actions?: ActionItem[];
  backTo?: string;
}

export function RecordHeader({
  icon,
  tint = 'primary',
  title,
  tags,
  meta = [],
  actions = [],
  backTo,
}: RecordHeaderProps) {
  return (
    <section className="erp-card erp-record-head">
      {backTo && <BackButton to={backTo} />}
      {icon && (
        <span className={`erp-tile erp-tile--${tint} is-xl`} aria-hidden="true">
          {icon}
        </span>
      )}
      <div className="erp-record-head__main">
        <div className="erp-page__titlerow">
          <h1 className="erp-page__title">{title}</h1>
          {tags}
        </div>
        {meta.length > 0 && (
          <div className="erp-record-head__meta">
            {meta.map((item) => (
              <span key={item.key}>
                {item.icon}
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
      {actions.length > 0 && <ActionGroup actions={actions} className="erp-record-head__actions" />}
    </section>
  );
}
