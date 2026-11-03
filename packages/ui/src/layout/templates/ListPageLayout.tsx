import type { TableColumnsType } from 'antd';
import type { Key, ReactNode } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import type { ActionItem } from '../../components/actions/types';
import { FilterSelect, type FilterOption } from '../../components/dropdown/FilterSelect';
import { FilterBar, QuickViews, SearchInput } from '../../components/filters/filters';
import { DataTable, type DataTableEmpty } from '../../components/table/DataTable';
import type { ListSort, ListState } from '../../hooks/useListState';
import { PageContainer } from '../page/PageContainer';

export interface ListFilterDef<F> {
  key: Extract<keyof F, string>;
  label: string;
  options: FilterOption[];
}

export interface ListViewDef<V extends string> {
  key: V;
  label: string;
  count?: number;
}

export interface ListPageLayoutProps<
  T extends object,
  F extends Record<string, unknown>,
  V extends string,
  S extends string = string,
> {
  title?: ReactNode;
  subtitle?: ReactNode;
  actions?: ActionItem[];
  summary?: ReactNode;
  state: ListState<F, V, S>;
  search?: { placeholder: string; label: string };
  filters?: ListFilterDef<F>[];
  views?: ListViewDef<V>[];
  columns: TableColumnsType<T>;
  rows?: T[];
  rowKey: Extract<keyof T, string> | ((row: T) => Key);
  total?: number;
  loading?: boolean;
  selectable?: boolean;
  bulkActions?: (keys: Key[]) => ActionItem[];
  toolbar?: ReactNode;
  empty?: DataTableEmpty;
  onRefresh?: () => void;
  onRowClick?: (row: T) => void;
}

function SortHint({ sort, columns }: { sort?: ListSort; columns: TableColumnsType<object> }) {
  const { t } = useTranslation();
  const label = columns.find((c) => c.key === sort?.field)?.title;
  if (!sort || typeof label !== 'string') return null;
  return (
    <Trans
      i18nKey="common.sortedBy"
      values={{
        field: label,
        direction: sort.order === 'asc' ? t('common.ascending') : t('common.descending'),
      }}
      components={{ b: <b /> }}
    />
  );
}

export function ListPageLayout<
  T extends object,
  F extends Record<string, unknown>,
  V extends string,
  S extends string = string,
>({
  title,
  subtitle,
  actions,
  summary,
  state,
  search,
  filters = [],
  views,
  columns,
  rows,
  rowKey,
  total = 0,
  loading,
  selectable = false,
  bulkActions,
  toolbar,
  empty,
  onRefresh,
  onRowClick,
}: ListPageLayoutProps<T, F, V, S>) {
  const { t } = useTranslation();
  const filteredEmpty: DataTableEmpty = {
    title: t('common.noMatchTitle'),
    description: t('common.noMatchText'),
    actions: [{ key: 'reset', label: t('common.reset'), onClick: state.reset }],
  };

  return (
    <PageContainer fill title={title} subTitle={subtitle} actions={actions}>
      {summary}
      {(search || filters.length > 0 || views) && (
        <FilterBar
          extra={
            views &&
            state.view !== undefined && (
              <QuickViews<V>
                label={t('common.quickViews')}
                value={state.view}
                onChange={state.setView}
                views={views}
              />
            )
          }
        >
          {search && (
            <SearchInput
              label={search.label}
              placeholder={search.placeholder}
              value={state.search}
              onChange={state.setSearch}
            />
          )}
          {filters.map((filter) => (
            <FilterSelect
              key={filter.key}
              label={filter.label}
              options={filter.options}
              value={(state.filters[filter.key] as string | null | undefined) ?? null}
              onChange={(value) => state.setFilter(filter.key, value as F[typeof filter.key])}
            />
          ))}
          {state.hasActiveFilters && (
            <button type="button" className="erp-linkbtn" onClick={state.reset}>
              {t('common.reset')}
            </button>
          )}
        </FilterBar>
      )}
      <DataTable<T>
        fill
        rowKey={rowKey}
        columns={columns}
        dataSource={rows}
        loading={loading}
        sort={state.sort}
        onSortChange={(sort) => state.setSort(sort as ListSort<S> | undefined)}
        onRefresh={onRefresh}
        toolbar={
          toolbar ?? <SortHint sort={state.sort} columns={columns as TableColumnsType<object>} />
        }
        selection={
          selectable ? { selectedKeys: state.selected, onChange: state.setSelected } : undefined
        }
        bulkActions={bulkActions}
        empty={state.hasActiveFilters ? filteredEmpty : empty}
        onRow={
          onRowClick
            ? (row) => ({ onClick: () => onRowClick(row), className: 'is-clickable' })
            : undefined
        }
        pagination={{
          page: state.page,
          pageSize: state.pageSize,
          total,
          onChange: state.changePage,
        }}
      />
    </PageContainer>
  );
}
