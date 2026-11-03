import {
  BarcodeOutlined,
  CalendarOutlined,
  CopyOutlined,
  EditOutlined,
  MedicineBoxOutlined,
  PrinterOutlined,
  TagOutlined,
} from '@ant-design/icons';
import {
  ActivityList,
  BarList,
  DescriptionList,
  DetailSection,
  DetailsPageLayout,
  formatDate,
  formatDateTime,
  formatMoney,
  formatMoneyCompact,
  formatNumber,
  formatPercent,
  ProgressBar,
  SectionCard,
  StatusTag,
  Timeline,
  type StatusTone,
} from '@erp/ui';
import { App, Table, type TableColumnsType } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { itemStatus } from '../components/item-display';
import { itemPaths } from '../constants';
import { stockOnHand } from '../services/item.mock';
import { useDeleteItems, useItem, useSetItemsActive } from '../services/item.service';
import {
  brands,
  categories,
  countries,
  labelOf,
  priceLists,
  unitShort,
  units,
  warehouses,
} from '../services/reference.mock';
import type { ItemDetail, ItemTransaction, WarehouseStock } from '../types/item.types';

const TX_TONE: Record<ItemTransaction['kind'], StatusTone> = {
  receipt: 'success',
  sale: 'neutral',
  transfer: 'warning',
  adjustment: 'danger',
};
const TYPE_KEY = {
  stock: 'item.f.typeStock',
  service: 'item.f.typeService',
  consumable: 'item.f.typeConsumable',
} as const;

export function ItemViewPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: item, isPending } = useItem(id);

  if (isPending || !item) {
    return (
      <DetailsPageLayout
        loading={isPending}
        missing={!isPending && !item}
        missingTitle={t('item.notFound')}
        missingActions={[{ key: 'back', label: t('item.backToList'), to: itemPaths.list }]}
      />
    );
  }

  return <ItemView item={item} />;
}

