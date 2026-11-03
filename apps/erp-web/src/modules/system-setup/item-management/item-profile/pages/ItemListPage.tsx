import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
  SwapOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  ActionGroup,
  DotValue,
  downloadCsv,
  formatDate,
  formatMoney,
  formatNumber,
  InitialsTile,
  ListPageLayout,
  SoftTag,
  StatusTag,
  TitleCell,
  useDisclosure,
  useListState,
  type ActionItem,
  type CsvColumn,
} from '@erp/ui';
import { App, type TableColumnsType } from 'antd';
import type { Key } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { appConfig } from '@/common/config/app.config';
import { selectCurrentUnit, useAuthStore } from '@/common/store/auth-store';
import { ChangeStatusModal } from '../components/ChangeStatusModal';
import { itemStatus, STOCK_TONE, stockLabel } from '../components/item-display';
import { itemPaths } from '../constants';
import {
  listItems,
  useDeleteItems,
  useItemList,
  useSetItemsActive,
} from '../services/item.service';
import { categories, labelOf, unitShort, units } from '../services/reference.mock';
import type { ItemListQuery, ItemListRow, ItemSortField, StockLevel } from '../types/item.types';

type View = NonNullable<ItemListQuery['status']>;
type Filters = { categoryId: string | null; stockLevel: StockLevel | null; uomId: string | null };

const STOCK_LEVELS: StockLevel[] = ['ok', 'low', 'out'];

