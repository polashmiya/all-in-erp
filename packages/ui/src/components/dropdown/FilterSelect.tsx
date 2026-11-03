import { CheckOutlined, DownOutlined } from '@ant-design/icons';
import { Dropdown } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export interface FilterOption {
  value: string;
  label: ReactNode;
}

export interface FilterSelectProps {
  label: string;
  options: FilterOption[];
  value?: string | null;
  onChange: (value: string | null) => void;
  width?: number;
}

export function FilterSelect({ label, options, value, onChange, width }: FilterSelectProps) {
  const { t } = useTranslation();
  const selected = options.find((o) => o.value === value);

  return (
    <Dropdown
      trigger={['click']}
      menu={{
        selectable: true,
        selectedKeys: [value ?? '__all'],
        items: [
          { key: '__all', label: t('filter.all'), extra: !value ? <CheckOutlined /> : undefined },
          { type: 'divider' },
          ...options.map((o) => ({
            key: o.value,
            label: o.label,
            extra: o.value === value ? <CheckOutlined /> : undefined,
          })),
        ],
        onClick: ({ key }) => onChange(key === '__all' ? null : key),
      }}
    >
      <button
        type="button"
        className={`erp-filter${selected ? ' is-set' : ''}`}
        style={{ width }}
        aria-label={label}
      >
        <span className="erp-filter__text">
          {selected ? (
            <>
              <span className="erp-filter__label">{label}:</span>
              {selected.label}
            </>
          ) : (
            <span className="erp-filter__placeholder">{label}</span>
          )}
        </span>
        <DownOutlined className="erp-filter__chev" />
      </button>
    </Dropdown>
  );
}
