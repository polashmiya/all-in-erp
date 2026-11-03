import type { BusinessUnitDetail } from '@erp/api-client';
import type { BusinessUnitForm } from '../account-setup/model/setup-model';

export interface StructureLeaf {
  key: string;
  code: string;
  name: string;
}

export interface StructureOffice extends StructureLeaf {
  warehouses: StructureLeaf[];
}

export interface StructureUnit extends StructureLeaf {
  offices: StructureOffice[];
  warehouses: StructureLeaf[];
}

const upper = (value: string | undefined) => value?.trim().toUpperCase() ?? '';

export function structureFromForm(units: BusinessUnitForm[] | undefined): StructureUnit[] {
  return (units ?? []).map((unit, u) => {
    const offices: StructureOffice[] = (unit.offices ?? []).map((office, o) => ({
      key: `u${u}-o${o}`,
      code: upper(office?.code),
      name: office?.name?.trim() ?? '',
      warehouses: [],
    }));
    const unitWarehouses: StructureLeaf[] = [];

    (unit.warehouses ?? []).forEach((warehouse, w) => {
      const leaf = {
        key: `u${u}-w${w}`,
        code: upper(warehouse?.code),
        name: warehouse?.name?.trim() ?? '',
      };
      const office = warehouse?.officeCode
        ? offices.find((o) => o.code === upper(warehouse.officeCode))
        : undefined;
      (office ? office.warehouses : unitWarehouses).push(leaf);
    });

    return {
      key: `u${u}`,
      code: upper(unit.code),
      name: unit.name?.trim() ?? '',
      offices,
      warehouses: unitWarehouses,
    };
  });
}

export function structureFromDetail(units: BusinessUnitDetail[]): StructureUnit[] {
  const leaf = (w: { id: string; code: string; name: string }): StructureLeaf => ({
    key: w.id,
    code: w.code,
    name: w.name,
  });

  return units.map((unit) => ({
    key: unit.id,
    code: unit.code,
    name: unit.name,
    offices: unit.offices.map((office) => ({
      key: office.id,
      code: office.code,
      name: office.name,
      warehouses: office.warehouses.map(leaf),
    })),
    warehouses: unit.warehouses.map(leaf),
  }));
}

export const STRUCTURE_TINT = { unit: 'primary', office: 'violet', warehouse: 'amber' } as const;
