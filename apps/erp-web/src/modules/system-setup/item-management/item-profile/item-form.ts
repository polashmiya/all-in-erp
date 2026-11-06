import type { ItemDetail, SaveItemRequest } from '@erp/api-client';
import { trimmed } from '../common/master-data';

export type ItemFormValues = SaveItemRequest & {
  departmentId?: number | null;
  categoryId?: number | null;
  subCategoryId?: number | null;
};

export type ItemFormTab = 'general' | 'pricing' | 'tax' | 'status';

export const ITEM_TAB_FIELDS: Record<ItemFormTab, string[]> = {
  general: [
    'code',
    'name',
    'itemTypeId',
    'hsCode',
    'description',
    'imageSource',
    'departmentId',
    'categoryId',
    'subCategoryId',
    'minorCategoryId',
    'isAutoBarcode',
    'barCode',
    'isChildBarcode',
    'masterItemId',
  ],
  pricing: [
    'uomId',
    'altUomId',
    'altUomConversionQty',
    'isNoDecimalQty',
    'lastCostPrice',
    'averageCostPrice',
    'salesPrice',
    'supplierName',
  ],
  tax: [
    'purchaseSupplyTypeId',
    'purchaseVatPercentage',
    'salesSupplyTypeId',
    'salesVatPercentage',
    'sdPercentage',
    'isVatInclusive',
    'isVatRebatable',
  ],
  status: ['isActive', 'isSaleable', 'isPurchase', 'isNegativeSales', 'isMultipleSalesPrice'],
};

export const ITEM_LIMITS = {
  code: 50,
  name: 200,
  hsCode: 50,
  barCode: 50,
  supplier: 100,
  description: 2000,
} as const;

const STANDARD_SUPPLY_TYPE = 1;
const STANDARD_VAT = 15;

export const NEW_ITEM: Partial<ItemFormValues> = {
  isAutoBarcode: true,
  isChildBarcode: false,
  isNoDecimalQty: false,
  purchaseSupplyTypeId: STANDARD_SUPPLY_TYPE,
  purchaseVatPercentage: STANDARD_VAT,
  salesSupplyTypeId: STANDARD_SUPPLY_TYPE,
  salesVatPercentage: STANDARD_VAT,
  isVatInclusive: false,
  isVatRebatable: true,
  isSaleable: true,
  isPurchase: true,
  isNegativeSales: false,
  isMultipleSalesPrice: false,
  isActive: true,
};

export const copyOf = (item: ItemDetail, name: string): Partial<ItemFormValues> => ({
  ...item,
  code: null,
  name,
  barCode: null,
  isActive: true,
});

export function toRequest(values: ItemFormValues): SaveItemRequest {
  const hasAltUom = values.altUomId != null;
  return {
    code: trimmed(values.code),
    name: values.name.trim(),
    description: trimmed(values.description),
    itemTypeId: values.itemTypeId,
    hsCode: values.hsCode.trim(),
    minorCategoryId: values.minorCategoryId,
    isAutoBarcode: !!values.isAutoBarcode,
    barCode: values.isAutoBarcode ? null : trimmed(values.barCode),
    isChildBarcode: !!values.isChildBarcode,
    masterItemId: values.isChildBarcode ? (values.masterItemId ?? null) : null,
    supplierName: trimmed(values.supplierName),
    uomId: values.uomId,
    altUomId: hasAltUom ? values.altUomId : null,
    altUomConversionQty: hasAltUom ? (values.altUomConversionQty ?? null) : null,
    isNoDecimalQty: !!values.isNoDecimalQty,
    averageCostPrice: values.averageCostPrice ?? null,
    lastCostPrice: values.lastCostPrice ?? null,
    salesPrice: values.salesPrice ?? null,
    purchaseSupplyTypeId: values.purchaseSupplyTypeId,
    purchaseVatPercentage: values.purchaseVatPercentage ?? null,
    salesSupplyTypeId: values.salesSupplyTypeId,
    salesVatPercentage: values.salesVatPercentage ?? null,
    sdPercentage: values.sdPercentage ?? null,
    isVatInclusive: !!values.isVatInclusive,
    isVatRebatable: !!values.isVatRebatable,
    isSaleable: !!values.isSaleable,
    isPurchase: !!values.isPurchase,
    isNegativeSales: !!values.isNegativeSales,
    isMultipleSalesPrice: !!values.isMultipleSalesPrice,
    imageSource: values.imageSource ?? null,
    isActive: !!values.isActive,
  };
}
