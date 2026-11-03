import { DATE_FORMAT, Field, FieldSection, MoneyInput, PercentInput, YesNoSwitch } from '@erp/ui';
import { DatePicker, Form, Select, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { priceLists } from '../../services/reference.mock';
import type { ItemFormValues } from '../../types/item.types';
import { marginPercent } from './item-form.model';

export function PricingSection() {
  const { t } = useTranslation();
  const form = Form.useFormInstance<ItemFormValues>();
  const purchase = Form.useWatch('purchasePrice', form);
  const sale = Form.useWatch('salePrice', form);
  const discount = Form.useWatch('discountAllowed', form);
  const margin = marginPercent(purchase, sale);

  return (
    <>
      <FieldSection title={t('item.sec.prices')} description={t('item.sec.pricesHint')}>
        <Field
          name="purchasePrice"
          label={t('item.f.purchasePrice')}
          rules={[{ required: true, message: t('item.f.purchasePriceRequired') }]}
        >
          <MoneyInput />
        </Field>
        <Field
          name="salePrice"
          label={t('item.f.salePrice')}
          dependencies={['purchasePrice']}
          rules={[{ required: true, message: t('item.f.salePriceRequired') }]}
          extra={
            margin !== null &&
            (margin < 0 ? (
              <Typography.Text type="warning">{t('item.f.belowCost')}</Typography.Text>
            ) : (
              t('item.f.margin', { value: margin.toFixed(1) })
            ))
          }
        >
          <MoneyInput />
        </Field>
        <Field
          name="mrp"
          label={t('item.f.mrp')}
          dependencies={['salePrice']}
          rules={[
            ({ getFieldValue }) => ({
              validator: (_, value?: number) =>
                value === undefined ||
                value === null ||
                !getFieldValue('salePrice') ||
                value >= getFieldValue('salePrice')
                  ? Promise.resolve()
                  : Promise.reject(new Error(t('item.f.mrpBelowSale'))),
            }),
          ]}
        >
          <MoneyInput />
        </Field>
        <Field name="vatPercent" label={t('item.f.vat')}>
          <PercentInput />
        </Field>
        <Field name="priceEffectiveFrom" label={t('item.f.priceFrom')}>
          <DatePicker format={DATE_FORMAT} className="erp-w-full" />
        </Field>
        <Field name="priceListId" label={t('item.f.priceList')}>
          <Select options={priceLists} />
        </Field>
      </FieldSection>

      <FieldSection title={t('item.sec.discount')} description={t('item.sec.discountHint')}>
        <Field name="discountAllowed" label={t('item.f.discountAllowed')} valuePropName="checked">
          <YesNoSwitch />
        </Field>
        {discount && (
          <>
            <Field
              name="maxDiscountPercent"
              label={t('item.f.maxDiscount')}
              rule={t('item.f.visibleWhenDiscount')}
              rules={[{ required: true, message: t('item.f.maxDiscountRequired') }]}
            >
              <PercentInput />
            </Field>
            <Field
              name="discountValidTill"
              label={t('item.f.discountTill')}
              rule={t('item.f.requiredWhenDiscount')}
              rules={[{ required: true, message: t('item.f.discountTillRequired') }]}
            >
              <DatePicker
                format={DATE_FORMAT}
                placeholder={t('item.f.pickDate')}
                className="erp-w-full"
                disabledDate={(d) => d.isBefore(dayjs(), 'day')}
              />
            </Field>
          </>
        )}
      </FieldSection>
    </>
  );
}
