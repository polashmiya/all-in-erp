import {
  AppstoreOutlined,
  BarcodeOutlined,
  CalendarOutlined,
  CopyOutlined,
  EditOutlined,
  TagOutlined,
} from '@ant-design/icons';
import {
  getGetItemQueryKey,
  useDeleteItem,
  useGetItem,
  useSetItemsStatus,
  type ItemDetail,
} from '@erp/api-client';
import {
  DescriptionList,
  DetailSection,
  DetailsPageLayout,
  ForbiddenResult,
  formatDateTime,
  formatMoney,
  formatNumber,
  formatPercent,
  SectionCard,
  StatusTag,
} from '@erp/ui';
import { App } from 'antd';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router';
import { useFeatureAccess } from '@/common/hooks/useFeatureAccess';
import { selectCurrentUnit, useAuthStore } from '@/common/store/auth-store';
import { problemMessage } from '@/common/utils/api-errors';
import '../../common/master-data.css';
import { useRefreshItemManagement, useUnitKey } from '../../common/master-data';
import { ITEM_PROFILE_FEATURE, itemPaths } from '../constants';

export function ItemViewPage() {
  const { t } = useTranslation();
  const id = Number(useParams().id);
  const access = useFeatureAccess(ITEM_PROFILE_FEATURE);
  const query = useGetItem(id, {
    query: { queryKey: useUnitKey(getGetItemQueryKey(id)), enabled: access.view },
  });

  if (!access.view) return <ForbiddenResult />;

  if (!query.data) {
    return (
      <DetailsPageLayout
        loading={query.isPending}
        missing={!query.isPending}
        missingTitle={t('item.notFound')}
        missingActions={[{ key: 'back', label: t('item.backToList'), to: itemPaths.list }]}
      />
    );
  }

  return <ItemView item={query.data} />;
}

