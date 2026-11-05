import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useAuthStore } from '@/common/store/auth-store';
import { simulateLatency } from '@/common/utils/mock';
import type {
  Item,
  ItemDetail,
  ItemListQuery,
  ItemListResult,
  SaveItemInput,
} from '../types/item.types';
import * as db from './item.mock';

export function listItems(query: ItemListQuery): Promise<ItemListResult> {
  return simulateLatency(db.queryItems(query));
}

export function getItem(id: string): Promise<ItemDetail | null> {
  const item = db.findItem(id);
  return simulateLatency(item ? db.itemDetail(item) : null);
}

export function saveItem({ id, values, draft }: SaveItemInput, actor: string): Promise<Item> {
  const now = new Date().toISOString();
  const existing = id ? db.findItem(id) : undefined;
  const { image, attachments, priceEffectiveFrom, discountValidTill, ...rest } = values;

  const item = db.upsertItem({
    ...rest,
    id,
    tags: rest.tags ?? [],
    warehouseLevels: (rest.warehouseLevels ?? []).filter((w) => w?.warehouseId),
    discountAllowed: !!rest.discountAllowed,
    maxDiscountPercent: rest.discountAllowed ? rest.maxDiscountPercent : undefined,
    priceEffectiveFrom: priceEffectiveFrom
      ? dayjs(priceEffectiveFrom).format('YYYY-MM-DD')
      : undefined,
    discountValidTill:
      rest.discountAllowed && discountValidTill
        ? dayjs(discountValidTill).format('YYYY-MM-DD')
        : undefined,
    attachments: (attachments ?? []).map((f) => ({ name: f.name, size: f.size })),
    imageName: image?.[0]?.name,
    isDraft: draft,
    stockByWarehouse:
      existing?.stockByWarehouse ??
      (rest.openingStock
        ? [{ warehouseId: rest.defaultWarehouseId ?? 'WH-DHK', onHand: rest.openingStock }]
        : []),
    createdAt: existing?.createdAt ?? now,
    createdBy: existing?.createdBy ?? actor,
    updatedAt: now,
    updatedBy: actor,
  });
  return simulateLatency(item, 400);
}

export function deleteItems(ids: string[]): Promise<void> {
  db.removeItems(ids);
  return simulateLatency(undefined);
}

export function setItemsActive(ids: string[], isActive: boolean, actor: string): Promise<void> {
  db.setActive(ids, isActive, actor);
  return simulateLatency(undefined);
}

export function searchBrands(query: string) {
  return simulateLatency(db.searchBrands(query), 200);
}

export function createBrand(name: string) {
  return simulateLatency(db.addBrand(name), 200);
}

const itemKeys = {
  all: (unitId: string | null) => ['items', unitId] as const,
  list: (unitId: string | null, query: ItemListQuery) => ['items', unitId, 'list', query] as const,
  detail: (unitId: string | null, id: string) => ['items', unitId, 'detail', id] as const,
};

const useUnitId = () => useAuthStore((s) => s.currentBusinessUnitId);
const useActor = () => useAuthStore((s) => s.user?.fullName ?? 'You');

export function useItemList(query: ItemListQuery) {
  const unitId = useUnitId();
  return useQuery({
    queryKey: itemKeys.list(unitId, query),
    queryFn: () => listItems(query),
    placeholderData: keepPreviousData,
  });
}

export function useItem(id: string | undefined) {
  const unitId = useUnitId();
  return useQuery({
    queryKey: itemKeys.detail(unitId, id ?? ''),
    queryFn: () => getItem(id!),
    enabled: !!id,
  });
}

export function usePrefetchItem() {
  const unitId = useUnitId();
  const client = useQueryClient();
  return (id: string) =>
    void client.prefetchQuery({
      queryKey: itemKeys.detail(unitId, id),
      queryFn: () => getItem(id),
    });
}

function useInvalidateItems() {
  const unitId = useUnitId();
  const client = useQueryClient();
  return () => client.invalidateQueries({ queryKey: itemKeys.all(unitId) });
}

export function useSaveItem() {
  const actor = useActor();
  const invalidate = useInvalidateItems();
  return useMutation({
    mutationFn: (input: SaveItemInput) => saveItem(input, actor),
    onSuccess: invalidate,
  });
}

export function useDeleteItems() {
  const invalidate = useInvalidateItems();
  return useMutation({ mutationFn: deleteItems, onSuccess: invalidate });
}

export function useSetItemsActive() {
  const actor = useActor();
  const invalidate = useInvalidateItems();
  return useMutation({
    mutationFn: ({ ids, isActive }: { ids: string[]; isActive: boolean }) =>
      setItemsActive(ids, isActive, actor),
    onSuccess: invalidate,
  });
}
