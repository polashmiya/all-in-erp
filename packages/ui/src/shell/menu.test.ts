import { collectGroupKeys, filterMenu, findTrail, flattenLeaves, type MenuNode } from './menu';

const menu: MenuNode[] = [
  { key: 'dashboard', label: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, path: '/dashboard' },
  {
    key: 'inventory',
    label: { en: 'Inventory', bn: 'ইনভেন্টরি' },
    children: [
      {
        key: 'inventory.master-data',
        label: { en: 'Master Data', bn: 'মাস্টার ডেটা' },
        children: [
          { key: 'inventory.item', label: { en: 'Item Profile', bn: 'আইটেম প্রোফাইল' }, path: '/app/inventory/item' },
          {
            key: 'inventory.item-category',
            label: { en: 'Item Category', bn: 'আইটেম ক্যাটাগরি' },
            path: '/app/inventory/item-category',
          },
        ],
      },
      {
        key: 'inventory.transactions',
        label: { en: 'Transactions', bn: 'লেনদেন' },
        children: [
          { key: 'inventory.goods-receipt', label: 'Goods Receipt', path: '/app/inventory/goods-receipt' },
        ],
      },
    ],
  },
];

describe('findTrail', () => {
  it('returns module > sub-module > feature for a feature path', () => {
    expect(findTrail(menu, '/app/inventory/item').map((n) => n.key)).toEqual([
      'inventory',
      'inventory.master-data',
      'inventory.item',
    ]);
  });

  it('matches nested routes under a feature (edit/view pages)', () => {
    expect(findTrail(menu, '/app/inventory/item/42/edit').at(-1)?.key).toBe('inventory.item');
  });

  it('does not confuse sibling paths that share a prefix', () => {
    expect(findTrail(menu, '/app/inventory/item-category').at(-1)?.key).toBe('inventory.item-category');
  });

  it('returns an empty trail for unknown paths', () => {
    expect(findTrail(menu, '/nowhere')).toEqual([]);
  });
});

describe('filterMenu', () => {
  it('keeps ancestors of matching leaves and drops non-matching branches', () => {
    const result = filterMenu(menu, 'item cat', 'en');
    expect(result).toHaveLength(1);
    expect(result[0]?.key).toBe('inventory');
    expect(result[0]?.children?.map((n) => n.key)).toEqual(['inventory.master-data']);
    expect(result[0]?.children?.[0]?.children?.map((n) => n.key)).toEqual(['inventory.item-category']);
  });

  it('keeps the full subtree when a group label matches', () => {
    const result = filterMenu(menu, 'master', 'en');
    expect(result[0]?.children?.[0]?.children).toHaveLength(2);
  });

  it('searches Bangla labels and still matches English while Bangla is active', () => {
    expect(flattenLeaves(filterMenu(menu, 'আইটেম', 'bn'))).toHaveLength(2);
    expect(flattenLeaves(filterMenu(menu, 'receipt', 'bn')).map((n) => n.key)).toEqual([
      'inventory.goods-receipt',
    ]);
  });

  it('returns the tree unchanged for a blank keyword', () => {
    expect(filterMenu(menu, '   ', 'en')).toBe(menu);
  });
});

describe('collectGroupKeys', () => {
  it('lists every node that has children', () => {
    expect(collectGroupKeys(menu)).toEqual(['inventory', 'inventory.master-data', 'inventory.transactions']);
  });
});
