import type { ItemDetail } from '@erp/api-client';
import { Field, FieldSection, MoneyInput, UnitInput, YesNoSwitch } from '@erp/ui';
import { Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { selectOptions } from '../../common/master-data';
import { ITEM_LIMITS, type ItemFormValues } from '../item-form';
import type { ItemLookups } from '../item-lookups';

export function PricingSection({ source, lookups }: { source?: ItemDetail; lookups: ItemLookups }) {
  const { t } = useTranslation();
  const form = Form.useFormInstance<ItemFormValues>();
  const uomId = Form.useWatch('uomId', form);
  const altUomId = Form.useWatch('altUomId', form);
  const uomCode = lookups.uoms?.find((u) => u.id === uomId)?.code ?? '';

  return (
    <>
      <FieldSection title={t('item.sec.units')} columns={4}>
        <Field
          name="uomId"
          label={t('item.f.uom')}
          rules={[{ required: true, message: t('item.f.uomRequired') }]}
        >
          <Select<number>
            showSearch
            optionFilterProp="label"
            options={selectOptions(lookups.uoms, source?.uomId)}
          />
        </Field>
        <Field
          name="isNoDecimalQty"
          label={t('item.f.noDecimal')}
          tooltip={t('item.f.noDecimalHint')}
          valuePropName="checked"
        >
          <YesNoSwitch />
        </Field>
        <Field name="altUomId" label={t('item.f.altUom')}>
          <Select<number>
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={t('item.f.altUomPlaceholder')}
            options={selectOptions(lookups.uoms, source?.altUomId).filter((o) => o.value !== uomId)}
          />
        </Field>
        {altUomId != null && (
          <Field
            name="altUomConversionQty"
            label={t('item.f.conversion')}
            tooltip={t('item.f.conversionHint')}
            rules={[{ required: true, message: t('item.f.conversionRequired') }]}
          >
            <UnitInput unit={uomCode} min={0.0001} precision={4} className="erp-w-full" />
          </Field>
        )}
      </FieldSection>

      <FieldSection title={t('item.sec.prices')} columns={4}>
        <Field name="lastCostPrice" label={t('item.f.lastCost')}>
          <MoneyInput />
        </Field>
        <Field name="averageCostPrice" label={t('item.f.averageCost')}>
          <MoneyInput />
        </Field>
        <Field name="salesPrice" label={t('item.f.salesPrice')}>
          <MoneyInput />
        </Field>
        <Field
          name="supplierName"
          label={t('item.f.supplier')}
          tooltip={t('item.f.supplierHint')}
          rules={[
            {
              max: ITEM_LIMITS.supplier,
              message: t('master.f.maxLength', { count: ITEM_LIMITS.supplier }),
            },
          ]}
        >
          <Input maxLength={ITEM_LIMITS.supplier} />
        </Field>
      </FieldSection>
    </>
  );
}
