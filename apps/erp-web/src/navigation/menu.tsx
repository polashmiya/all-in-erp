import {
  BarChartOutlined,
  DashboardOutlined,
  InboxOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import type { MenuNode } from '@erp/ui';

/**
 * ERP navigation: Module > Sub-module > Feature, plus top-level destinations.
 * Phase 5 builds the module part from /api/erp/bootstrap (enabled + permitted features only);
 * leaf keys already follow the `{module}.{feature}` feature-key convention.
 */
export const erpMenu: MenuNode[] = [
  { key: 'dashboard', label: { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, icon: <DashboardOutlined />, path: '/dashboard' },
  {
    key: 'inventory',
    label: { en: 'Inventory', bn: 'ইনভেন্টরি' },
    icon: <InboxOutlined />,
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
          { key: 'inventory.uom', label: { en: 'Unit of Measure', bn: 'পরিমাপের একক' }, path: '/app/inventory/uom' },
          { key: 'inventory.warehouse', label: { en: 'Warehouse', bn: 'গুদাম' }, path: '/app/inventory/warehouse' },
        ],
      },
      {
        key: 'inventory.transactions',
        label: { en: 'Transactions', bn: 'লেনদেন' },
        children: [
          {
            key: 'inventory.goods-receipt',
            label: { en: 'Goods Receipt', bn: 'পণ্য গ্রহণ' },
            path: '/app/inventory/goods-receipt',
          },
          {
            key: 'inventory.stock-transfer',
            label: { en: 'Stock Transfer', bn: 'স্টক স্থানান্তর' },
            path: '/app/inventory/stock-transfer',
          },
          {
            key: 'inventory.stock-adjustment',
            label: { en: 'Stock Adjustment', bn: 'স্টক সমন্বয়' },
            path: '/app/inventory/stock-adjustment',
          },
        ],
      },
      {
        key: 'inventory.reports',
        label: { en: 'Reports', bn: 'রিপোর্ট' },
        children: [
          {
            key: 'inventory.stock-ledger',
            label: { en: 'Stock Ledger', bn: 'স্টক লেজার' },
            path: '/app/inventory/stock-ledger',
          },
          {
            key: 'inventory.stock-summary',
            label: { en: 'Stock Summary', bn: 'স্টক সারসংক্ষেপ' },
            path: '/app/inventory/stock-summary',
          },
        ],
      },
    ],
  },
  {
    key: 'procurement',
    label: { en: 'Procurement', bn: 'ক্রয়' },
    icon: <ShoppingCartOutlined />,
    children: [
      {
        key: 'procurement.master-data',
        label: { en: 'Master Data', bn: 'মাস্টার ডেটা' },
        children: [
          { key: 'procurement.supplier', label: { en: 'Supplier', bn: 'সরবরাহকারী' }, path: '/app/procurement/supplier' },
        ],
      },
      {
        key: 'procurement.transactions',
        label: { en: 'Transactions', bn: 'লেনদেন' },
        children: [
          {
            key: 'procurement.purchase-requisition',
            label: { en: 'Purchase Requisition', bn: 'ক্রয় অনুরোধ' },
            path: '/app/procurement/purchase-requisition',
          },
          {
            key: 'procurement.purchase-order',
            label: { en: 'Purchase Order', bn: 'ক্রয় আদেশ' },
            path: '/app/procurement/purchase-order',
          },
        ],
      },
    ],
  },
  {
    key: 'sales',
    label: { en: 'Sales', bn: 'বিক্রয়' },
    icon: <ShopOutlined />,
    children: [
      {
        key: 'sales.master-data',
        label: { en: 'Master Data', bn: 'মাস্টার ডেটা' },
        children: [
          { key: 'sales.customer', label: { en: 'Customer', bn: 'গ্রাহক' }, path: '/app/sales/customer' },
          { key: 'sales.price-list', label: { en: 'Price List', bn: 'মূল্য তালিকা' }, path: '/app/sales/price-list' },
        ],
      },
      {
        key: 'sales.transactions',
        label: { en: 'Transactions', bn: 'লেনদেন' },
        children: [
          { key: 'sales.sales-order', label: { en: 'Sales Order', bn: 'বিক্রয় আদেশ' }, path: '/app/sales/sales-order' },
          {
            key: 'sales.sales-invoice',
            label: { en: 'Sales Invoice', bn: 'বিক্রয় চালান' },
            path: '/app/sales/sales-invoice',
          },
        ],
      },
    ],
  },
  { key: 'reports', label: { en: 'Reports Center', bn: 'রিপোর্ট সেন্টার' }, icon: <BarChartOutlined />, path: '/reports' },
  { key: 'settings', label: { en: 'Settings', bn: 'সেটিংস' }, icon: <SettingOutlined />, path: '/settings' },
  { key: 'help', label: { en: 'Help & Support', bn: 'সহায়তা' }, icon: <QuestionCircleOutlined />, path: '/help' },
];
