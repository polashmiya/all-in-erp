import type { UploadFile } from 'antd';
import type { Dayjs } from 'dayjs';

export type ItemType = 'stock' | 'service' | 'consumable';
export type DosageForm = 'solid' | 'liquid' | 'other';
export type StorageCondition = 'room' | 'cold';
export type StockLevel = 'ok' | 'low' | 'out';

export interface WarehouseLevel {
  warehouseId: string;
  reorderLevel: number;
  bin?: string;
}

export interface WarehouseStock {
  warehouseId: string;
  bin?: string;
  onHand: number;
}

export interface Item {
  id: string;
  code: string;
  name: string;
  genericName?: string;
  categoryId: string;
  subCategoryId?: string;
  brandId?: string;
  uomId: string;
  barcode?: string;
  itemType: ItemType;
  dosageForm?: DosageForm;
  tags: string[];
  countryCode?: string;
  description?: string;
  trackExpiry: boolean;
  trackBatch: boolean;
  prescriptionOnly: boolean;
  allowNegativeStock: boolean;
  purchasePrice: number;
  salePrice: number;
  mrp?: number;
  vatPercent?: number;
  priceEffectiveFrom?: string;
  priceListId?: string;
  discountAllowed: boolean;
  maxDiscountPercent?: number;
  discountValidTill?: string;
  reorderLevel: number;
  maxStock?: number;
  openingStock?: number;
  defaultWarehouseId?: string;
  shelfLifeMonths?: number;
  storage: StorageCondition;
  warehouseLevels: WarehouseLevel[];
  attachments: { name: string; size?: number }[];
  imageName?: string;
  isActive: boolean;
  isDraft: boolean;
  availableForSale: boolean;
  availableForPurchase: boolean;
  stockByWarehouse: WarehouseStock[];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ItemListRow {
  id: string;
  code: string;
  name: string;
  genericName?: string;
  categoryId: string;
  uomId: string;
  salePrice: number;
  stockOnHand: number;
  stockLevel: StockLevel;
  isActive: boolean;
  updatedAt: string;
}

export type ItemSortField = 'name' | 'code' | 'salePrice' | 'stockOnHand' | 'updatedAt';

export interface ItemListQuery {
  search?: string;
  categoryId?: string | null;
  uomId?: string | null;
  stockLevel?: StockLevel | null;
  status?: 'all' | 'active' | 'inactive';
  sort?: { field: ItemSortField; order: 'asc' | 'desc' };
  page: number;
  pageSize: number;
}

export interface ItemListResult {
  rows: ItemListRow[];
  total: number;
  counts: { all: number; active: number; inactive: number };
}

export interface ItemTransaction {
  id: string;
  reference: string;
  kind: 'receipt' | 'sale' | 'transfer' | 'adjustment';
  quantity: number;
  date: string;
}

export interface ItemAuditEntry {
  id: string;
  title: string;
  detail: string;
  actor: string;
  at: string;
}

export interface ItemDetail extends Item {
  transactions: ItemTransaction[];
  audit: ItemAuditEntry[];
  lastPurchase?: { date: string; reference: string; quantity: number };
  soldLast30Days: { quantity: number; amount: number };
}

export type ItemFormValues = Omit<
  Item,
  | 'id'
  | 'code'
  | 'priceEffectiveFrom'
  | 'discountValidTill'
  | 'attachments'
  | 'imageName'
  | 'stockByWarehouse'
  | 'createdAt'
  | 'createdBy'
  | 'updatedAt'
  | 'updatedBy'
  | 'isDraft'
> & {
  priceEffectiveFrom?: Dayjs | null;
  discountValidTill?: Dayjs | null;
  attachments?: UploadFile[];
  image?: UploadFile[];
};

export interface SaveItemInput {
  id?: string;
  values: ItemFormValues;
  draft: boolean;
}
