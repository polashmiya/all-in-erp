export type DashboardRange = 'today' | '7d' | '30d' | 'qtr';
export type SalesRange = '12m' | '6m' | '30d';

export interface Kpi {
  value: number;
  delta?: number;
  trend: number[];
}

export interface ReorderRow {
  id: string;
  name: string;
  onHand: number;
  reorderLevel: number;
}

export type ActivityKind = 'approved' | 'imported' | 'price' | 'transfer' | 'user' | 'received';

export interface ActivityEvent {
  id: string;
  kind: ActivityKind;
  ref: string;
  actor: string;
  at: string;
  target?: string;
}

export interface DashboardSummary {
  kpis: {
    totalItems: Kpi;
    stockValue: Kpi;
    lowStock: Kpi;
    pendingPurchaseOrders: Kpi & { amount: number };
  };
  sales: { label: string; line: number; bar: number }[];
  salesTotal: number;
  stockByCategory: { category: string; count: number }[];
  reorder: ReorderRow[];
  activity: ActivityEvent[];
}
