import type { AccountSetupRequest } from '@erp/api-client';

export interface OfficeForm {
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

/** `officeCode` is '' when the warehouse sits directly under the business unit. */
export interface WarehouseForm {
  code?: string;
  name?: string;
  officeCode?: string;
  address?: string;
}

export interface BusinessUnitForm {
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  offices?: OfficeForm[];
  warehouses?: WarehouseForm[];
}

export interface AccountForm {
  code?: string;
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  industry?: string;
  taxId?: string;
  address?: string;
  city?: string;
  country?: string;
  baseCurrency?: string;
  timeZone?: string;
}

export interface AdminForm {
  fullName?: string;
  email?: string;
  passwordMode?: 'generate' | 'manual';
  password?: string;
  confirmPassword?: string;
}

export interface SetupFormValues {
  account?: AccountForm;
  businessUnits?: BusinessUnitForm[];
  /** ERP feature codes the account gets; filled with every feature when the step first opens. */
  featureCodes?: string[];
  admin?: AdminForm;
}

export type FieldPath = (string | number)[];

export const STEP_KEYS = ['account', 'businessUnits', 'offices', 'warehouses', 'menus', 'review'] as const;

export const UNIT_LEVEL = '';

export const CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]*$/;
export const PHONE_PATTERN = /^\+?[0-9][0-9 -]{5,19}$/;
export const STRONG_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,128}$/;

export const newBusinessUnit = (): BusinessUnitForm => ({ offices: [], warehouses: [] });

export const initialValues: SetupFormValues = {
  account: { country: 'BD', baseCurrency: 'BDT', timeZone: 'Asia/Dhaka' },
  businessUnits: [newBusinessUnit()],
  admin: { passwordMode: 'generate' },
};

const COMPANY_SUFFIXES = new Set(['LTD', 'LIMITED', 'PLC', 'INC', 'CO', 'COMPANY', 'PVT', 'PRIVATE', 'LLC', 'CORP', 'THE']);

/**
 * A code suggestion from a name: Latin letters and digits only, company suffixes dropped, whole words joined by
 * dashes while they fit. "Demo Pharma Ltd." → "DEMO-PHARMA"; "North Division" (max 12) → "NORTH".
 * Returns '' when the name has nothing usable (e.g. Bangla only).
 */
export function suggestCode(name: string | undefined, maxLength = 20): string {
  const words = (name ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
  const meaningful = words.filter((w) => !COMPANY_SUFFIXES.has(w));
  const [first, ...rest] = meaningful.length ? meaningful : words;
  if (!first) return '';

  let code = first.slice(0, maxLength);
  for (const word of rest) {
    if (code.length + 1 + word.length > maxLength) break;
    code += `-${word}`;
  }
  return code;
}

/** Upper-cases and turns spaces into dashes as the user types a code. */
export const normalizeCode = (value: string | undefined) => value?.toUpperCase().replace(/\s+/g, '-') ?? '';

const text = (value: string | undefined) => value?.trim() ?? '';
const optional = (value: string | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};
const code = (value: string | undefined) => text(value).toUpperCase();

/** Form values → API request: trimmed, codes upper-cased, empty optional fields sent as null. */
export function toSetupRequest(values: SetupFormValues): AccountSetupRequest {
  const account = values.account ?? {};
  const admin = values.admin ?? {};

  return {
    account: {
      code: code(account.code),
      name: text(account.name),
      email: text(account.email),
      phone: text(account.phone),
      website: optional(account.website),
      industry: optional(account.industry),
      taxId: optional(account.taxId),
      address: text(account.address),
      city: optional(account.city),
      country: text(account.country),
      baseCurrency: text(account.baseCurrency),
      timeZone: text(account.timeZone),
    },
    businessUnits: (values.businessUnits ?? []).map((unit) => ({
      code: code(unit.code),
      name: text(unit.name),
      email: optional(unit.email),
      phone: optional(unit.phone),
      address: optional(unit.address),
      offices: (unit.offices ?? []).map((office) => ({
        code: code(office.code),
        name: text(office.name),
        email: optional(office.email),
        phone: optional(office.phone),
        address: optional(office.address),
      })),
      warehouses: (unit.warehouses ?? []).map((warehouse) => ({
        code: code(warehouse.code),
        name: text(warehouse.name),
        officeCode: warehouse.officeCode ? code(warehouse.officeCode) : null,
        address: optional(warehouse.address),
      })),
    })),
    featureCodes: values.featureCodes ?? [],
    admin: {
      fullName: text(admin.fullName),
      email: text(admin.email).toLowerCase(),
      password: admin.passwordMode === 'manual' ? (admin.password ?? null) : null,
    },
  };
}

/** API error key → form field path: "businessUnits[1].offices[0].code" → ['businessUnits', 1, 'offices', 0, 'code']. */
export function toFieldPath(key: string): FieldPath {
  return key
    .split('.')
    .filter(Boolean)
    .flatMap((part) => {
      const [name, ...indexes] = part.split('[');
      return [name!, ...indexes.map((i) => Number(i.replace(']', '')))].filter((p) => p !== '');
    });
}

/** The wizard step that owns a field, so a server error can take the user straight there. */
export function stepOfField(path: FieldPath): number {
  if (path[0] === 'account') return 0;
  if (path[0] === 'businessUnits') {
    if (path[2] === 'offices') return 2;
    if (path[2] === 'warehouses') return 3;
    return 1;
  }
  if (path[0] === 'featureCodes') return 4;
  return 5;
}

export function countStructure(units: BusinessUnitForm[] | undefined) {
  const list = units ?? [];
  return {
    businessUnits: list.length,
    offices: list.reduce((sum, u) => sum + (u.offices?.length ?? 0), 0),
    warehouses: list.reduce((sum, u) => sum + (u.warehouses?.length ?? 0), 0),
  };
}

/** True when another sibling (other than `index`) already uses the code. */
export function isDuplicateCode(codes: (string | undefined)[], index: number): boolean {
  const value = code(codes[index]);
  return value.length > 0 && codes.some((other, i) => i !== index && code(other) === value);
}
