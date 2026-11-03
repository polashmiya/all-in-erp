import type { ReactNode } from 'react';

export function FormSection({
  title,
  description,
  extra,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="acc-section">
      <div className="acc-section__head">
        <h3 className="acc-section__title">{title}</h3>
        {extra}
      </div>
      {description && <p className="acc-section__desc">{description}</p>}
      {children}
    </section>
  );
}
