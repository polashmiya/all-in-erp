import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionButton,
  DetailSection,
  Field,
  FieldSection,
  NumberStepper,
  UnitInput,
} from '@erp/ui';
import { Button, Form, Input, InputNumber, Radio, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { warehouses } from '../../services/reference.mock';
import type { ItemFormValues } from '../../types/item.types';
import { ITEM_LIMITS, STEP } from './item-form.model';

export function StockSection({ isNew }: { isNew: boolean }) {
  const { t } = useTranslation();
  const form = Form.useFormInstance<ItemFormValues>();
  const levels = Form.useWatch('warehouseLevels', form) ?? [];
  const used = new Set(levels.map((l) => l?.warehouseId).filter(Boolean));

  return (
    <>
      <FieldSection title={t('item.sec.stockLevels')} description={t('item.sec.stockLevelsHint')}>
        <Field
          name="reorderLevel"
          label={t('item.f.reorderLevel')}
          rules={[{ required: true, message: t('item.f.reorderRequired') }]}
        >
          <NumberStepper min={0} step={STEP.reorder} />
        </Field>
        <Field
          name="maxStock"
          label={t('item.f.maxStock')}
          dependencies={['reorderLevel']}
          rules={[
            ({ getFieldValue }) => ({
              validator: (_, value?: number) =>
                !value || value >= (getFieldValue('reorderLevel') ?? 0)
                  ? Promise.resolve()
                  : Promise.reject(new Error(t('item.f.maxBelowReorder'))),
            }),
          ]}
        >
          <NumberStepper min={0} step={STEP.maxStock} />
        </Field>
        <Field name="openingStock" label={t('item.f.openingStock')} extra={t('item.f.openingHint')}>
          <NumberStepper min={0} step={STEP.reorder} disabled={!isNew} />
        </Field>
        <Field name="defaultWarehouseId" label={t('item.f.defaultWarehouse')}>
          <Select options={warehouses} />
        </Field>
        <Field name="shelfLifeMonths" label={t('item.f.shelfLife')}>
          <UnitInput
            unit={t('item.f.months')}
            min={0}
            max={ITEM_LIMITS.shelfLifeMonths}
            precision={0}
          />
        </Field>
        <Field name="storage" label={t('item.f.storage')}>
          <Radio.Group
            options={[
              { value: 'room', label: t('item.f.roomTemp') },
              { value: 'cold', label: t('item.f.cold') },
            ]}
          />
        </Field>
      </FieldSection>

      <DetailSection
        title={t('item.sec.warehouseLevels')}
        description={t('item.sec.warehouseLevelsHint')}
      >
        <Form.List name="warehouseLevels">
          {(fields, { add, remove }) => (
            <>
              {fields.length > 0 && (
                <div className="erp-subtable">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('item.f.warehouse')}</th>
                        <th className="erp-subtable__col-num">{t('item.f.reorderLevel')}</th>
                        <th className="erp-subtable__col-num">{t('item.f.bin')}</th>
                        <th className="erp-subtable__col-action">
                          <span className="sr-only">{t('item.f.removeRow')}</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fields.map((field) => (
                        <tr key={field.key}>
                          <td>
                            <Form.Item
                              name={[field.name, 'warehouseId']}
                              rules={[{ required: true, message: t('item.f.chooseWarehouse') }]}
                            >
                              <Select
                                aria-label={t('item.f.warehouse')}
                                placeholder={t('item.f.chooseWarehouse')}
                                options={warehouses.map((w) => ({
                                  ...w,
                                  disabled:
                                    used.has(w.value) &&
                                    levels[field.name]?.warehouseId !== w.value,
                                }))}
                              />
                            </Form.Item>
                          </td>
                          <td>
                            <Form.Item
                              name={[field.name, 'reorderLevel']}
                              rules={[{ required: true, message: t('item.f.reorderRequired') }]}
                            >
                              <InputNumber<number>
                                min={0}
                                precision={0}
                                controls={false}
                                className="erp-w-full"
                                aria-label={t('item.f.reorderLevel')}
                              />
                            </Form.Item>
                          </td>
                          <td>
                            <Form.Item name={[field.name, 'bin']}>
                              <Input maxLength={ITEM_LIMITS.bin} aria-label={t('item.f.bin')} />
                            </Form.Item>
                          </td>
                          <td>
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                              aria-label={t('item.f.removeRow')}
                              onClick={() => remove(field.name)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div>
                <ActionButton
                  action={{
                    key: 'add',
                    label: t('item.f.addWarehouseRow'),
                    icon: <PlusOutlined />,
                    variant: 'dashed',
                    disabled: used.size >= warehouses.length,
                    onClick: () => add({ reorderLevel: form.getFieldValue('reorderLevel') ?? 0 }),
                  }}
                />
              </div>
            </>
          )}
        </Form.List>
      </DetailSection>
    </>
  );
}
