import type {
  Item,
  ItemAuditEntry,
  ItemDetail,
  ItemListQuery,
  ItemListResult,
  ItemListRow,
  ItemTransaction,
  StockLevel,
} from '../types/item.types';
import { brands, categories, labelOf, units } from './reference.mock';

type Seed = [
  code: string,
  name: string,
  generic: string,
  category: string,
  uom: string,
  sale: number,
  stock: number,
  active: boolean,
  updated: string,
];

const SEED: Seed[] = [
  [
    'ITM-00124',
    'Paracetamol 500mg Tablet',
    'Paracetamol',
    'tablet',
    'strip',
    12,
    4520,
    true,
    '2026-11-02',
  ],
  [
    'ITM-00125',
    'Omeprazole 20mg Capsule',
    'Omeprazole',
    'capsule',
    'box',
    70,
    860,
    true,
    '2026-11-01',
  ],
  [
    'ITM-00126',
    'Fexofenadine 120mg Tablet',
    'Fexofenadine HCl',
    'tablet',
    'strip',
    90,
    42,
    true,
    '2026-11-01',
  ],
  [
    'ITM-00127',
    'Esomeprazole 20mg Capsule',
    'Esomeprazole',
    'capsule',
    'box',
    95,
    1210,
    true,
    '2026-10-30',
  ],
  [
    'ITM-00128',
    'Paracetamol Syrup 100ml',
    '120mg/5ml',
    'syrup',
    'bottle',
    35,
    18,
    true,
    '2026-10-29',
  ],
  [
    'ITM-00129',
    'Azithromycin 500mg Tablet',
    'Azithromycin',
    'tablet',
    'strip',
    105,
    640,
    false,
    '2026-10-27',
  ],
  [
    'ITM-00130',
    'Surgical Mask (50 pcs)',
    'Consumable',
    'consumable',
    'box',
    250,
    300,
    true,
    '2026-10-25',
  ],
  [
    'ITM-00131',
    'Hand Sanitizer 250ml',
    'Ethanol 70%',
    'consumable',
    'bottle',
    180,
    0,
    true,
    '2026-10-24',
  ],
  [
    'ITM-00132',
    'Cetirizine 10mg Tablet',
    'Cetirizine',
    'tablet',
    'strip',
    30,
    64,
    true,
    '2026-10-23',
  ],
  [
    'ITM-00133',
    'Metformin 500mg Tablet',
    'Metformin HCl',
    'tablet',
    'strip',
    45,
    2300,
    true,
    '2026-10-22',
  ],
  [
    'ITM-00134',
    'Insulin Pen 3ml',
    'Insulin glargine',
    'injection',
    'pen',
    1150,
    9,
    true,
    '2026-10-21',
  ],
  [
    'ITM-00135',
    'Amoxicillin 250mg Capsule',
    'Amoxicillin',
    'capsule',
    'box',
    60,
    980,
    true,
    '2026-10-20',
  ],
  [
    'ITM-00136',
    'ORS Sachet',
    'Oral rehydration salts',
    'powder',
    'sachet',
    6,
    0,
    true,
    '2026-10-19',
  ],
  [
    'ITM-00137',
    'Vitamin D3 2000 IU',
    'Cholecalciferol',
    'capsule',
    'box',
    120,
    31,
    false,
    '2026-10-18',
  ],
  ['ITM-00138', 'Gauze Roll 10cm', 'Consumable', 'consumable', 'roll', 25, 12, true, '2026-10-17'],
  [
    'ITM-00139',
    'Losartan 50mg Tablet',
    'Losartan potassium',
    'tablet',
    'strip',
    80,
    1420,
    true,
    '2026-10-16',
  ],
];

function spread(total: number) {
  const main = Math.round(total * 0.876);
  const mirpur = Math.round(total * 0.093);
  return [
    { warehouseId: 'WH-DHK', bin: 'A-12-03', onHand: main },
    { warehouseId: 'WH-MRP', bin: 'R-02', onHand: mirpur },
    { warehouseId: 'WH-UTR', bin: 'U-07', onHand: total - main - mirpur },
  ];
}

