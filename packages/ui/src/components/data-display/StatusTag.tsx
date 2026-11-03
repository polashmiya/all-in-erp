import type { ReactNode } from 'react';

export type StatusTone =
  'success' | 'warning' | 'danger' | 'neutral' | 'primary' | 'info' | 'violet';

export interface StatusTagProps {
  tone?: StatusTone;
  dot?: boolean;
  icon?: ReactNode;
  children: ReactNode;
}

export function StatusTag({ tone = 'neutral', dot = false, icon, children }: StatusTagProps) {
  return (
    <span className={`erp-tag erp-tag--${tone}`}>
      {dot && <span className="erp-tag__dot" aria-hidden="true" />}
      {icon}
      {children}
    </span>
  );
}

export function SoftTag({ children }: { children: ReactNode }) {
  return <span className="erp-softtag">{children}</span>;
}
