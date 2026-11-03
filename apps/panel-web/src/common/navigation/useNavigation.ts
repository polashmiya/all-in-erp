import { useGetPanelNavigation, type PanelMenuItemDto } from '@erp/api-client';
import { resolveIcon, type MenuNode } from '@erp/ui';
import { useMemo } from 'react';

function toMenuNodes(items: PanelMenuItemDto[]): MenuNode[] {
  return items.map((item) => ({
    key: item.key,
    label: { en: item.label.en, ...(item.label.bn ? { bn: item.label.bn } : {}) },
    icon: resolveIcon(item.icon),
    path: item.path ?? undefined,
    children: item.children.length ? toMenuNodes(item.children) : undefined,
  }));
}

export function useNavigation() {
  const query = useGetPanelNavigation({ query: { staleTime: 10 * 60_000 } });
  const menu = useMemo(() => toMenuNodes(query.data ?? []), [query.data]);

  return { menu, loading: query.isPending };
}