export function ItemListPage() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const unit = useAuthStore(selectCurrentUnit);
  const statusModal = useDisclosure<string[]>();
  const list = useListState<Filters, View, ItemSortField>({
    filters: { categoryId: null, stockLevel: null, uomId: null },
    view: 'all',
    sort: { field: 'updatedAt', order: 'desc' },
    pageSize: appConfig.defaultPageSize,
  });

  const query: ItemListQuery = { ...list.query, status: list.query.view, sort: list.query.sort };
  const { data, isFetching, refetch } = useItemList(query);
  const remove = useDeleteItems();
  const setActive = useSetItemsActive();

  const removeItems = async (ids: string[]) => {
    await remove.mutateAsync(ids);
    list.setSelected(list.selected.filter((k) => !ids.includes(String(k))));
    void message.success(t('item.deleted', { count: ids.length }));
  };

  const changeStatus = async (ids: string[], isActive: boolean) => {
    await setActive.mutateAsync({ ids, isActive });
    void message.success(t('item.statusChanged', { count: ids.length }));
  };

  const csvColumns: CsvColumn<ItemListRow>[] = [
    { header: t('item.colCode'), value: (r) => r.code },
    { header: t('item.colItem'), value: (r) => r.name },
    { header: t('item.f.genericName'), value: (r) => r.genericName },
    { header: t('item.colCategory'), value: (r) => labelOf(categories, r.categoryId) },
    { header: t('item.colUnit'), value: (r) => unitShort[r.uomId] },
    { header: t('item.colSalePrice'), value: (r) => formatMoney(r.salePrice, { symbol: false }) },
    { header: t('item.colStock'), value: (r) => r.stockOnHand },
    { header: t('item.colStatus'), value: (r) => itemStatus(t, r).label as string },
    { header: t('item.colUpdated'), value: (r) => formatDate(r.updatedAt) },
  ];

  const exportRows = async (ids?: Key[]) => {
    const all = await listItems({ ...query, page: 1, pageSize: Number.MAX_SAFE_INTEGER });
    downloadCsv(
      t('item.exportFile'),
      ids ? all.rows.filter((r) => ids.includes(r.id)) : all.rows,
      csvColumns,
    );
  };

  const rowActions = (row: ItemListRow): ActionItem[] => [
    {
      key: 'view',
      label: t('item.view'),
      icon: <EyeOutlined />,
      variant: 'text',
      iconOnly: true,
      to: itemPaths.view(row.id),
    },
    {
      key: 'edit',
      label: t('item.edit'),
      icon: <EditOutlined />,
      variant: 'text',
      iconOnly: true,
      to: itemPaths.edit(row.id),
    },
    { key: 'duplicate', label: t('item.duplicate'), to: itemPaths.duplicate(row.id) },
    {
      key: 'toggle',
      label: row.isActive ? t('item.deactivate') : t('item.activate'),
      onClick: () => changeStatus([row.id], !row.isActive),
    },
    { key: 'divider', label: '', divider: true },
    {
      key: 'delete',
      label: t('item.delete'),
      danger: true,
      confirm: {
        title: t('item.deleteConfirm', { count: 1 }),
        description: t('item.deleteHint'),
        okText: t('item.delete'),
        danger: true,
      },
      onClick: () => removeItems([row.id]),
    },
  ];

  const columns: TableColumnsType<ItemListRow> = [
    {
      key: 'name',
      title: t('item.colItem'),
      sorter: true,
      render: (_, row, index) => (
        <TitleCell
          leading={<InitialsTile name={row.name} index={index} />}
          title={<Link to={itemPaths.view(row.id)}>{row.name}</Link>}
          subtitle={row.genericName}
        />
      ),
    },
    {
      key: 'code',
      title: t('item.colCode'),
      dataIndex: 'code',
      sorter: true,
      render: (code: string) => <span className="erp-text-sm">{code}</span>,
    },
    {
      key: 'category',
      title: t('item.colCategory'),
      render: (_, row) => <SoftTag>{labelOf(categories, row.categoryId)}</SoftTag>,
    },
    {
      key: 'unit',
      title: t('item.colUnit'),
      render: (_, row) => unitShort[row.uomId] ?? row.uomId,
    },
    {
      key: 'salePrice',
      title: t('item.colSalePrice'),
      align: 'end',
      sorter: true,
      render: (_, row) => <strong>{formatMoney(row.salePrice)}</strong>,
    },
    {
      key: 'stockOnHand',
      title: t('item.colStock'),
      sorter: true,
      render: (_, row) => (
        <DotValue tone={STOCK_TONE[row.stockLevel]} label={stockLabel(t, row.stockLevel)}>
          {formatNumber(row.stockOnHand)}
        </DotValue>
      ),
    },
    {
      key: 'status',
      title: t('item.colStatus'),
      render: (_, row) => {
        const status = itemStatus(t, row);
        return (
          <StatusTag tone={status.tone} dot>
            {status.label}
          </StatusTag>
        );
      },
    },
    {
      key: 'updatedAt',
      title: t('item.colUpdated'),
      sorter: true,
      render: (_, row) => formatDate(row.updatedAt),
    },
    {
      key: 'actions',
      title: t('item.colActions'),
      fixed: 'right',
      render: (_, row) => <ActionGroup actions={rowActions(row)} size="small" overflowAfter={2} />,
    },
  ];

  return (
    <>
      <ListPageLayout<ItemListRow, Filters, View, ItemSortField>
        title={t('item.title')}
        subtitle={t('item.subtitle', { unit: unit?.name ?? '' })}
        actions={[
          {
            key: 'import',
            label: t('item.import'),
            icon: <UploadOutlined />,
            disabled: true,
            tooltip: t('item.importSoon'),
          },
          {
            key: 'export',
            label: t('item.export'),
            icon: <DownloadOutlined />,
            onClick: () => exportRows(),
          },
          {
            key: 'new',
            label: t('item.new'),
            icon: <PlusOutlined />,
            variant: 'primary',
            to: itemPaths.create,
          },
        ]}
        state={list}
        search={{ label: t('item.searchLabel'), placeholder: t('item.search') }}
        filters={[
          { key: 'categoryId', label: t('item.category'), options: categories },
          {
            key: 'stockLevel',
            label: t('item.stock'),
            options: STOCK_LEVELS.map((value) => ({ value, label: stockLabel(t, value) })),
          },
          {
            key: 'uomId',
            label: t('item.unit'),
            options: units.map((u) => ({ value: u.value, label: unitShort[u.value] ?? u.label })),
          },
        ]}
        views={[
          { key: 'all', label: t('item.viewAll'), count: data?.counts.all },
          { key: 'active', label: t('item.viewActive'), count: data?.counts.active },
          { key: 'inactive', label: t('item.viewInactive'), count: data?.counts.inactive },
        ]}
        columns={columns}
        rows={data?.rows}
        rowKey="id"
        total={data?.total}
        loading={isFetching && !data}
        onRefresh={() => void refetch()}
        selectable
        bulkActions={(keys) => [
          {
            key: 'status',
            label: t('item.changeStatus'),
            icon: <SwapOutlined />,
            onClick: () => statusModal.onOpen(keys.map(String)),
          },
          {
            key: 'export',
            label: t('item.export'),
            icon: <DownloadOutlined />,
            onClick: () => exportRows(keys),
          },
          {
            key: 'delete',
            label: t('item.delete'),
            icon: <DeleteOutlined />,
            variant: 'danger',
            loading: remove.isPending,
            confirm: {
              title: t('item.deleteConfirm', { count: keys.length }),
              description: t('item.deleteHint'),
              okText: t('item.delete'),
              danger: true,
            },
            onClick: () => removeItems(keys.map(String)),
          },
        ]}
        empty={{
          title: t('item.emptyListTitle'),
          description: t('item.emptyListText'),
          actions: [
            {
              key: 'new',
              label: t('item.new'),
              icon: <PlusOutlined />,
              variant: 'primary',
              to: itemPaths.create,
            },
          ],
        }}
      />
      <ChangeStatusModal
        open={statusModal.open}
        count={statusModal.data?.length ?? 0}
        onClose={statusModal.onClose}
        onSubmit={({ isActive }) => changeStatus(statusModal.data ?? [], isActive)}
      />
    </>
  );
}
