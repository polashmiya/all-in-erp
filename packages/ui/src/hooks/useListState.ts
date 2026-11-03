import { useCallback, useDeferredValue, useMemo, useState, type Key } from 'react';

export type SortOrder = 'asc' | 'desc';

export interface ListSort<F extends string = string> {
  field: F;
  order: SortOrder;
}

export interface ListStateOptions<Filters, View extends string, SortField extends string> {
  filters: Filters;
  view?: View;
  sort?: ListSort<SortField>;
  pageSize?: number;
}

export function useListState<
  Filters extends Record<string, unknown>,
  View extends string = string,
  SortField extends string = string,
>(options: ListStateOptions<Filters, View, SortField>) {
  const [initial] = useState(options);
  const [search, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Filters>(initial.filters);
  const [view, setViewValue] = useState<View | undefined>(initial.view);
  const [sort, setSortValue] = useState<ListSort<SortField> | undefined>(initial.sort);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initial.pageSize ?? 25);
  const [selected, setSelected] = useState<Key[]>([]);
  const deferredSearch = useDeferredValue(search);

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
    () => ({ search: deferredSearch, ...filters, view, sort, page, pageSize }),
    [deferredSearch, filters, view, sort, page, pageSize],
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
  Filters extends Record<string, unknown> = Record<string, unknown>,
  View extends string = string,
  SortField extends string = string,
> = ReturnType<typeof useListState<Filters, View, SortField>>;
