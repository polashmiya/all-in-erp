/** ISO 3166-1 alpha-2 codes offered in the country picker (names come from Intl.DisplayNames). */
export const COUNTRIES = [
  'BD', 'IN', 'PK', 'NP', 'LK', 'BT', 'MV', 'MM', 'AE', 'SA', 'QA', 'KW', 'OM', 'BH',
  'MY', 'SG', 'TH', 'ID', 'VN', 'PH', 'CN', 'HK', 'JP', 'KR', 'TR', 'GB', 'DE', 'FR',
  'NL', 'IT', 'ES', 'US', 'CA', 'AU', 'NZ', 'ZA', 'KE', 'NG', 'EG',
] as const;

export const CURRENCIES = [
  'BDT', 'USD', 'EUR', 'GBP', 'INR', 'PKR', 'NPR', 'LKR', 'AED', 'SAR', 'QAR', 'MYR',
  'SGD', 'THB', 'IDR', 'CNY', 'JPY', 'AUD', 'CAD',
] as const;

export const TIME_ZONES = [
  'Asia/Dhaka', 'Asia/Kolkata', 'Asia/Karachi', 'Asia/Kathmandu', 'Asia/Colombo', 'Asia/Thimphu',
  'Asia/Yangon', 'Asia/Dubai', 'Asia/Riyadh', 'Asia/Qatar', 'Asia/Kuala_Lumpur', 'Asia/Singapore',
  'Asia/Bangkok', 'Asia/Jakarta', 'Asia/Shanghai', 'Asia/Hong_Kong', 'Asia/Tokyo', 'Europe/Istanbul',
  'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'America/New_York', 'America/Chicago',
  'America/Los_Angeles', 'America/Toronto', 'Australia/Sydney', 'Africa/Nairobi', 'Africa/Lagos', 'UTC',
] as const;

/** Suggestions only; the field accepts any text and nothing in the ERP branches on it. */
export const INDUSTRIES = [
  'Pharmaceuticals', 'FMCG', 'Manufacturing', 'Distribution', 'Retail', 'Textile & Garments',
  'Agro & Food', 'Healthcare', 'Construction', 'Electronics', 'Automotive', 'Chemicals',
  'Logistics', 'Services', 'Trading',
] as const;
