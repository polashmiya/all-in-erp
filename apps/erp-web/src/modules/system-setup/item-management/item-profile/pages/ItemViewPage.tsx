import {
  BarcodeOutlined,
  CalendarOutlined,
  CheckCircleFilled,
  CopyOutlined,
  EditOutlined,
  MedicineBoxOutlined,
  PrinterOutlined,
  TagOutlined,
} from '@ant-design/icons';
import {
  ActionMenu,
  ActivityList,
  BarList,
  DescriptionList,
  DetailSection,
  EmptyState,
  formatDate,
  formatDateTime,
  formatMoney,
  formatNumber,
  formatPercent,
  MiniStat,
  PageContainer,
  ProgressBar,
  SectionCard,
  StatusTag,
  Timeline,
  type StatusTone,
} from '@erp/ui';
import { App, Button, Skeleton, Table, Tabs, Tooltip, type TableColumnsType } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { ItemStatusTag } from '../components/ItemBits';
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

export function ItemViewPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: item, isPending } = useItem(id);

  if (isPending) {
    return (
      <PageContainer title={false}>
        <Skeleton active paragraph={{ rows: 12 }} />
      </PageContainer>
    );
  }

  if (!item) {
    return (
      <PageContainer title={false}>
        <section className="erp-card">
          <EmptyState
            title={t('item.notFound')}
            actions={
              <Link to={itemPaths.list}>
                <Button>{t('item.backToList')}</Button>
              </Link>
            }
          />
        </section>
      </PageContainer>
    );
  }

  return <ItemView item={item} />;
}

