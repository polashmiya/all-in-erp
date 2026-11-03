import dayjs from 'dayjs';
import type { Item, ItemFormValues } from '../../types/item.types';

export type ItemFormTab = 'general' | 'pricing' | 'stock' | 'attachments';

export const ITEM_TAB_FIELDS: Record<ItemFormTab, string[]> = {
  general: [
    'name',
    'genericName',
    'categoryId',
    'subCategoryId',
    'brandId',
    'uomId',
    'barcode',
    'itemType',
    'dosageForm',
    'tags',
    'countryCode',
    'description',
  ],
  pricing: [
    'purchasePrice',
    'salePrice',
    'mrp',
    'vatPercent',
    'priceEffectiveFrom',
    'priceListId',
    'discountAllowed',
    'maxDiscountPercent',
    'discountValidTill',
  ],
  stock: [
    'reorderLevel',
    'maxStock',
    'openingStock',
    'defaultWarehouseId',
    'shelfLifeMonths',
    'storage',
    'warehouseLevels',
  ],
  attachments: ['attachments'],
};

export const ITEM_LIMITS = { name: 160, description: 500, bin: 20, shelfLifeMonths: 240 } as const;

export const STEP = { reorder: 10, maxStock: 100 } as const;

export const BARCODE_PATTERN = /^\d{8}$|^\d{12,14}$/;

export const ATTACHMENT_ACCEPT = '.pdf,.jpg,.jpeg,.png';

export const DEFAULTS = {
  vatPercent: 7.5,
  countryCode: 'BD',
  priceListId: 'retail',
  warehouseId: 'WH-DHK',
} as const;

export const emptyItemValues = (): ItemFormValues => ({
  name: '',
  categoryId: undefined as unknown as string,
  uomId: undefined as unknown as string,
  itemType: 'stock',
  dosageForm: 'solid',
  tags: [],
  countryCode: DEFAULTS.countryCode,
  trackExpiry: true,
  trackBatch: true,
  prescriptionOnly: false,
  allowNegativeStock: false,
  purchasePrice: undefined as unknown as number,
  salePrice: undefined as unknown as number,
  vatPercent: DEFAULTS.vatPercent,
  priceEffectiveFrom: dayjs(),
  priceListId: DEFAULTS.priceListId,
  discountAllowed: false,
  reorderLevel: 0,
  openingStock: 0,
  defaultWarehouseId: DEFAULTS.warehouseId,
  storage: 'room',
  warehouseLevels: [],
  attachments: [],
  image: [],
  isActive: true,
  availableForSale: true,
  availableForPurchase: true,
});

export function toFormValues(
  item: Item,
  { copy = false, copyName }: { copy?: boolean; copyName?: (name: string) => string } = {},
): ItemFormValues {
  const {
    id: _id,
    code: _code,
    attachments,
    imageName,
    priceEffectiveFrom,
    discountValidTill,
    stockByWarehouse: _s,
    createdAt: _ca,
    createdBy: _cb,
    updatedAt: _ua,
    updatedBy: _ub,
    isDraft: _d,
    ...rest
  } = item;
  return {
    ...rest,
    name: copy && copyName ? copyName(item.name) : item.name,
    barcode: copy ? undefined : item.barcode,
    openingStock: copy ? 0 : item.openingStock,
    priceEffectiveFrom: priceEffectiveFrom ? dayjs(priceEffectiveFrom) : null,
    discountValidTill: discountValidTill ? dayjs(discountValidTill) : null,
    attachments: copy
      ? []
      : attachments.map((file, index) => ({
          uid: `stored-${index}`,
          name: file.name,
          size: file.size,
          status: 'done' as const,
        })),
    image:
      !copy && imageName ? [{ uid: 'stored-image', name: imageName, status: 'done' as const }] : [],
  };
}

export function marginPercent(purchase?: number | null, sale?: number | null): number | null {
  if (!purchase || !sale || purchase <= 0) return null;
  return Math.round(((sale - purchase) / purchase) * 1000) / 10;
}
