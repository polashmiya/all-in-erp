import type { CSSProperties, ReactNode } from 'react';

export interface SectionCardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  extra?: ReactNode;
  padding?: number | string;
  fill?: boolean;
  className?: string;
  style?: CSSProperties;
  bodyStyle?: CSSProperties;
  children?: ReactNode;
}

export function SectionCard({
  title,
  subtitle,
  extra,
  padding = 16,
  fill = false,
  className,
  style,
  bodyStyle,
  children,
}: SectionCardProps) {
  return (
    <section
      className={['erp-card', fill && 'is-fill', className].filter(Boolean).join(' ')}
      style={style}
    >
      {(title || extra) && (
        <header className="erp-card__head">
          <div className="erp-card__titles">
            {title && <h2 className="erp-card__title">{title}</h2>}
            {subtitle && <span className="erp-card__sub">{subtitle}</span>}
          </div>
          {extra && <div className="erp-card__extra">{extra}</div>}
        </header>
      )}
      <div className="erp-card__body erp-scroll" style={{ padding, ...bodyStyle }}>
        {children}
      </div>
    </section>
  );
}