function ItemView({ item }: { item: ItemDetail }) {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const remove = useDeleteItems();
  const setActive = useSetItemsActive();

  const onHand = stockOnHand(item);
  const category = labelOf(categories, item.categoryId) ?? '—';
  const maxWarehouse = Math.max(...item.stockByWarehouse.map((w) => w.onHand), 1);
  const warehouseName = (wid?: string) => labelOf(warehouses, wid) ?? wid ?? '—';
  const yes = (on: boolean) =>
    on ? (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <CheckCircleFilled style={{ color: '#16A34A' }} />
        {t('field.yes')}
      </span>
    ) : (
      t('field.no')
    );

  const onMore = (key: string) => {
    if (key === 'activate' || key === 'deactivate') {
      void setActive
        .mutateAsync({ ids: [item.id], isActive: key === 'activate' })
        .then(() => message.success(t('item.statusChanged', { count: 1 })));
    }
    if (key === 'delete') {
      modal.confirm({
        title: t('item.deleteConfirm', { count: 1 }),
        content: t('item.deleteHint'),
        okText: t('item.delete'),
        okButtonProps: { danger: true },
        cancelText: t('item.cancel'),
        onOk: async () => {
          await remove.mutateAsync([item.id]);
          void message.success(t('item.deleted', { count: 1 }));
          navigate(itemPaths.list);
        },
      });
    }
  };

  const stockColumns: TableColumnsType<WarehouseStock> = [
    {
      key: 'warehouse',
      title: t('item.f.warehouse'),
      render: (_, w) => <span style={{ fontWeight: 500 }}>{warehouseName(w.warehouseId)}</span>,
    },
    {
      key: 'bin',
      title: t('item.f.bin'),
      dataIndex: 'bin',
      render: (bin?: string) => <span style={{ color: 'var(--erp-text-2)' }}>{bin ?? '—'}</span>,
    },
    {
      key: 'onHand',
      title: t('item.v.onHand'),
      align: 'end',
      render: (_, w) => <b>{formatNumber(w.onHand)}</b>,
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
      width: 200,
      render: (_, w) => (
        <ProgressBar
          percent={(w.onHand / maxWarehouse) * 100}
          label={warehouseName(w.warehouseId)}
        />
      ),
    },
  ];

  const txColumns: TableColumnsType<ItemTransaction> = [
    {
      key: 'ref',
      title: t('item.v.reference'),
      render: (_, tx) => (
        <span style={{ color: 'var(--erp-primary)', fontWeight: 500 }}>{tx.reference}</span>
      ),
    },
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
        <b>
          {tx.quantity > 0 ? `+${formatNumber(tx.quantity)}` : `−${formatNumber(-tx.quantity)}`}
        </b>
      ),
    },
    {
      key: 'date',
      title: t('item.v.date'),
      render: (_, tx) => <span style={{ color: 'var(--erp-text-2)' }}>{formatDate(tx.date)}</span>,
    },
  ];

  return (
    <PageContainer title={false} crumbs={[item.code]}>
      <section className="erp-card erp-record-head">
        <span className="erp-tile erp-tile--primary is-xl" aria-hidden="true">
          <MedicineBoxOutlined />
        </span>
        <div className="erp-record-head__main">
          <div className="erp-page__titlerow">
            <h1 className="erp-page__title">{item.name}</h1>
            <ItemStatusTag active={item.isActive} draft={item.isDraft} />
            {item.tags.slice(0, 2).map((tag) => (
              <StatusTag key={tag}>{tag}</StatusTag>
            ))}
          </div>
          <div className="erp-record-head__meta">
            <span>
              <BarcodeOutlined />
              {item.code}
            </span>
            <span>
              <TagOutlined />
              {category} · {unitShort[item.uomId] ?? item.uomId}
            </span>
            <span>
              <CalendarOutlined />
              {t('item.v.updatedBy', {
                date: formatDate(item.updatedAt),
                name: item.updatedBy.split(' ')[0],
              })}
            </span>
          </div>
        </div>
        <div className="erp-page__actions">
          <Tooltip title={t('item.print')}>
            <Button
              icon={<PrinterOutlined />}
              aria-label={t('item.print')}
              onClick={() => window.print()}
            />
          </Tooltip>
          <Button icon={<CopyOutlined />} onClick={() => navigate(itemPaths.duplicate(item.id))}>
            {t('item.duplicate')}
          </Button>
          <ActionMenu
            bordered
            items={[
              item.isActive
                ? { key: 'deactivate', label: t('item.deactivate') }
                : { key: 'activate', label: t('item.activate') },
              { type: 'divider' },
              { key: 'delete', label: t('item.delete'), danger: true },
            ]}
            onSelect={onMore}
          />
          <Link to={itemPaths.edit(item.id)}>
            <Button type="primary" icon={<EditOutlined />}>
              {t('item.edit')}
            </Button>
          </Link>
        </div>
      </section>

      <div className="erp-grid erp-grid--4">
        <MiniStat
          label={t('item.v.stockOnHand')}
          value={formatNumber(onHand)}
          caption={t('item.v.warehouses', { count: item.stockByWarehouse.length })}
        />
        <MiniStat
          label={t('item.v.stockValue')}
          value={formatMoney(onHand * item.purchasePrice).replace(/\.00$/, '')}
          caption={t('item.v.atPurchasePrice')}
        />
        <MiniStat
          label={t('item.v.lastPurchase')}
          value={item.lastPurchase ? formatDate(item.lastPurchase.date) : '—'}
          caption={
            item.lastPurchase
              ? `${item.lastPurchase.reference} · ${formatNumber(item.lastPurchase.quantity)}`
              : t('item.v.noPurchase')
          }
        />
        <MiniStat
          label={t('item.v.sold30')}
          value={formatNumber(item.soldLast30Days.quantity)}
          caption={formatMoney(item.soldLast30Days.amount).replace(/\.00$/, '')}
        />
      </div>

      <div className="erp-split">
        <section className="erp-card erp-split__main">
          <Tabs
            className="erp-card-tabs"
            aria-label={t('item.v.details')}
            items={[
              {
                key: 'overview',
                label: t('item.v.overview'),
                children: (
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
                          {
                            key: 'barcode',
                            label: t('item.f.barcode'),
                            value: item.barcode,
                            code: true,
                          },
                          {
                            key: 'type',
                            label: t('item.f.itemType'),
                            value: t(
                              `item.f.type${item.itemType[0]!.toUpperCase()}${item.itemType.slice(1)}`,
                            ),
                          },
                          {
                            key: 'country',
                            label: t('item.f.country'),
                            value: labelOf(countries, item.countryCode),
                          },
                          {
                            key: 'tags',
                            label: t('item.f.tags'),
                            value: item.tags.length ? (
                              <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: 4 }}>
                                {item.tags.map((tag, i) => (
                                  <StatusTag key={tag} tone={i === 0 ? 'neutral' : 'primary'}>
                                    {tag}
                                  </StatusTag>
                                ))}
                              </span>
                            ) : null,
                          },
                        ]}
                      />
                    </DetailSection>
                    {item.description && (
                      <DetailSection title={t('item.v.description')}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: 14,
                            color: 'var(--erp-text)',
                            maxWidth: '72ch',
                          }}
                        >
                          {item.description}
                        </p>
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
                            value:
                              item.vatPercent !== undefined ? formatPercent(item.vatPercent) : null,
                          },
                          {
                            key: 'discount',
                            label: t('item.f.discountAllowed'),
                            value: (
                              <StatusTag tone={item.discountAllowed ? 'success' : 'neutral'} dot>
                                {item.discountAllowed ? t('field.yes') : t('field.no')}
                              </StatusTag>
                            ),
                          },
                          ...(item.discountAllowed
                            ? [
                                {
                                  key: 'maxDiscount',
                                  label: t('item.f.maxDiscount'),
                                  value:
                                    item.maxDiscountPercent !== undefined
                                      ? `${item.maxDiscountPercent} %`
                                      : null,
                                },
                                {
                                  key: 'till',
                                  label: t('item.f.discountTill'),
                                  value: item.discountValidTill
                                    ? formatDate(item.discountValidTill)
                                    : null,
                                },
                              ]
                            : []),
                          {
                            key: 'from',
                            label: t('item.f.priceFrom'),
                            value: item.priceEffectiveFrom
                              ? formatDate(item.priceEffectiveFrom)
                              : null,
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
                            value: yes(item.trackExpiry),
                          },
                          {
                            key: 'storage',
                            label: t('item.f.storage'),
                            value:
                              item.storage === 'cold'
                                ? t('item.f.cold')
                                : t('item.v.roomTemperature'),
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
                children: (
                  <div style={{ padding: '20px 24px' }}>
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
                children: (
                  <div style={{ padding: '20px 24px' }}>
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
                children: (
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
          />
        </section>

        <aside className="erp-split__side">
          <SectionCard title={t('item.v.stockByWarehouse')} padding={20}>
            <BarList
              items={item.stockByWarehouse.map((w) => ({
                key: w.warehouseId,
                label: warehouseName(w.warehouseId),
                value: <b style={{ color: 'var(--erp-text-strong)' }}>{formatNumber(w.onHand)}</b>,
                percent: (w.onHand / maxWarehouse) * 100,
              }))}
            />
          </SectionCard>
          <SectionCard title={t('item.v.recentChanges')} padding={20}>
            <ActivityList
              gap={6}
              items={item.audit.map((entry) => ({
                key: entry.id,
                actor: entry.actor,
                text: `${entry.title}${entry.detail ? ` · ${entry.detail}` : ''}`,
                meta: formatDate(entry.at),
              }))}
            />
          </SectionCard>
        </aside>
      </div>
    </PageContainer>
  );
}
