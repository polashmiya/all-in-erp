export interface RefOption {
  value: string;
  label: string;
  description?: string;
}

export const categories: RefOption[] = [
  { value: 'tablet', label: 'Tablet' },
  { value: 'capsule', label: 'Capsule' },
  { value: 'syrup', label: 'Syrup' },
  { value: 'injection', label: 'Injection' },
  { value: 'powder', label: 'Powder' },
  { value: 'consumable', label: 'Consumable' },
];

export const subCategories: Record<string, RefOption[]> = {
  tablet: [
    { value: 'tablet-film', label: 'Film-coated' },
    { value: 'tablet-chewable', label: 'Chewable' },
    { value: 'tablet-er', label: 'Extended release' },
  ],
  capsule: [
    { value: 'capsule-hard', label: 'Hard gelatin' },
    { value: 'capsule-soft', label: 'Soft gelatin' },
  ],
  syrup: [
    { value: 'syrup-oral', label: 'Oral suspension' },
    { value: 'syrup-drops', label: 'Paediatric drops' },
  ],
  injection: [
    { value: 'injection-pen', label: 'Pre-filled pen' },
    { value: 'injection-vial', label: 'Vial' },
  ],
  powder: [{ value: 'powder-sachet', label: 'Sachet' }],
  consumable: [
    { value: 'consumable-ppe', label: 'PPE' },
    { value: 'consumable-dressing', label: 'Dressing' },
    { value: 'consumable-hygiene', label: 'Hygiene' },
  ],
};

export const units: RefOption[] = [
  { value: 'strip', label: 'Strip (10 tablets)' },
  { value: 'box', label: 'Box' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'pen', label: 'Pen' },
  { value: 'sachet', label: 'Sachet' },
  { value: 'roll', label: 'Roll' },
];

export const unitShort: Record<string, string> = {
  strip: 'Strip',
  box: 'Box',
  bottle: 'Bottle',
  pen: 'Pen',
  sachet: 'Sachet',
  roll: 'Roll',
};

export const brands: RefOption[] = [
  { value: 'BR-0012', label: 'Square Health', description: 'BR-0012 · 214 items' },
  { value: 'BR-0019', label: 'Square Toiletries', description: 'BR-0019 · 38 items' },
  { value: 'BR-0021', label: 'Beximco Pharma', description: 'BR-0021 · 176 items' },
  { value: 'BR-0027', label: 'Incepta', description: 'BR-0027 · 152 items' },
  { value: 'BR-0033', label: 'Renata', description: 'BR-0033 · 98 items' },
  { value: 'BR-0040', label: 'ACI Limited', description: 'BR-0040 · 64 items' },
];

export const warehouses: RefOption[] = [
  { value: 'WH-DHK', label: 'Dhaka Main Store' },
  { value: 'WH-MRP', label: 'Mirpur Outlet' },
  { value: 'WH-UTR', label: 'Uttara Outlet' },
];

export const countries: RefOption[] = [
  { value: 'BD', label: 'Bangladesh' },
  { value: 'IN', label: 'India' },
  { value: 'CN', label: 'China' },
  { value: 'DE', label: 'Germany' },
  { value: 'US', label: 'United States' },
];

export const priceLists: RefOption[] = [
  { value: 'retail', label: 'Retail — default' },
  { value: 'wholesale', label: 'Wholesale' },
  { value: 'institutional', label: 'Institutional' },
];

export const tagSuggestions = [
  'OTC',
  'Fast moving',
  'Cold-chain: No',
  'Cold-chain: Yes',
  'Controlled',
  'Seasonal',
];

export const labelOf = (options: RefOption[], value: string | undefined | null) =>
  options.find((o) => o.value === value)?.label;
