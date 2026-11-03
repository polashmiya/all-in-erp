import type { ReactNode } from 'react';
import { localize, type Language, type LocalizedText } from '../i18n/language';

export interface MenuNode {
  key: string;
  label: LocalizedText;
  icon?: ReactNode;
  path?: string;
  count?: string | number;
  badge?: string | number;
  children?: MenuNode[];
}

function matches(path: string, pathname: string) {
  return pathname === path || pathname.startsWith(`${path}/`);
}

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

export function collectGroupKeys(nodes: MenuNode[]): string[] {
  return nodes.flatMap((node) =>
    node.children?.length ? [node.key, ...collectGroupKeys(node.children)] : [],
  );
}

export function flattenLeaves(nodes: MenuNode[]): MenuNode[] {
  return nodes.flatMap((node) => (node.children ? flattenLeaves(node.children) : node.path ? [node] : []));
}

export interface LeafWithTrail {
  node: MenuNode;
  ancestors: MenuNode[];
}

export function flattenLeavesWithTrail(nodes: MenuNode[], ancestors: MenuNode[] = []): LeafWithTrail[] {
  return nodes.flatMap((node) =>
    node.children ? flattenLeavesWithTrail(node.children, [...ancestors, node]) : node.path ? [{ node, ancestors }] : [],
  );
}