function ItemView({ item }: { item: ItemDetail }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const remove = useDeleteItems();
  const setActive = useSetItemsActive();

  const onHand = stockOnHand(item);
  const status = itemStatus(t, item);
  const category = labelOf(categories, item.categoryId);
  const maxWarehouse = Math.max(...item.stockByWarehouse.map((w) => w.onHand), 1);
  const warehouseName = (wid?: string) => labelOf(warehouses, wid) ?? wid;
  const yesNo = (on: boolean) => (on ? t('common.yes') : t('common.no'));

  const stockColumns: TableColumnsType<WarehouseStock> = [
    {
      key: 'warehouse',
      title: t('item.f.warehouse'),
      render: (_, w) => <strong>{warehouseName(w.warehouseId)}</strong>,
    },
    { key: 'bin', title: t('item.f.bin'), render: (_, w) => w.bin ?? '—' },
    {
      key: 'onHand',
      title: t('item.v.onHand'),
      align: 'end',
      render: (_, w) => <strong>{formatNumber(w.onHand)}</strong>,
    },
    {
      key: 'reorder',
      title: t('item.f.reorderLevel'),
      align: 'end',
      render: (_, w) =>
        formatNumber(
          item.warehouseLevels.find((l) => l.warehouseId === w.warehouseId)?.reorderLevel ??
            item.reorderLevel,
        ),
    },
    {
      key: 'fill',
      title: t('item.v.fill'),
      render: (_, w) => (
        <ProgressBar
          percent={(w.onHand / maxWarehouse) * 100}
          label={warehouseName(w.warehouseId)}
        />
      ),
    },
  ];

  const txColumns: TableColumnsType<ItemTransaction> = [
    { key: 'ref', title: t('item.v.reference'), dataIndex: 'reference' },
    {
      key: 'type',
      title: t('item.v.type'),
      render: (_, tx) => <StatusTag tone={TX_TONE[tx.kind]}>{t(`item.tx.${tx.kind}`)}</StatusTag>,
    },
    {
      key: 'qty',
      title: t('item.v.qty'),
      align: 'end',
      render: (_, tx) => (
        <strong>
          {tx.quantity > 0 ? `+${formatNumber(tx.quantity)}` : `−${formatNumber(-tx.quantity)}`}
        </strong>
      ),
    },
    { key: 'date', title: t('item.v.date'), render: (_, tx) => formatDate(tx.date) },
  ];

  return (
    <DetailsPageLayout
      crumbs={[item.code]}
      header={{
        icon: <MedicineBoxOutlined />,
        title: item.name,
        tags: (
          <>
            <StatusTag tone={status.tone} dot>
              {status.label}
            </StatusTag>
            {item.tags.map((tag) => (
              <StatusTag key={tag}>{tag}</StatusTag>
            ))}
          </>
        ),
        meta: [
          { key: 'code', icon: <BarcodeOutlined />, label: item.code },
          {
            key: 'cat',
            icon: <TagOutlined />,
            label: `${category ?? '—'} · ${unitShort[item.uomId] ?? item.uomId}`,
          },
          {
            key: 'upd',
            icon: <CalendarOutlined />,
            label: t('item.v.updatedBy', {
              date: formatDate(item.updatedAt),
              name: item.updatedBy,
            }),
          },
        ],
        actions: [
          {
            key: 'print',
            label: t('item.print'),
            icon: <PrinterOutlined />,
            iconOnly: true,
            onClick: () => window.print(),
          },
          {
            key: 'duplicate',
            label: t('item.duplicate'),
            icon: <CopyOutlined />,
            to: itemPaths.duplicate(item.id),
          },
          {
            key: 'more',
            label: t('common.moreActions'),
            menu: [
              {
                key: 'toggle',
                label: item.isActive ? t('item.deactivate') : t('item.activate'),
                onClick: async () => {
                  await setActive.mutateAsync({ ids: [item.id], isActive: !item.isActive });
                  void message.success(t('item.statusChanged', { count: 1 }));
                },
              },
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
                onClick: async () => {
                  await remove.mutateAsync([item.id]);
                  void message.success(t('item.deleted', { count: 1 }));
                  navigate(itemPaths.list);
                },
              },
            ],
          },
          {
            key: 'edit',
            label: t('item.edit'),
            icon: <EditOutlined />,
            variant: 'primary',
            to: itemPaths.edit(item.id),
          },
        ],
      }}
      stats={[
        {
          key: 'onhand',
          label: t('item.v.stockOnHand'),
          value: formatNumber(onHand),
          caption: t('item.v.warehouses', { count: item.stockByWarehouse.length }),
        },
        {
          key: 'value',
          label: t('item.v.stockValue'),
          value: formatMoneyCompact(onHand * item.purchasePrice),
          caption: t('item.v.atPurchasePrice'),
        },
        {
          key: 'last',
          label: t('item.v.lastPurchase'),
          value: item.lastPurchase ? formatDate(item.lastPurchase.date) : '—',
          caption: item.lastPurchase
            ? `${item.lastPurchase.reference} · ${formatNumber(item.lastPurchase.quantity)}`
            : t('item.v.noPurchase'),
        },
        {
          key: 'sold',
          label: t('item.v.sold30'),
          value: formatNumber(item.soldLast30Days.quantity),
          caption: formatMoneyCompact(item.soldLast30Days.amount),
        },
      ]}
      tabsLabel={t('item.v.details')}
      tabs={[
        {
          key: 'overview',
          label: t('item.v.overview'),
          content: (
            <>
              <DetailSection title={t('item.v.general')}>
                <DescriptionList
                  items={[
                    { key: 'code', label: t('item.f.code'), value: item.code, code: true },
                    { key: 'name', label: t('item.f.name'), value: item.name },
                    {
                      key: 'generic',
                      label: t('item.f.genericName'),
                      labelExtra: <StatusTag tone="violet">{t('item.v.custom')}</StatusTag>,
                      value: item.genericName,
                    },
                    { key: 'category', label: t('item.f.category'), value: category },
                    {
                      key: 'brand',
                      label: t('item.f.brand'),
                      value: labelOf(brands, item.brandId),
                    },
                    { key: 'uom', label: t('item.f.uom'), value: labelOf(units, item.uomId) },
                    { key: 'barcode', label: t('item.f.barcode'), value: item.barcode, code: true },
                    { key: 'type', label: t('item.f.itemType'), value: t(TYPE_KEY[item.itemType]) },
                    {
                      key: 'country',
                      label: t('item.f.country'),
                      value: labelOf(countries, item.countryCode),
                    },
                  ]}
                />
              </DetailSection>
              {item.description && (
                <DetailSection title={t('item.v.description')}>
                  <p className="erp-prose">{item.description}</p>
                </DetailSection>
              )}
              <DetailSection title={t('item.v.pricing')}>
                <DescriptionList
                  items={[
                    {
                      key: 'sale',
                      label: t('item.f.salePrice'),
                      value: formatMoney(item.salePrice),
                    },
                    {
                      key: 'mrp',
                      label: t('item.f.mrp'),
                      value: item.mrp !== undefined ? formatMoney(item.mrp) : null,
                    },
                    {
                      key: 'vat',
                      label: t('item.f.vat'),
                      value: item.vatPercent !== undefined ? formatPercent(item.vatPercent) : null,
                    },
                    {
                      key: 'discount',
                      label: t('item.f.discountAllowed'),
                      value: (
                        <StatusTag tone={item.discountAllowed ? 'success' : 'neutral'} dot>
                          {yesNo(item.discountAllowed)}
                        </StatusTag>
                      ),
                    },
                    {
                      key: 'max',
                      label: t('item.f.maxDiscount'),
                      value:
                        item.discountAllowed && item.maxDiscountPercent !== undefined
                          ? formatPercent(item.maxDiscountPercent, 0)
                          : null,
                    },
                    {
                      key: 'till',
                      label: t('item.f.discountTill'),
                      value:
                        item.discountAllowed && item.discountValidTill
                          ? formatDate(item.discountValidTill)
                          : null,
                    },
                    {
                      key: 'from',
                      label: t('item.f.priceFrom'),
                      value: item.priceEffectiveFrom ? formatDate(item.priceEffectiveFrom) : null,
                    },
                    {
                      key: 'list',
                      label: t('item.f.priceList'),
                      value: labelOf(priceLists, item.priceListId),
                    },
                  ]}
                />
              </DetailSection>
              <DetailSection title={t('item.v.stockSettings')}>
                <DescriptionList
                  items={[
                    {
                      key: 'reorder',
                      label: t('item.f.reorderLevel'),
                      value: formatNumber(item.reorderLevel),
                    },
                    {
                      key: 'max',
                      label: t('item.f.maxStock'),
                      value: item.maxStock !== undefined ? formatNumber(item.maxStock) : null,
                    },
                    {
                      key: 'wh',
                      label: t('item.f.defaultWarehouse'),
                      value: warehouseName(item.defaultWarehouseId),
                    },
                    {
                      key: 'shelf',
                      label: t('item.f.shelfLife'),
                      value: item.shelfLifeMonths
                        ? `${item.shelfLifeMonths} ${t('item.f.months')}`
                        : null,
                    },
                    {
                      key: 'expiry',
                      label: t('item.f.trackExpiry'),
                      value: yesNo(item.trackExpiry),
                    },
                    {
                      key: 'storage',
                      label: t('item.f.storage'),
                      value:
                        item.storage === 'cold' ? t('item.f.cold') : t('item.v.roomTemperature'),
                    },
                  ]}
                />
              </DetailSection>
            </>
          ),
        },
        {
          key: 'stock',
          label: t('item.v.stockByWarehouse'),
          content: (
            <div className="erp-card-pad">
              <Table<WarehouseStock>
                className="erp-table"
                size="middle"
                rowKey="warehouseId"
                columns={stockColumns}
                dataSource={item.stockByWarehouse}
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            </div>
          ),
        },
        {
          key: 'tx',
          label: t('item.v.transactions'),
          content: (
            <div className="erp-card-pad">
              <Table<ItemTransaction>
                className="erp-table"
                size="middle"
                rowKey="id"
                columns={txColumns}
                dataSource={item.transactions}
                pagination={false}
                scroll={{ x: 'max-content' }}
              />
            </div>
          ),
        },
        {
          key: 'audit',
          label: t('item.v.auditLog'),
          content: (
            <Timeline
              items={item.audit.map((entry) => ({
                key: entry.id,
                title: entry.title,
                detail: entry.detail,
                meta: `${entry.actor} · ${formatDateTime(entry.at)}`,
              }))}
            />
          ),
        },
      ]}
      aside={
        <>
          <SectionCard title={t('item.v.stockByWarehouse')} padding="lg">
            <BarList
              items={item.stockByWarehouse.map((w) => ({
                key: w.warehouseId,
                label: warehouseName(w.warehouseId),
                value: formatNumber(w.onHand),
                percent: (w.onHand / maxWarehouse) * 100,
              }))}
            />
          </SectionCard>
          <SectionCard title={t('item.v.recentChanges')} padding="lg">
            <ActivityList
              items={item.audit.map((entry) => ({
                key: entry.id,
                actor: entry.actor,
                text: `${entry.title} · ${entry.detail}`,
                meta: formatDate(entry.at),
              }))}
            />
          </SectionCard>
        </>
      }
    />
  );
}
