import { LockOutlined } from '@ant-design/icons';
import { DetailSection, Field, FieldGrid, LookupSelect } from '@erp/ui';
import { App, Checkbox, Form, Input, Radio, Segmented, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { createBrand, searchBrands } from '../../services/item.service';
import {
  categories,
  countries,
  subCategories,
  tagSuggestions,
  units,
} from '../../services/reference.mock';
import type { ItemFormValues } from '../../types/item.types';

const BARCODE = /^\d{8}$|^\d{12,14}$/;

export function GeneralSection({ code }: { code: string }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const form = Form.useFormInstance<ItemFormValues>();
  const categoryId = Form.useWatch('categoryId', form);
  const subOptions = categoryId ? (subCategories[categoryId] ?? []) : [];

  return (
    <>
      <DetailSection title={t('item.sec.basic')} description={t('item.sec.basicHint')}>
        <FieldGrid>
          <Field label={t('item.f.code')} extra={t('item.f.codeHint')}>
            <Input
              value={code}
              readOnly
              variant="filled"
              suffix={<LockOutlined style={{ color: 'var(--erp-text-muted)' }} />}
              aria-label={t('item.f.code')}
            />
          </Field>
          <Field
            name="name"
            label={t('item.f.name')}
            rules={[{ required: true, whitespace: true, message: t('item.f.nameRequired') }]}
          >
            <Input placeholder={t('item.f.namePlaceholder')} maxLength={160} />
          </Field>
          <Field
            name="genericName"
            label={t('item.f.genericName')}
            custom
            extra={t('item.f.genericHint')}
          >
            <Input maxLength={160} />
          </Field>
          <Field
            name="categoryId"
            label={t('item.f.category')}
            rules={[{ required: true, message: t('item.f.categoryRequired') }]}
          >
            <Select
              options={categories}
              showSearch
              optionFilterProp="label"
              onChange={() => form.setFieldValue('subCategoryId', undefined)}
            />
          </Field>
          <Field
            name="subCategoryId"
            label={t('item.f.subCategory')}
            extra={!categoryId ? t('item.f.subCategoryHint') : undefined}
          >
            <Select
              options={subOptions}
              allowClear
              disabled={!categoryId}
              placeholder={!categoryId ? t('item.f.subCategoryFirst') : undefined}
            />
          </Field>
          <Field name="brandId" label={t('item.f.brand')} extra={t('item.f.brandHint')}>
            <LookupSelect
              fetchOptions={searchBrands}
              onCreate={async (name) => {
                const brand = await createBrand(name);
                form.setFieldValue('brandId', brand.value);
                void message.success(t('item.f.brandCreated', { name }));
              }}
            />
          </Field>
          <Field
            name="uomId"
            label={t('item.f.uom')}
            rules={[{ required: true, message: t('item.f.uomRequired') }]}
          >
            <Select options={units} />
          </Field>
          <Field
            name="barcode"
            label={t('item.f.barcode')}
            extra={t('item.f.barcodeHint')}
            normalize={(v?: string) => v?.replace(/[^\d ]/g, '')}
            rules={[
              {
                validator: (_, v?: string) =>
                  !v || BARCODE.test(v.replace(/\s/g, ''))
                    ? Promise.resolve()
                    : Promise.reject(new Error(t('item.f.barcodeInvalid'))),
              },
            ]}
          >
            <Input inputMode="numeric" placeholder="8 941100 50024 7" />
          </Field>
        </FieldGrid>
      </DetailSection>

      <DetailSection
        title={t('item.sec.classification')}
        description={t('item.sec.classificationHint')}
      >
        <FieldGrid>
          <Field name="itemType" label={t('item.f.itemType')} rules={[{ required: true }]}>
            <Radio.Group
              options={[
                { value: 'stock', label: t('item.f.typeStock') },
                { value: 'service', label: t('item.f.typeService') },
                { value: 'consumable', label: t('item.f.typeConsumable') },
              ]}
            />
          </Field>
          <Field name="dosageForm" label={t('item.f.dosageForm')}>
            <Segmented
              options={[
                { value: 'solid', label: t('item.f.solid') },
                { value: 'liquid', label: t('item.f.liquid') },
                { value: 'other', label: t('item.f.other') },
              ]}
            />
          </Field>
          <Field name="tags" label={t('item.f.tags')} extra={t('item.f.tagsHint')}>
            <Select
              mode="tags"
              options={tagSuggestions.map((tag) => ({ value: tag, label: tag }))}
              tokenSeparators={[',']}
              maxTagCount="responsive"
            />
          </Field>
          <Field name="countryCode" label={t('item.f.country')}>
            <Select options={countries} showSearch optionFilterProp="label" allowClear />
          </Field>
          <div className="erp-field-span-2">
            <Field name="description" label={t('item.f.description')}>
              <Input.TextArea maxLength={500} showCount autoSize={{ minRows: 2, maxRows: 6 }} />
            </Field>
          </div>
        </FieldGrid>
      </DetailSection>

      <DetailSection title={t('item.sec.options')} description={t('item.sec.optionsHint')}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px' }}>
          {(
            [
              ['trackExpiry', 'item.f.trackExpiry'],
              ['trackBatch', 'item.f.trackBatch'],
              ['prescriptionOnly', 'item.f.prescription'],
              ['allowNegativeStock', 'item.f.negativeStock'],
            ] as const
          ).map(([name, label]) => (
            <Form.Item key={name} name={name} valuePropName="checked" noStyle>
              <Checkbox>{t(label)}</Checkbox>
            </Form.Item>
          ))}
        </div>
      </DetailSection>
    </>
  );
}
