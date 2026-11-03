import { ColumnHeightOutlined, ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import {
  Button,
  Checkbox,
  Pagination,
  Popover,
  Select,
  Table,
  Tooltip,
  type TableProps,
} from 'antd';
import type { ColumnType } from 'antd/es/table';
import { useMemo, useRef, useState, type Key, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { formatNumber, pageRange } from '../../utils/format';

export interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
}

export interface DataTableProps<T> extends Omit<
  TableProps<T>,
  'pagination' | 'title' | 'footer' | 'rowSelection' | 'size'
> {
  toolbar?: ReactNode;
  selection?: { selectedKeys: Key[]; onChange: (keys: Key[]) => void };
  bulkActions?: (selectedKeys: Key[]) => ReactNode;
  pagination?: DataTablePagination;
  onRefresh?: () => void;
  fill?: boolean;
}

type Density = 'middle' | 'small';

const columnKey = <T,>(column: ColumnType<T>, index: number) =>
  String(column.key ?? column.dataIndex ?? index);

export function DataTable<T extends object>({
  toolbar,
  selection,
  bulkActions,
  pagination,
  onRefresh,
  fill = false,
  columns = [],
  ...tableProps
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [density, setDensity] = useState<Density>('middle');
  const [hidden, setHidden] = useState<string[]>([]);
  const selected = selection?.selectedKeys ?? [];

  const hideable = (columns as ColumnType<T>[])
    .map((c, i) => ({ key: columnKey(c, i), title: c.title, fixed: !!c.fixed }))
    .filter((c) => !c.fixed && typeof c.title === 'string');
  const visibleColumns = useMemo(
    () => (columns as ColumnType<T>[]).filter((c, i) => !hidden.includes(columnKey(c, i))),
    [columns, hidden],
  );

  const range = pagination
    ? pageRange(pagination.page, pagination.pageSize, pagination.total)
    : null;

  return (
    <section className={`erp-card erp-table${fill ? ' is-fill' : ''}`}>
      <div className={`erp-table__bar${selected.length ? ' has-selection' : ''}`}>
        {selected.length > 0 ? (
          <>
            <span className="erp-table__selcount">
              {t('table.selected', { count: selected.length })}
            </span>
            <span className="erp-table__sep" />
            {bulkActions?.(selected)}
            <button
              type="button"
              className="erp-linkbtn is-muted"
              onClick={() => selection?.onChange([])}
            >
              {t('table.clearSelection')}
            </button>
          </>
        ) : (
          <span className="erp-table__hint">{toolbar}</span>
        )}
        <span style={{ flex: 1 }} />
        <Tooltip title={t('table.density')}>
          <Button
            type="text"
            size="small"
            icon={<ColumnHeightOutlined />}
            aria-label={t('table.density')}
            aria-pressed={density === 'small'}
            onClick={() => setDensity((d) => (d === 'middle' ? 'small' : 'middle'))}
          />
        </Tooltip>
        {hideable.length > 0 && (
          <Popover
            trigger="click"
            placement="bottomRight"
            title={t('table.columns')}
            content={
              <Checkbox.Group
                style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
                value={hideable.map((c) => c.key).filter((k) => !hidden.includes(k))}
                onChange={(keys) =>
                  setHidden(hideable.map((c) => c.key).filter((k) => !keys.includes(k)))
                }
                options={hideable.map((c) => ({ value: c.key, label: c.title as string }))}
              />
            }
          >
            <Tooltip title={t('table.columns')}>
              <Button
                type="text"
                size="small"
                icon={<SettingOutlined />}
                aria-label={t('table.columns')}
              />
            </Tooltip>
          </Popover>
        )}
        {onRefresh && (
          <Tooltip title={t('table.refresh')}>
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined />}
              aria-label={t('table.refresh')}
              onClick={onRefresh}
            />
          </Tooltip>
        )}
      </div>

      <div ref={scrollRef} className="erp-table__scroll erp-scroll">
        <Table<T>
          size={density}
          columns={visibleColumns}
          pagination={false}
          sticky={fill ? { getContainer: () => scrollRef.current ?? window } : true}
          scroll={{ x: 'max-content' }}
          rowSelection={
            selection
              ? {
                  selectedRowKeys: selected,
                  onChange: (keys) => selection.onChange(keys),
                  columnWidth: 44,
                  preserveSelectedRowKeys: true,
                }
              : undefined
          }
          {...tableProps}
        />
      </div>

      {pagination && range && (
        <footer className="erp-table__foot">
          <span className="erp-table__range">
            {t('table.showing')}{' '}
            <b>
              {range.from === range.to
                ? formatNumber(range.from)
                : `${formatNumber(range.from)}–${formatNumber(range.to)}`}
            </b>{' '}
            {t('table.of')} <b>{formatNumber(pagination.total)}</b>
          </span>
          <span className="erp-table__pager">
            <span className="erp-table__rows">{t('table.rows')}</span>
            <Select<number>
              size="small"
              aria-label={t('table.rowsPerPage')}
              value={pagination.pageSize}
              onChange={(size) => pagination.onChange(1, size)}
              options={(pagination.pageSizeOptions ?? [10, 25, 50, 100]).map((n) => ({
                value: n,
                label: String(n),
              }))}
              style={{ width: 76 }}
            />
            <Pagination
              className="erp-pagination"
              size="small"
              showSizeChanger={false}
              current={pagination.page}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={pagination.onChange}
            />
          </span>
        </footer>
      )}
    </section>
  );
}
