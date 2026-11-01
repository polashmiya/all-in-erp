import { Typography } from 'antd';
import type { ReactNode } from 'react';

/** A titled group of fields inside a setup step. */
export function FormSection({ title, description, extra, children }: { title: ReactNode; description?: ReactNode; extra?: ReactNode; children: ReactNode }) {
  return (
    <section style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <Typography.Title level={5} style={{ margin: 0 }}>
          {title}
        </Typography.Title>
        {extra}
      </div>
      {description && (
        <Typography.Paragraph type="secondary" style={{ margin: '4px 0 16px' }}>
          {description}
        </Typography.Paragraph>
      )}
      {!description && <div style={{ height: 12 }} />}
      {children}
    </section>
  );
}
