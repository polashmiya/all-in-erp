import {
  CheckCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  StopOutlined,
  SwapOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  ActionMenu,
  DataTable,
  EmptyState,
  FilterBar,
  FilterSelect,
  formatDate,
  formatMoney,
  PageContainer,
  QuickViews,
  SearchInput,
  SoftTag,
} from '@erp/ui';
import {
  App,
  Button,
  Dropdown,
  Popconfirm,
  Tooltip,
  type TableColumnsType,
  type TableProps,
} from 'antd';
import { useDeferredValue, useState, type Key } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { selectCurrentUnit, useAuthStore } from '@/common/store/auth-store';
import { downloadCsv } from '@/common/utils/download';
import { ItemStatusTag, ItemThumb, StockCell } from '../components/ItemBits';
import { itemPaths } from '../constants';
import {
  listItems,
  useDeleteItems,
  useItemList,
  useSetItemsActive,
} from '../services/item.service';
import { categories, labelOf, unitShort, units } from '../services/reference.mock';
import type { ItemListQuery, ItemListRow, ItemSortField, StockLevel } from '../types/item.types';

type View = 'all' | 'active' | 'inactive';

const DEFAULT_SORT = { field: 'updatedAt' as ItemSortField, order: 'desc' as const };

export function ItemListPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const unit = useAuthStore(selectCurrentUnit);
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [uomId, setUomId] = useState<string | null>(null);
  const [stockLevel, setStockLevel] = useState<StockLevel | null>(null);
  const [view, setView] = useState<View>('all');
  const [sort, setSort] = useState<ItemListQuery['sort']>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [selected, setSelected] = useState<Key[]>([]);
  const deferredSearch = useDeferredValue(search);

  const query: ItemListQuery = {
    search: deferredSearch,
    categoryId,
    uomId,
    stockLevel,
    status: view,
    sort,
    page,
    pageSize,
  };
  const { data, isFetching, refetch } = useItemList(query);
  const remove = useDeleteItems();
  const setActive = useSetItemsActive();
  const filtered = !!(search || categoryId || uomId || stockLevel);

  const resetFilters = () => {
    setSearch('');
    setCategoryId(null);
    setUomId(null);
    setStockLevel(null);
    setPage(1);
  };

  const changeFilter =
    <T,>(set: (value: T) => void) =>
    (value: T) => {
      set(value);
      setPage(1);
    };

  const removeItems = async (ids: string[]) => {
    await remove.mutateAsync(ids);
    setSelected((keys) => keys.filter((k) => !ids.includes(String(k))));
    void message.success(t('item.deleted', { count: ids.length }));
  };

  const changeStatus = async (ids: string[], isActive: boolean) => {
    await setActive.mutateAsync({ ids, isActive });
    void message.success(t('item.statusChanged', { count: ids.length }));
  };

  const exportRows = async (ids?: Key[]) => {
    const all = await listItems({ ...query, page: 1, pageSize: 10_000 });
    const rows = ids ? all.rows.filter((r) => ids.includes(r.id)) : all.rows;
    downloadCsv(t('item.exportFile'), rows, [
      { header: t('item.colCode'), value: (r) => r.code },
      { header: t('item.colItem'), value: (r) => r.name },
      { header: t('item.f.genericName'), value: (r) => r.genericName },
      { header: t('item.colCategory'), value: (r) => labelOf(categories, r.categoryId) },
      { header: t('item.colUnit'), value: (r) => unitShort[r.uomId] },
      { header: t('item.colSalePrice'), value: (r) => r.salePrice.toFixed(2) },
      { header: t('item.colStock'), value: (r) => r.stockOnHand },
      {
        header: t('item.colStatus'),
        value: (r) => (r.isActive ? t('item.active') : t('item.inactive')),
      },
      { header: t('item.colUpdated'), value: (r) => formatDate(r.updatedAt) },
    ]);
  };

  const sortOrder = (field: ItemSortField) =>
    sort?.field === field ? (sort.order === 'asc' ? 'ascend' : 'descend') : null;

  const columns: TableColumnsType<ItemListRow> = [
    {
      key: 'name',
      title: t('item.colItem'),
      sorter: true,
      sortOrder: sortOrder('name'),
      render: (_, row, index) => (
        <span className="erp-cell-title">
          <ItemThumb name={row.name} index={index} />
          <span className="erp-cell-title__text">
            <Link to={itemPaths.view(row.id)}>{row.name}</Link>
            {row.genericName && <span className="erp-cell-sub">{row.genericName}</span>}
          </span>
        </span>
      ),
    },
    {
      key: 'code',
      title: t('item.colCode'),
      dataIndex: 'code',
      sorter: true,
      sortOrder: sortOrder('code'),
      render: (code: string) => <span style={{ fontSize: 12 }}>{code}</span>,
    },
    {
      key: 'category',
      title: t('item.colCategory'),
      render: (_, row) => <SoftTag>{labelOf(categories, row.categoryId)}</SoftTag>,
    },
    {
      key: 'unit',
      title: t('item.colUnit'),
      render: (_, row) => (
        <span style={{ color: 'var(--erp-text-2)' }}>{unitShort[row.uomId] ?? row.uomId}</span>
      ),
    },
    {
      key: 'salePrice',
      title: t('item.colSalePrice'),
      align: 'end',
      sorter: true,
      sortOrder: sortOrder('salePrice'),
      render: (_, row) => (
        <span style={{ fontWeight: 600, color: 'var(--erp-text-strong)', whiteSpace: 'nowrap' }}>
          {formatMoney(row.salePrice)}
        </span>
      ),
    },
    {
      key: 'stockOnHand',
      title: t('item.colStock'),
      sorter: true,
      sortOrder: sortOrder('stockOnHand'),
      render: (_, row) => <StockCell value={row.stockOnHand} level={row.stockLevel} />,
    },
    {
      key: 'status',
      title: t('item.colStatus'),
      render: (_, row) => <ItemStatusTag active={row.isActive} />,
    },
    {
      key: 'updatedAt',
      title: t('item.colUpdated'),
      sorter: true,
      sortOrder: sortOrder('updatedAt'),
      render: (_, row) => (
        <span style={{ color: 'var(--erp-text-muted)', whiteSpace: 'nowrap' }}>
          {formatDate(row.updatedAt)}
        </span>
      ),
    },
    {
      key: 'actions',
      title: t('item.colActions'),
      fixed: 'right',
      width: 112,
      render: (_, row) => (
        <span style={{ display: 'inline-flex', gap: 2 }}>
          <Tooltip title={t('item.view')}>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              aria-label={`${t('item.view')} ${row.name}`}
              onClick={() => navigate(itemPaths.view(row.id))}
            />
          </Tooltip>
          <Tooltip title={t('item.edit')}>
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              aria-label={`${t('item.edit')} ${row.name}`}
              onClick={() => navigate(itemPaths.edit(row.id))}
            />
          </Tooltip>
          <ActionMenu
            items={[
              { key: 'duplicate', label: t('item.duplicate') },
              row.isActive
                ? { key: 'deactivate', label: t('item.deactivate') }
                : { key: 'activate', label: t('item.activate') },
              { type: 'divider' },
              { key: 'delete', label: t('item.delete'), danger: true },
            ]}
            onSelect={(key) => {
              if (key === 'duplicate') navigate(itemPaths.duplicate(row.id));
              if (key === 'activate' || key === 'deactivate')
                void changeStatus([row.id], key === 'activate');
              if (key === 'delete') void removeItems([row.id]);
            }}
          />
        </span>
      ),
    },
  ];

  const onTableChange: TableProps<ItemListRow>['onChange'] = (_pagination, _filters, sorter) => {
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    setSort(
      s?.order && s.columnKey
        ? { field: s.columnKey as ItemSortField, order: s.order === 'ascend' ? 'asc' : 'desc' }
        : DEFAULT_SORT,
    );
    setPage(1);
  };

  const sortLabel = columns.find((c) => c.key === sort?.field)?.title as string | undefined;

  return (
    <PageContainer
      fill
      title={t('item.title')}
      subTitle={t('item.subtitle', { unit: unit?.name ?? '' })}
      extra={
        <>
          <Tooltip title={t('item.importSoon')}>
            <Button icon={<UploadOutlined />} disabled>
              {t('item.import')}
            </Button>
          </Tooltip>
          <Button icon={<DownloadOutlined />} onClick={() => void exportRows()}>
            {t('item.export')}
          </Button>
          <Link to={itemPaths.create}>
            <Button type="primary" icon={<PlusOutlined />}>
              {t('item.new')}
            </Button>
          </Link>
        </>
      }
    >
      <FilterBar
        extra={
          <QuickViews<View>
            label={t('item.quickViews')}
            value={view}
            onChange={(v) => {
              setView(v);
              setPage(1);
            }}
            views={[
              { key: 'all', label: t('item.viewAll'), count: data?.counts.all },
              { key: 'active', label: t('item.viewActive'), count: data?.counts.active },
              { key: 'inactive', label: t('item.viewInactive'), count: data?.counts.inactive },
            ]}
          />
        }
      >
        <SearchInput
          label={t('item.searchLabel')}
          placeholder={t('item.search')}
          value={search}
          onChange={changeFilter(setSearch)}
        />
        <FilterSelect
          label={t('item.category')}
          options={categories}
          value={categoryId}
          onChange={changeFilter(setCategoryId)}
        />
        <FilterSelect
          label={t('item.stock')}
          options={[
            { value: 'ok', label: t('item.stockOk') },
            { value: 'low', label: t('item.stockLow') },
            { value: 'out', label: t('item.stockOut') },
          ]}
          value={stockLevel}
          onChange={changeFilter((v) => setStockLevel(v as StockLevel | null))}
        />
        <FilterSelect
          label={t('item.unit')}
          options={units.map((u) => ({ value: u.value, label: unitShort[u.value] ?? u.label }))}
          value={uomId}
          onChange={changeFilter(setUomId)}
        />
        {filtered && (
          <button type="button" className="erp-linkbtn" onClick={resetFilters}>
            {t('item.reset')}
          </button>
        )}
      </FilterBar>

      <DataTable<ItemListRow>
        fill
        rowKey="id"
        columns={columns}
        dataSource={data?.rows}
        loading={isFetching && !data}
        onChange={onTableChange}
        onRefresh={() => void refetch()}
        selection={{ selectedKeys: selected, onChange: setSelected }}
        toolbar={
          sortLabel && (
            <Trans
              i18nKey="item.sortedBy"
              values={{
                field: sortLabel,
                direction: sort?.order === 'asc' ? t('item.sortAsc') : t('item.sortDesc'),
              }}
              components={{ b: <b /> }}
            />
          )
        }
        bulkActions={(keys) => (
          <>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  { key: 'activate', icon: <CheckCircleOutlined />, label: t('item.activate') },
                  { key: 'deactivate', icon: <StopOutlined />, label: t('item.deactivate') },
                ],
                onClick: ({ key }) => void changeStatus(keys.map(String), key === 'activate'),
              }}
            >
              <Button size="small" icon={<SwapOutlined />} loading={setActive.isPending}>
                {t('item.changeStatus')}
              </Button>
            </Dropdown>
            <Button size="small" icon={<DownloadOutlined />} onClick={() => void exportRows(keys)}>
              {t('item.export')}
            </Button>
            <Popconfirm
              title={t('item.deleteConfirm', { count: keys.length })}
              description={t('item.deleteHint')}
              okText={t('item.delete')}
              cancelText={t('item.cancel')}
              okButtonProps={{ danger: true }}
              onConfirm={() => removeItems(keys.map(String))}
            >
              <Button size="small" danger icon={<DeleteOutlined />} loading={remove.isPending}>
                {t('item.delete')}
              </Button>
            </Popconfirm>
          </>
        )}
        locale={{
          emptyText: (
            <EmptyState
              title={t('item.emptyTitle')}
              description={t('item.emptyText')}
              actions={
                filtered ? <Button onClick={resetFilters}>{t('item.reset')}</Button> : undefined
              }
            />
          ),
        }}
        pagination={{
          page,
          pageSize,
          total: data?.total ?? 0,
          onChange: (nextPage, nextSize) => {
            setPage(nextPage);
            setPageSize(nextSize);
          },
        }}
      />
    </PageContainer>
  );
}
