import type { ReactNode } from 'react';
import { tintOrder, type Tint, type Tone } from '../../theme/design-tokens';
import { initials } from '../../utils/format';

export function InitialsTile({
  name,
  tint,
  index = 0,
  round = false,
}: {
  name: string;
  tint?: Tint;
  index?: number;
  round?: boolean;
}) {
  const resolved = tint ?? tintOrder[index % tintOrder.length]!;
  return (
    <span
      className={`erp-initials erp-tile--${resolved}${round ? ' is-round' : ''}`}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}

export function DotValue({
  tone = 'neutral',
  label,
  children,
}: {
  tone?: Tone;
  label?: string;
  children: ReactNode;
}) {
  return (
    <span className={`erp-dotvalue erp-dotvalue--${tone}`} title={label}>
      {children}
      {label && <span className="sr-only">{label}</span>}
    </span>
  );
}

export function TitleCell({
  title,
  subtitle,
  leading,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  leading?: ReactNode;
}) {
  return (
    <span className="erp-cell-title">
      {leading}
      <span className="erp-cell-title__text">
        <span className="erp-cell-title__main">{title}</span>
        {subtitle && <span className="erp-cell-sub">{subtitle}</span>}
      </span>
    </span>
  );
}
