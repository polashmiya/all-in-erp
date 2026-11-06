import { CheckboxList, Field, FieldSection, PercentInput } from '@erp/ui';
import { Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { selectOptions } from '../../common/master-data';
import type { ItemLookups } from '../item-lookups';

export function TaxSection({ lookups }: { lookups: ItemLookups }) {
  const { t } = useTranslation();
  const supplyTypes = selectOptions(lookups.supplyTypes);
  const supplyTypeRules = [{ required: true, message: t('item.f.supplyTypeRequired') }];

  return (
    <FieldSection title={t('item.tab.tax')} columns={4}>
      <Field
        name="purchaseSupplyTypeId"
        label={t('item.v.purchaseSupplyType')}
        rules={supplyTypeRules}
      >
        <Select<number> options={supplyTypes} />
      </Field>
      <Field name="purchaseVatPercentage" label={t('item.v.purchaseVat')}>
        <PercentInput className="erp-w-full" />
      </Field>
      <Field name="salesSupplyTypeId" label={t('item.v.salesSupplyType')} rules={supplyTypeRules}>
        <Select<number> options={supplyTypes} />
      </Field>
      <Field name="salesVatPercentage" label={t('item.v.salesVat')}>
        <PercentInput className="erp-w-full" />
      </Field>
      <Field name="sdPercentage" label={t('item.f.sd')}>
        <PercentInput className="erp-w-full" />
      </Field>
      <Field label={t('item.sec.vatOptions')} className="erp-field-span-2">
        <CheckboxList
          options={[
            { name: 'isVatInclusive', label: t('item.f.vatInclusive') },
            { name: 'isVatRebatable', label: t('item.f.vatRebatable') },
          ]}
        />
      </Field>
    </FieldSection>
  );
}
