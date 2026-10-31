import type { ReactNode } from 'react';
import { localize, type Language, type LocalizedText } from '../i18n/language';

/**
 * A navigation node. The ERP menu is three levels deep (Module > Sub-module > Feature) plus
 * top-level items such as Dashboard or Settings. Only leaves carry a `path`.
 */
export interface MenuNode {
  /** Stable key, e.g. `inventory`, `inventory.master-data`, `inventory.item`. */
  key: string;
  label: LocalizedText;
  icon?: ReactNode;
  path?: string;
  children?: MenuNode[];
}

function matches(path: string, pathname: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

/**
 * Returns the chain of nodes from the root to the leaf whose path best matches `pathname`
 * (longest prefix wins, so `/app/inventory/item/42/edit` resolves to the Item leaf).
 */
export function findTrail(nodes: MenuNode[], pathname: string): MenuNode[] {
  let best: MenuNode[] = [];

  const walk = (list: MenuNode[], ancestors: MenuNode[]) => {
    for (const node of list) {
      const chain = [...ancestors, node];
      if (node.path && matches(node.path, pathname)) {
        const bestLeaf = best.at(-1);
        if (!bestLeaf?.path || node.path.length > bestLeaf.path.length) best = chain;
      }
      if (node.children) walk(node.children, chain);
    }
  };

  walk(nodes, []);
  return best;
}

/**
 * Filters the tree by a search keyword. A node is kept when its own label matches (then its whole
 * subtree is kept) or when any descendant matches (then only the matching branches are kept).
 */
export function filterMenu(nodes: MenuNode[], keyword: string, language: Language): MenuNode[] {
  const needle = keyword.trim().toLocaleLowerCase();
  if (!needle) return nodes;

  const labelMatches = (node: MenuNode) =>
    localize(node.label, language).toLocaleLowerCase().includes(needle) ||
    (typeof node.label !== 'string' && localize(node.label, 'en').toLocaleLowerCase().includes(needle));

  const visit = (list: MenuNode[]): MenuNode[] =>
    list.flatMap((node) => {
      if (labelMatches(node)) return [node];
      if (!node.children) return [];
      const children = visit(node.children);
      return children.length ? [{ ...node, children }] : [];
    });

  return visit(nodes);
}

/** Keys of every node that has children — used to expand the whole tree while searching. */
export function collectGroupKeys(nodes: MenuNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children?.length ? [node.key, ...collectGroupKeys(node.children)] : [],
  );
}

/** Depth-first list of leaves (nodes with a path). */
export function flattenLeaves(nodes: MenuNode[]): MenuNode[] {
  return nodes.flatMap((node) => (node.children ? flattenLeaves(node.children) : node.path ? [node] : []));
}
