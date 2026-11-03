import type { DashboardRange, DashboardSummary, SalesRange } from './dashboard.types';

const RANGE_FACTOR: Record<DashboardRange, number> = { today: 0.04, '7d': 0.25, '30d': 1, qtr: 3 };

const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const SALES = [38, 42, 40, 47, 52, 49, 55, 61, 58, 64, 70, 74];
const PURCHASES = [30, 35, 33, 36, 41, 39, 44, 47, 46, 50, 53, 57];

function salesSeries(range: SalesRange) {
  if (range === '30d') {
    return [
      { label: 'W1', line: 16, bar: 12 },
      { label: 'W2', line: 18, bar: 15 },
      { label: 'W3', line: 19, bar: 14 },
      { label: 'W4', line: 21, bar: 16 },
    ];
  }
  const points = MONTHS.map((label, i) => ({ label, line: SALES[i]!, bar: PURCHASES[i]! }));
  return range === '6m' ? points.slice(-6) : points;
}

export function buildDashboard(range: DashboardRange, salesRange: SalesRange): DashboardSummary {
  const f = RANGE_FACTOR[range];
  return {
    kpis: {
      totalItems: {
        value: 1248,
        delta: 3.2,
        trend: [1180, 1192, 1201, 1210, 1214, 1226, 1235, 1248],
      },
      stockValue: {
        value: 48_200_000,
        delta: 6.8,
        trend: [41, 42.4, 43.1, 44, 45.2, 46.1, 47.4, 48.2],
      },
      lowStock: { value: 37, delta: 5, trend: [26, 28, 31, 29, 33, 32, 35, 37] },
      pendingPurchaseOrders: {
        value: 12,
        amount: Math.round(1_840_000 * Math.max(f, 0.5)),
        trend: [9, 11, 10, 14, 13, 12, 11, 12],
      },
    },
    sales: salesSeries(salesRange),
    salesTotal: Math.round(7_400_000 * f),
    stockByCategory: [
      { category: 'Tablet', count: 474 },
      { category: 'Capsule', count: 275 },
      { category: 'Syrup', count: 175 },
      { category: 'Injection', count: 137 },
      { category: 'Consumable', count: 112 },
      { category: 'Others', count: 75 },
    ],
    reorder: [
      { id: 'ITM-00126', name: 'Fexofenadine 120mg Tablet', onHand: 42, reorderLevel: 150 },
      { id: 'ITM-00128', name: 'Paracetamol Syrup 100ml', onHand: 18, reorderLevel: 120 },
      { id: 'ITM-00131', name: 'Hand Sanitizer 250ml', onHand: 0, reorderLevel: 80 },
      { id: 'ITM-00134', name: 'Insulin Pen 3ml', onHand: 9, reorderLevel: 40 },
      { id: 'ITM-00132', name: 'Cetirizine 10mg Tablet', onHand: 64, reorderLevel: 200 },
      { id: 'ITM-00136', name: 'ORS Sachet', onHand: 0, reorderLevel: 500 },
      { id: 'ITM-00137', name: 'Vitamin D3 2000 IU', onHand: 31, reorderLevel: 100 },
      { id: 'ITM-00138', name: 'Gauze Roll 10cm', onHand: 12, reorderLevel: 60 },
    ],
    activity: [
      { id: 'a1', kind: 'approved', ref: 'PO-2026-0412', actor: 'Karim Hossain', at: '10 min ago' },
      { id: 'a2', kind: 'imported', ref: '12', actor: 'Nusrat Jahan', at: '1 h ago' },
      { id: 'a3', kind: 'price', ref: 'Fexofenadine', actor: 'Rahim Ahmed', at: '3 h ago' },
      {
        id: 'a4',
        kind: 'transfer',
        ref: 'TR-0088',
        actor: 'Store team',
        at: 'Yesterday',
        target: 'Chattogram',
      },
      { id: 'a5', kind: 'user', ref: 'Tanvir', actor: 'Rahim Ahmed', at: 'Yesterday' },
      { id: 'a6', kind: 'received', ref: 'GRN-1180', actor: 'Store team', at: '28 Oct' },
    ],
  };
}
