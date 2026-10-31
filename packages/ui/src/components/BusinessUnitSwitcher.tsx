import { ApartmentOutlined, CheckOutlined, DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Space, Typography, theme } from 'antd';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface BusinessUnitOption {
  id: string;
  code: string;
  name: string;
}

export interface BusinessUnitSwitcherProps {
  units: BusinessUnitOption[];
  currentId: string | undefined;
  onChange: (id: string) => void;
}

const SEARCH_THRESHOLD = 8;

/** Header control for switching the active business unit. Hidden choice when only one unit exists. */
export function BusinessUnitSwitcher({ units, currentId, onChange }: BusinessUnitSwitcherProps) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [search, setSearch] = useState('');
  const current = units.find((u) => u.id === currentId);

  const visible = useMemo(() => {
    const needle = search.trim().toLocaleLowerCase();
    if (!needle) return units;
    return units.filter(
      (u) => u.name.toLocaleLowerCase().includes(needle) || u.code.toLocaleLowerCase().includes(needle),
    );
  }, [units, search]);

  const trigger = (
    <Button type="text" aria-label={t('shell.switchBusinessUnit')} disabled={units.length <= 1}>
      <Space size={6}>
        <ApartmentOutlined style={{ color: token.colorPrimary }} />
        <Typography.Text strong ellipsis style={{ maxWidth: 180 }}>
          {current?.name ?? t('shell.businessUnit')}
        </Typography.Text>
        {units.length > 1 && <DownOutlined style={{ fontSize: 10, color: token.colorTextTertiary }} />}
      </Space>
    </Button>
  );

  if (units.length <= 1) return trigger;

  return (
    <Dropdown
      trigger={['click']}
      onOpenChange={(open) => !open && setSearch('')}
      popupRender={(menu) => (
        <div
          style={{
            background: token.colorBgElevated,
            borderRadius: token.borderRadiusLG,
            boxShadow: token.boxShadowSecondary,
            minWidth: 260,
          }}
        >
          <div style={{ padding: '10px 12px 4px' }}>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
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
        style: { boxShadow: 'none' },
        items: visible.map((unit) => ({
          key: unit.id,
          label: (
            <Space direction="vertical" size={0}>
              <Typography.Text>{unit.name}</Typography.Text>
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {unit.code}
              </Typography.Text>
            </Space>
          ),
          extra: unit.id === currentId ? <CheckOutlined style={{ color: token.colorPrimary }} /> : undefined,
        })),
        onClick: ({ key }) => key !== currentId && onChange(key),
      }}
    >
      {trigger}
    </Dropdown>
  );
}
