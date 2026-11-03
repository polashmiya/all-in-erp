import type { ReactNode } from 'react';

export type CardGridColumns = 'stats' | '2-1' | '1-2' | '1-1' | '3';

export function CardGrid({
  columns = '1-1',
  children,
}: {
  columns?: CardGridColumns;
  children: ReactNode;
}) {
  return <div className={`erp-grid erp-grid--${columns}`}>{children}</div>;
}

export function SplitLayout({ main, aside }: { main: ReactNode; aside?: ReactNode }) {
  return (
    <div className="erp-split">
      <div className="erp-split__main">{main}</div>
      {aside && <aside className="erp-split__side">{aside}</aside>}
    </div>
  );
}
