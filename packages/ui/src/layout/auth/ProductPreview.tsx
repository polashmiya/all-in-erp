import { CheckOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import type { CSSProperties } from 'react';
import type { Tint, Tone } from '../../theme/design-tokens';

export interface ProductPreviewProps {
  stats: string[];
  publishedTitle: string;
  publishedMeta: string;
  roleNote: string;
}

const ROWS: { tint: Tint; width: number; tone: Tone }[] = [
  { tint: 'primary', width: 45, tone: 'success' },
  { tint: 'blue', width: 38, tone: 'success' },
  { tint: 'amber', width: 52, tone: 'warning' },
  { tint: 'violet', width: 30, tone: 'success' },
  { tint: 'primary', width: 42, tone: 'danger' },
];

const SIDE_LINES = [70, 80];
const TREE_LINES = [80, 60, 75];

const width = (percent: number) => ({ '--w': `${percent}%` }) as CSSProperties;

export function ProductPreview({
  stats,
  publishedTitle,
  publishedMeta,
  roleNote,
}: ProductPreviewProps) {
  return (
    <div className="erp-preview" aria-hidden="true">
      <div className="erp-preview__window">
        <div className="erp-preview__side">
          <div className="erp-preview__brand">
            <span className="erp-preview__logo" />
            <span className="erp-preview__line is-strong" />
          </div>
          <span className="erp-preview__search" />
          {SIDE_LINES.map((w) => (
            <span key={w} className="erp-preview__line" style={width(w)} />
          ))}
          <div className="erp-preview__tree">
            <span className="erp-preview__active" />
            {TREE_LINES.map((w) => (
              <span key={w} className="erp-preview__line" style={width(w)} />
            ))}
          </div>
        </div>
        <div className="erp-preview__main">
          <div className="erp-preview__top">
            <span className="erp-preview__line is-title" />
            <span className="erp-preview__avatar" />
          </div>
          <div className="erp-preview__stats">
            {stats.map((stat) => (
              <div key={stat} className="erp-preview__tile">
                <span className="erp-preview__line is-soft" style={width(50)} />
                <span className="erp-preview__stat">{stat}</span>
              </div>
            ))}
          </div>
          <div className="erp-preview__list">
            {ROWS.map((row, index) => (
              <div key={index} className="erp-preview__row">
                <span className={`erp-preview__icon erp-tile--${row.tint}`} />
                <span className="erp-preview__line is-soft" style={width(row.width)} />
                <span className="erp-spacer" />
                <span className={`erp-preview__pill erp-preview__pill--${row.tone}`} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="erp-preview__note is-published">
        <span className="erp-preview__check">
          <CheckOutlined />
        </span>
        <span className="erp-preview__notetext">
          <span className="erp-preview__notetitle">{publishedTitle}</span>
          <span className="erp-preview__notemeta">{publishedMeta}</span>
        </span>
      </div>
      <div className="erp-preview__note is-role">
        <EyeInvisibleOutlined />
        {roleNote}
      </div>
    </div>
  );
}