function ItemView({ item }: { item: ItemDetail }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const unit = useAuthStore(selectCurrentUnit);
  const access = useFeatureAccess(ITEM_PROFILE_FEATURE);
  const setStatus = useSetItemsStatus();
  const remove = useDeleteItem();
  const refresh = useRefreshItemManagement();
  const yesNo = (on: boolean) => (on ? t('common.yes') : t('common.no'));

  const failed = (error: unknown) => void message.error(problemMessage(error, t('master.failed')));

  const toggleStatus = async () => {
    try {
      await setStatus.mutateAsync({ data: { ids: [item.id], isActive: !item.isActive } });
      await refresh();
      void message.success(
        t(item.isActive ? 'master.deactivated' : 'master.activated', { count: 1 }),
      );
    } catch (error) {
      failed(error);
    }
  };

  const deleteItem = async () => {
    try {
      await remove.mutateAsync({ id: item.id });
      void navigate(itemPaths.list, { replace: true });
      void refresh();
      void message.success(t('master.deleted', { count: 1 }));
    } catch (error) {
      failed(error);
    }
  };

  return (
    <DetailsPageLayout
      crumbs={[item.code]}
      header={{
        backTo: itemPaths.list,
        icon: <AppstoreOutlined />,
        title: item.name,
        tags: (
          <>
            <StatusTag tone={item.isActive ? 'success' : 'neutral'} dot>
              {item.isActive ? t('master.active') : t('master.inactive')}
            </StatusTag>
            <StatusTag tone="violet">{item.itemTypeName}</StatusTag>
            {item.isChildBarcode && (
              <StatusTag tone="warning">{t('item.f.childBarcode')}</StatusTag>
            )}
          </>
        ),
        meta: [
          { key: 'code', icon: <BarcodeOutlined />, label: `${item.code} · ${item.barCode}` },
          {
            key: 'category',
            icon: <TagOutlined />,
            label: `${item.categoryName} › ${item.subCategoryName} › ${item.minorCategoryName}`,
          },
          {
            key: 'updated',
            icon: <CalendarOutlined />,
            label: t('item.v.updatedBy', {
              date: formatDateTime(item.modifiedAt ?? item.createdAt),
              name: (item.modifiedAt ? item.modifiedByName : item.createdByName) ?? '—',
            }),
          },
        ],
        actions: [
          {
            key: 'duplicate',
            label: t('item.duplicate'),
            icon: <CopyOutlined />,
            hidden: !access.create,
            to: itemPaths.duplicate(item.id),
          },
          {
            key: 'more',
            label: t('common.moreActions'),
            hidden: !access.edit && !access.delete,
            menu: [
              {
                key: 'toggle',
                label: item.isActive ? t('master.deactivate') : t('master.activate'),
                hidden: !access.edit,
                onClick: toggleStatus,
              },
              {
                key: 'delete',
                label: t('master.delete'),
                danger: true,
                hidden: !access.delete,
                confirm: {
                  title: t('master.deleteOne', { name: item.name }),
                  description: t('master.deleteHint'),
                  okText: t('master.delete'),
                  danger: true,
                },
                onClick: deleteItem,
              },
            ],
          },
          {
            key: 'edit',
            label: t('master.edit'),
            icon: <EditOutlined />,
            variant: 'primary',
            hidden: !access.edit,
            to: itemPaths.edit(item.id),
          },
        ],
      }}
      stats={[
        { key: 'sales', label: t('item.f.salesPrice'), value: formatMoney(item.salesPrice) },
        { key: 'last', label: t('item.f.lastCost'), value: formatMoney(item.lastCostPrice) },
        {
          key: 'average',
          label: t('item.f.averageCost'),
          value: formatMoney(item.averageCostPrice),
        },
        {
          key: 'vat',
          label: t('item.v.salesVat'),
          value: formatPercent(item.salesVatPercentage),
          caption: item.salesSupplyTypeName,
        },
      ]}
      aside={
        <>
          {item.imageSource && (
            <SectionCard title={t('item.side.image')}>
              <img
                src={item.imageSource}
                alt={item.name}
                className="erp-record-avatar erp-w-full"
              />
            </SectionCard>
          )}
          <SectionCard title={t('item.side.usage')}>
            <dl className="erp-dl-inline">
              <dt>{t('item.f.saleable')}</dt>
              <dd>{yesNo(item.isSaleable)}</dd>
              <dt>{t('item.f.purchasable')}</dt>
              <dd>{yesNo(item.isPurchase)}</dd>
              <dt>{t('item.f.negativeSales')}</dt>
              <dd>{yesNo(item.isNegativeSales)}</dd>
              <dt>{t('item.f.multiplePrices')}</dt>
              <dd>{yesNo(item.isMultipleSalesPrice)}</dd>
            </dl>
          </SectionCard>
          <SectionCard title={t('item.side.recordInfo')}>
            <dl className="erp-dl-inline">
              <dt>{t('item.side.businessUnit')}</dt>
              <dd>{unit?.name ?? '—'}</dd>
              <dt>{t('item.side.createdBy')}</dt>
              <dd>{item.createdByName ?? '—'}</dd>
              <dt>{t('item.side.created')}</dt>
              <dd>{formatDateTime(item.createdAt)}</dd>
              {item.modifiedAt && (
                <>
                  <dt>{t('item.side.modifiedBy')}</dt>
                  <dd>{item.modifiedByName ?? '—'}</dd>
                  <dt>{t('item.side.updated')}</dt>
                  <dd>{formatDateTime(item.modifiedAt)}</dd>
                </>
              )}
            </dl>
          </SectionCard>
        </>
      }
    >
      <DetailSection title={t('item.sec.basic')}>
        <DescriptionList
          items={[
            { key: 'code', label: t('item.f.code'), value: item.code, code: true },
            { key: 'name', label: t('item.f.name'), value: item.name },
            { key: 'type', label: t('item.f.itemType'), value: item.itemTypeName },
            { key: 'hs', label: t('item.f.hsCode'), value: item.hsCode, code: true },
            {
              key: 'barcode',
              label: t('item.f.barcode'),
              labelExtra: item.isAutoBarcode && <StatusTag>{t('item.v.generated')}</StatusTag>,
              value: item.barCode,
              code: true,
            },
            {
              key: 'master',
              label: t('item.f.masterItem'),
              value: item.masterItemId ? (
                <Link to={itemPaths.view(item.masterItemId)}>
                  {item.masterItemName} ({item.masterItemCode})
                </Link>
              ) : null,
            },
            { key: 'supplier', label: t('item.f.supplier'), value: item.supplierName },
          ]}
        />
      </DetailSection>
      {item.description && (
        <DetailSection title={t('item.f.description')}>
          <p className="erp-prose">{item.description}</p>
        </DetailSection>
      )}
      <DetailSection title={t('item.sec.classification')}>
        <DescriptionList
          items={[
            { key: 'department', label: t('item.f.department'), value: item.departmentName },
            { key: 'category', label: t('item.f.category'), value: item.categoryName },
            { key: 'sub', label: t('item.f.subCategory'), value: item.subCategoryName },
            { key: 'minor', label: t('item.f.minorCategory'), value: item.minorCategoryName },
          ]}
        />
      </DetailSection>
      <DetailSection title={t('item.sec.units')}>
        <DescriptionList
          items={[
            { key: 'uom', label: t('item.f.uom'), value: item.uomName },
            {
              key: 'alt',
              label: t('item.f.altUom'),
              value: item.altUomName
                ? t('item.v.conversion', {
                    alt: item.altUomName,
                    qty: formatNumber(item.altUomConversionQty, 2),
                    uom: item.uomName,
                  })
                : null,
            },
            { key: 'decimal', label: t('item.f.noDecimal'), value: yesNo(item.isNoDecimalQty) },
          ]}
        />
      </DetailSection>
      <DetailSection title={t('item.tab.tax')}>
        <DescriptionList
          items={[
            {
              key: 'pType',
              label: t('item.v.purchaseSupplyType'),
              value: item.purchaseSupplyTypeName,
            },
            {
              key: 'pVat',
              label: t('item.v.purchaseVat'),
              value:
                item.purchaseVatPercentage == null
                  ? null
                  : formatPercent(item.purchaseVatPercentage),
            },
            { key: 'sType', label: t('item.v.salesSupplyType'), value: item.salesSupplyTypeName },
            {
              key: 'sVat',
              label: t('item.v.salesVat'),
              value:
                item.salesVatPercentage == null ? null : formatPercent(item.salesVatPercentage),
            },
            {
              key: 'sd',
              label: t('item.f.sd'),
              value: item.sdPercentage == null ? null : formatPercent(item.sdPercentage),
            },
            {
              key: 'inclusive',
              label: t('item.f.vatInclusive'),
              value: yesNo(item.isVatInclusive),
            },
            { key: 'rebate', label: t('item.f.vatRebatable'), value: yesNo(item.isVatRebatable) },
          ]}
        />
      </DetailSection>
    </DetailsPageLayout>
  );
}