function seedItem(
  [code, name, generic, categoryId, uomId, salePrice, stock, isActive, updated]: Seed,
  index: number,
): Item {
  const reorderLevel =
    stock === 0
      ? [80, 500][index % 2]!
      : Math.max(40, Math.round((stock < 200 ? stock * 2.5 : stock / 10) / 10) * 10);
  return {
    id: code,
    code,
    name,
    genericName: generic,
    categoryId,
    uomId,
    brandId: brands[index % brands.length]!.value,
    barcode: `8 941100 ${String(50024 + index).padStart(5, '0')} ${index % 10}`,
    itemType: categoryId === 'consumable' ? 'consumable' : 'stock',
    dosageForm: categoryId === 'syrup' ? 'liquid' : categoryId === 'consumable' ? 'other' : 'solid',
    tags: index % 3 === 0 ? ['OTC', 'Fast moving'] : index % 3 === 1 ? ['OTC'] : [],
    countryCode: 'BD',
    description:
      index === 0 ? 'Analgesic and antipyretic. Store below 30°C, away from light.' : undefined,
    trackExpiry: categoryId !== 'consumable',
    trackBatch: categoryId !== 'consumable',
    prescriptionOnly: ['injection'].includes(categoryId),
    allowNegativeStock: false,
    purchasePrice: Math.round(salePrice * 0.79 * 100) / 100,
    salePrice,
    mrp: salePrice,
    vatPercent: 7.5,
    priceEffectiveFrom: '2026-11-01',
    priceListId: 'retail',
    discountAllowed: index % 2 === 0,
    maxDiscountPercent: index % 2 === 0 ? 5 : undefined,
    discountValidTill: index % 2 === 0 ? '2026-12-31' : undefined,
    reorderLevel,
    maxStock: reorderLevel * 40,
    openingStock: 0,
    defaultWarehouseId: 'WH-DHK',
    shelfLifeMonths: categoryId === 'consumable' ? undefined : 24,
    storage: categoryId === 'injection' ? 'cold' : 'room',
    warehouseLevels: [
      { warehouseId: 'WH-DHK', reorderLevel, bin: 'A-12-03' },
      {
        warehouseId: 'WH-MRP',
        reorderLevel: Math.max(10, Math.round(reorderLevel / 4)),
        bin: 'R-02',
      },
    ],
    attachments: index === 0 ? [{ name: 'DGDA-registration.pdf', size: 1_258_291 }] : [],
    isActive,
    isDraft: false,
    availableForSale: true,
    availableForPurchase: index % 4 !== 3,
    stockByWarehouse: spread(stock),
    createdAt: '2026-01-02T09:12:00+06:00',
    createdBy: 'System',
    updatedAt: `${updated}T10:42:00+06:00`,
    updatedBy: 'Rahim Ahmed',
  };
}

let store: Item[] = SEED.map(seedItem);
let sequence = 140;

export const stockOnHand = (item: Pick<Item, 'stockByWarehouse'>) =>
  item.stockByWarehouse.reduce((sum, w) => sum + w.onHand, 0);

export function stockLevel(onHand: number, reorderLevel: number): StockLevel {
  if (onHand <= 0) return 'out';
  return onHand < reorderLevel ? 'low' : 'ok';
}

function toRow(item: Item): ItemListRow {
  const onHand = stockOnHand(item);
  return {
    id: item.id,
    code: item.code,
    name: item.name,
    genericName: item.genericName,
    categoryId: item.categoryId,
    uomId: item.uomId,
    salePrice: item.salePrice,
    stockOnHand: onHand,
    stockLevel: stockLevel(onHand, item.reorderLevel),
    isActive: item.isActive,
    updatedAt: item.updatedAt,
  };
}

function matches(row: ItemListRow, needle: string, item: Item) {
  if (!needle) return true;
  return [row.code, row.name, row.genericName, item.barcode?.replace(/\s/g, '')].some((v) =>
    v?.toLocaleLowerCase().includes(needle),
  );
}

