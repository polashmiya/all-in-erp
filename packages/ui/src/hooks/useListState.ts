import { useCallback, useEffect, useMemo, useState, type Key } from 'react';
import { useSearchParams } from 'react-router';
import { useDebouncedValue } from './useDebouncedValue';

export type SortOrder = 'asc' | 'desc';

export interface ListSort<F extends string = string> {
  field: F;
  order: SortOrder;
}

export type ListFilters = Record<string, string | null>;

export interface ListStateOptions<Filters, View extends string, SortField extends string> {
  filters: Filters;
  view?: View;
  sort?: ListSort<SortField>;
  pageSize?: number;
}

const sortToParam = (sort?: ListSort) =>
  sort ? `${sort.order === 'desc' ? '-' : ''}${sort.field}` : null;

function sortFromParam<F extends string>(value: string | null): ListSort<F> | undefined {
  if (!value) return undefined;
  const desc = value.startsWith('-');
  return { field: (desc ? value.slice(1) : value) as F, order: desc ? 'desc' : 'asc' };
}

export function useListState<
  Filters extends ListFilters,
  View extends string = string,
  SortField extends string = string,
>(options: ListStateOptions<Filters, View, SortField>) {
  const [params, setParams] = useSearchParams();
  const [initial] = useState(() => ({ ...options, pageSize: options.pageSize ?? 25 }));
  const [search, setSearchValue] = useState(() => params.get('q') ?? '');
  const [filters, setFilters] = useState<Filters>(() => {
    const fromUrl = Object.keys(initial.filters).map((key) => [
      key,
      params.get(key) ?? initial.filters[key],
    ]);
    return Object.fromEntries(fromUrl) as Filters;
  });
  const [view, setViewValue] = useState<View | undefined>(
    () => (params.get('view') as View | null) ?? initial.view,
  );
  const [sort, setSortValue] = useState<ListSort<SortField> | undefined>(
    () => sortFromParam<SortField>(params.get('sort')) ?? initial.sort,
  );
  const [page, setPage] = useState(() => Number(params.get('page')) || 1);
  const [pageSize, setPageSize] = useState(() => Number(params.get('size')) || initial.pageSize);
  const [selected, setSelected] = useState<Key[]>([]);
  const debouncedSearch = useDebouncedValue(search.trim());

  useEffect(() => {
    const next = new URLSearchParams();
    const put = (key: string, value: string | number | null | undefined, fallback?: unknown) => {
      if (value != null && value !== '' && value !== fallback) next.set(key, String(value));
    };
    put('q', debouncedSearch);
    for (const [key, value] of Object.entries(filters)) put(key, value, initial.filters[key]);
    put('view', view, initial.view);
    put('sort', sortToParam(sort), sortToParam(initial.sort));
    put('page', page, 1);
    put('size', pageSize, initial.pageSize);
    if (next.toString() !== params.toString()) setParams(next, { replace: true });
  }, [debouncedSearch, filters, view, sort, page, pageSize, initial, params, setParams]);

  const setSearch = useCallback((value: string) => {
    setSearchValue(value);
    setPage(1);
  }, []);

  const setFilter = useCallback(<K extends keyof Filters>(key: K, value: Filters[K]) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }, []);

  const setView = useCallback((value: View) => {
    setViewValue(value);
    setPage(1);
  }, []);

  const setSort = useCallback(
    (value: ListSort<SortField> | undefined) => {
      setSortValue(value ?? initial.sort);
      setPage(1);
    },
    [initial.sort],
  );

  const changePage = useCallback((nextPage: number, nextSize: number) => {
    setPage(nextPage);
    setPageSize(nextSize);
  }, []);

  const reset = useCallback(() => {
    setSearchValue('');
    setFilters(initial.filters);
    setPage(1);
  }, [initial.filters]);

  const hasActiveFilters =
    search.trim() !== '' ||
    Object.entries(filters).some(([key, value]) => value !== initial.filters[key]);

  const query = useMemo(
    () => ({ search: debouncedSearch, ...filters, view, sort, page, pageSize }),
    [debouncedSearch, filters, view, sort, page, pageSize],
  );

  return {
    search,
    setSearch,
    filters,
    setFilter,
    view,
    setView,
    sort,
    setSort,
    page,
    pageSize,
    changePage,
    selected,
    setSelected,
    reset,
    hasActiveFilters,
    query,
  };
}

export type ListState<
  Filters extends ListFilters = ListFilters,
  View extends string = string,
  SortField extends string = string,
> = ReturnType<typeof useListState<Filters, View, SortField>>;
