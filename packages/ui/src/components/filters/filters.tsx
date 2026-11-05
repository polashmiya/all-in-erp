import { SearchOutlined } from '@ant-design/icons';
import { Input, Segmented } from 'antd';
import type { ReactNode, Ref } from 'react';
import { formatNumber } from '../../utils/format';

export function FilterBar({
  children,
  extra,
  toolsRef,
}: {
  children: ReactNode;
  extra?: ReactNode;
  toolsRef?: Ref<HTMLDivElement>;
}) {
  return (
    <div className="erp-filterbar">
      <div className="erp-filterbar__main">{children}</div>
      {extra && <div className="erp-filterbar__extra">{extra}</div>}
      {toolsRef && <div ref={toolsRef} className="erp-filterbar__tools" />}
    </div>
  );
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label: string;
  width?: number;
}

export function SearchInput({
  value,
  onChange,
  placeholder,
  label,
  width = 280,
}: SearchInputProps) {
  return (
    <Input
      allowClear
      className="erp-search"
      style={{ width }}
      prefix={<SearchOutlined />}
      placeholder={placeholder}
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => e.key === 'Escape' && onChange('')}
    />
  );
}

export interface QuickView<K extends string> {
  key: K;
  label: string;
  count?: number;
}

export function QuickViews<K extends string>({
  views,
  value,
  onChange,
  label,
}: {
  views: QuickView<K>[];
  value: K;
  onChange: (key: K) => void;
  label: string;
}) {
  return (
    <Segmented<K>
      aria-label={label}
      value={value}
      onChange={onChange}
      options={views.map((view) => ({
        value: view.key,
        label: (
          <span>
            {view.label}
            {view.count !== undefined && (
              <span className="erp-quickview__count">{formatNumber(view.count)}</span>
            )}
          </span>
        ),
      }))}
    />
  );
}
