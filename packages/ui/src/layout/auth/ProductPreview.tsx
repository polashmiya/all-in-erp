import { CheckOutlined, EyeInvisibleOutlined } from '@ant-design/icons';

const bar = (width: string | number, color = '#D7DAE0', height = 6) => (
  <span style={{ display: 'block', width, height, borderRadius: 3, background: color }} />
);

const rows: [string, string, string][] = [
  ['var(--erp-primary-soft)', '45%', '#BBF7D0'],
  ['#DBEAFE', '38%', '#BBF7D0'],
  ['#FEF3C7', '52%', '#FDE68A'],
  ['#EDE9FE', '30%', '#BBF7D0'],
  ['var(--erp-primary-soft)', '42%', '#FECACA'],
];

export function ProductPreview({
  stats,
  publishedTitle,
  publishedMeta,
  roleNote,
}: {
  stats: string[];
  publishedTitle: string;
  publishedMeta: string;
  roleNote: string;
}) {
  return (
    <div className="erp-preview" aria-hidden="true">
      <div className="erp-preview__window">
        <div className="erp-preview__side">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{ width: 18, height: 18, borderRadius: 5, background: 'var(--erp-primary)' }}
            />
            {bar(54, '#C9CED6')}
          </div>
          <span style={{ display: 'block', height: 18, borderRadius: 3, background: '#FFFFFF' }} />
          {bar('70%')}
          {bar('80%')}
          <div
            style={{
              borderLeft: '1px solid #D7DAE0',
              marginLeft: 6,
              paddingLeft: 6,
              display: 'flex',
              flexDirection: 'column',
              gap: 7,
            }}
          >
            <span
              style={{
                position: 'relative',
                display: 'block',
                height: 16,
                borderRadius: 5,
                background: '#FFFFFF',
                boxShadow: '0 0 0 1px #E3E5E9',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  left: -7,
                  top: 3,
                  width: 2,
                  height: 10,
                  background: 'var(--erp-primary)',
                }}
              />
            </span>
            {bar('80%')}
            {bar('60%')}
            {bar('75%')}
          </div>
        </div>
        <div className="erp-preview__main">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {bar(90, '#C9CED6', 8)}
            <span
              style={{
                width: 22,
                height: 22,
                borderRadius: '50%',
                background: 'var(--erp-primary)',
              }}
            />
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}
          >
            {stats.map((stat) => (
              <div key={stat} className="erp-preview__tile">
                {bar('50%', '#E3E6EB')}
                <span style={{ fontSize: 15, fontWeight: 700, color: '#0E1320' }}>{stat}</span>
              </div>
            ))}
          </div>
          <div className="erp-preview__list">
            {rows.map(([tile, width, pill], index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: tile }} />
                {bar(width, '#E3E6EB')}
                <span style={{ flex: 1 }} />
                {bar(28, pill)}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="erp-preview__note is-published">
        <span className="erp-preview__check">
          <CheckOutlined />
        </span>
        <span style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#0E1320' }}>{publishedTitle}</span>
          <span style={{ fontSize: 11, color: '#5F6B7A' }}>{publishedMeta}</span>
        </span>
      </div>
      <div className="erp-preview__note is-role">
        <EyeInvisibleOutlined />
        {roleNote}
      </div>
    </div>
  );
}
