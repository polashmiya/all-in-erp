import dayjs from 'dayjs';
import type { Item, ItemFormValues } from '../../types/item.types';

export type ItemFormTab = 'general' | 'pricing' | 'stock' | 'attachments';

export const ITEM_FORM_TABS: ItemFormTab[] = ['general', 'pricing', 'stock', 'attachments'];

const FIELD_TAB: Record<string, ItemFormTab> = {
  name: 'general',
  genericName: 'general',
  categoryId: 'general',
  subCategoryId: 'general',
  brandId: 'general',
  uomId: 'general',
  barcode: 'general',
  itemType: 'general',
  dosageForm: 'general',
  tags: 'general',
  countryCode: 'general',
  description: 'general',
  purchasePrice: 'pricing',
  salePrice: 'pricing',
  mrp: 'pricing',
  vatPercent: 'pricing',
  priceEffectiveFrom: 'pricing',
  priceListId: 'pricing',
  discountAllowed: 'pricing',
  maxDiscountPercent: 'pricing',
  discountValidTill: 'pricing',
  reorderLevel: 'stock',
  maxStock: 'stock',
  openingStock: 'stock',
  defaultWarehouseId: 'stock',
  shelfLifeMonths: 'stock',
  storage: 'stock',
  warehouseLevels: 'stock',
  attachments: 'attachments',
};

export function tabOfField(name: (string | number)[]): ItemFormTab {
  return FIELD_TAB[String(name[0])] ?? 'general';
}

export const emptyItemValues = (): ItemFormValues => ({
  name: '',
  categoryId: undefined as unknown as string,
  uomId: undefined as unknown as string,
  itemType: 'stock',
  dosageForm: 'solid',
  tags: [],
  countryCode: 'BD',
  trackExpiry: true,
  trackBatch: true,
  prescriptionOnly: false,
  allowNegativeStock: false,
  purchasePrice: undefined as unknown as number,
  salePrice: undefined as unknown as number,
  vatPercent: 7.5,
  priceEffectiveFrom: dayjs(),
  priceListId: 'retail',
  discountAllowed: false,
  reorderLevel: 0,
  openingStock: 0,
  defaultWarehouseId: 'WH-DHK',
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
  { copy = false }: { copy?: boolean } = {},
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
    name: copy ? `${item.name} (copy)` : item.name,
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