export function queryItems(query: ItemListQuery): ItemListResult {
  const needle = (query.search ?? '').trim().toLocaleLowerCase().replace(/\s/g, '');
  const base = store
    .map((item) => ({ item, row: toRow(item) }))
    .filter(({ row, item }) => matches(row, needle, item))
    .filter(({ row }) => !query.categoryId || row.categoryId === query.categoryId)
    .filter(({ row }) => !query.uomId || row.uomId === query.uomId)
    .filter(({ row }) => !query.stockLevel || row.stockLevel === query.stockLevel)
    .map(({ row }) => row);

  const counts = {
    all: base.length,
    active: base.filter((r) => r.isActive).length,
    inactive: base.filter((r) => !r.isActive).length,
  };
  const filtered = base.filter((r) =>
    query.status === 'active' ? r.isActive : query.status === 'inactive' ? !r.isActive : true,
  );

  const { field, order } = query.sort ?? { field: 'updatedAt', order: 'desc' };
  const sorted = [...filtered].sort((a, b) => {
    const x = a[field];
    const y = b[field];
    const result =
      typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
    return order === 'asc' ? result : -result;
  });

  const start = (query.page - 1) * query.pageSize;
  return { rows: sorted.slice(start, start + query.pageSize), total: filtered.length, counts };
}

export function findItem(id: string): Item | undefined {
  return store.find((item) => item.id === id);
}

export function itemDetail(item: Item): ItemDetail {
  const onHand = stockOnHand(item);
  const category = labelOf(categories, item.categoryId) ?? '';
  const transactions: ItemTransaction[] = [
    { id: 't1', reference: 'GRN-2026-1180', kind: 'receipt', quantity: 2000, date: '2026-10-28' },
    { id: 't2', reference: 'INV-2026-8841', kind: 'sale', quantity: -120, date: '2026-11-01' },
    { id: 't3', reference: 'TR-0088', kind: 'transfer', quantity: -300, date: '2026-10-31' },
    { id: 't4', reference: 'ADJ-0041', kind: 'adjustment', quantity: -6, date: '2026-10-30' },
  ];
  const audit: ItemAuditEntry[] = [
    {
      id: 'u1',
      title: 'Sale price changed',
      detail: `৳ ${(item.salePrice * 0.96).toFixed(2)} → ৳ ${item.salePrice.toFixed(2)}`,
      actor: item.updatedBy,
      at: item.updatedAt,
    },
    {
      id: 'u2',
      title: 'Tag added',
      detail: item.tags[item.tags.length - 1] ?? category,
      actor: 'Nusrat Jahan',
      at: '2026-10-20T16:05:00+06:00',
    },
    {
      id: 'u3',
      title: 'Item created',
      detail: 'via Excel import',
      actor: item.createdBy,
      at: item.createdAt,
    },
  ];
  return {
    ...structuredClone(item),
    transactions,
    audit,
    lastPurchase:
      onHand > 0 ? { date: '2026-10-28', reference: 'GRN-2026-1180', quantity: 2000 } : undefined,
    soldLast30Days: {
      quantity: Math.round(onHand * 0.7),
      amount: Math.round(onHand * 0.7 * item.salePrice),
    },
  };
}

export function upsertItem(item: Omit<Item, 'id' | 'code'> & { id?: string }): Item {
  if (item.id) {
    const existing = findItem(item.id);
    if (!existing) throw new Error(`Item ${item.id} not found`);
    const updated: Item = { ...existing, ...item, id: existing.id, code: existing.code };
    store = store.map((i) => (i.id === existing.id ? updated : i));
    return updated;
  }
  const code = `ITM-${String(++sequence).padStart(5, '0')}`;
  const created: Item = { ...item, id: code, code };
  store = [created, ...store];
  return created;
}

export function removeItems(ids: string[]) {
  store = store.filter((item) => !ids.includes(item.id));
}

export function setActive(ids: string[], isActive: boolean, actor: string) {
  const now = new Date().toISOString();
  store = store.map((item) =>
    ids.includes(item.id) ? { ...item, isActive, updatedAt: now, updatedBy: actor } : item,
  );
}

export const nextItemCode = () => `ITM-${String(sequence + 1).padStart(5, '0')}`;

export function searchBrands(query: string) {
  const needle = query.trim().toLocaleLowerCase();
  return brands.filter(
    (b) =>
      !needle ||
      b.label.toLocaleLowerCase().includes(needle) ||
      b.value.toLocaleLowerCase().includes(needle),
  );
}

export function addBrand(name: string) {
  const code = `BR-${String(brands.length + 41).padStart(4, '0')}`;
  const brand = { value: code, label: name, description: `${code} · 0 items` };
  brands.push(brand);
  return brand;
}

export const unitLabel = (uomId: string) => labelOf(units, uomId) ?? uomId;
