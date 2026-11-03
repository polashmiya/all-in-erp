import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown, Input, Typography, theme } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface BusinessUnitOption {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface BusinessUnitSwitcherProps {
  units: BusinessUnitOption[];
  currentId: string | undefined;
  onChange: (id: string) => void;
}

const SEARCH_THRESHOLD = 8;

export function BusinessUnitSwitcher({ units, currentId, onChange }: BusinessUnitSwitcherProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [search, setSearch] = useState('');
  const current = units.find((u) => u.id === currentId);
  const switchable = units.length > 1;

  const visible = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    if (!needle) return units;
    return units.filter(
      (u) =>
        u.name.toLocaleLowerCase().includes(needle) || u.code.toLocaleLowerCase().includes(needle),
    );
  }, [units, search]);

  const trigger = (
    <button
      type="button"
      className="erp-pill"
      aria-label={t('shell.switchBusinessUnit')}
      disabled={!switchable}
    >
      <span className="erp-pill__dot" />
      <span className="erp-pill__label">{t('shell.bu')}</span>
      <span className="erp-pill__name">{current?.name ?? t('shell.businessUnit')}</span>
      {switchable && (
        <span className="erp-pill__chev">
          <DownOutlined />
        </span>
      )}
    </button>
  );

  if (!switchable) return trigger;

  return (
    <Dropdown
      trigger={['click']}
      placement="bottomRight"
      onOpenChange={(open) => !open && setSearch('')}
      popupRender={(menu) => (
        <div className="erp-popover" style={{ minWidth: 280, padding: 6 }}>
          <div style={{ padding: '8px 10px 4px' }}>
            <Typography.Text type="secondary" style={{ fontSize: 12, fontWeight: 600 }}>
              {t('shell.switchBusinessUnit')}
            </Typography.Text>
            {units.length > SEARCH_THRESHOLD && (
              <Input
                size="small"
                allowClear
                autoFocus
                placeholder={t('shell.searchBusinessUnit')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ marginTop: 8 }}
              />
            )}
          </div>
          {menu}
        </div>
      )}
      menu={{
        style: { boxShadow: 'none', background: 'transparent' },
        items: visible.map((unit) => ({
          key: unit.id,
          label: (
            <span
              style={{
                display: 'flex',
                flexDirection: 'column',
                lineHeight: 1.35,
                paddingBlock: 2,
              }}
            >
              <Typography.Text strong={unit.id === currentId}>{unit.name}</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {[unit.code, unit.description].filter(Boolean).join(' · ')}
              </Typography.Text>
            </span>
          ),
          extra:
            unit.id === currentId ? (
              <CheckOutlined style={{ color: token.colorPrimary }} />
            ) : undefined,
        })),
        onClick: ({ key }) => key !== currentId && onChange(key),
      }}
    >
      {trigger}
    </Dropdown>
  );
}
