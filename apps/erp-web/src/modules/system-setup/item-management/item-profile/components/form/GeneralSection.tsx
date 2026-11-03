import { LockOutlined } from '@ant-design/icons';
import { CheckboxList, DetailSection, Field, FieldSection, LookupSelect } from '@erp/ui';
import { App, Form, Input, Radio, Segmented, Select } from 'antd';
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
import { BARCODE_PATTERN, ITEM_LIMITS } from './item-form.model';

export function GeneralSection({ code }: { code: string }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const form = Form.useFormInstance<ItemFormValues>();
  const categoryId = Form.useWatch('categoryId', form);
  const subOptions = categoryId ? (subCategories[categoryId] ?? []) : [];

  return (
    <>
      <FieldSection title={t('item.sec.basic')} description={t('item.sec.basicHint')}>
        <Field label={t('item.f.code')} extra={t('item.f.codeHint')}>
          <Input
            value={code}
            readOnly
            variant="filled"
            suffix={<LockOutlined />}
            aria-label={t('item.f.code')}
          />
        </Field>
        <Field
          name="name"
          label={t('item.f.name')}
          rules={[{ required: true, whitespace: true, message: t('item.f.nameRequired') }]}
        >
          <Input placeholder={t('item.f.namePlaceholder')} maxLength={ITEM_LIMITS.name} />
        </Field>
        <Field
          name="genericName"
          label={t('item.f.genericName')}
          custom
          extra={t('item.f.genericHint')}
        >
          <Input maxLength={ITEM_LIMITS.name} />
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
                !v || BARCODE_PATTERN.test(v.replace(/\s/g, ''))
                  ? Promise.resolve()
                  : Promise.reject(new Error(t('item.f.barcodeInvalid'))),
            },
          ]}
        >
          <Input inputMode="numeric" placeholder={t('item.f.barcodePlaceholder')} />
        </Field>
      </FieldSection>

      <FieldSection
        title={t('item.sec.classification')}
        description={t('item.sec.classificationHint')}
      >
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
            <Input.TextArea
              maxLength={ITEM_LIMITS.description}
              showCount
              autoSize={{ minRows: 2, maxRows: 6 }}
            />
          </Field>
        </div>
      </FieldSection>

      <DetailSection title={t('item.sec.options')} description={t('item.sec.optionsHint')}>
        <CheckboxList
          options={[
            { name: 'trackExpiry', label: t('item.f.trackExpiry') },
            { name: 'trackBatch', label: t('item.f.trackBatch') },
            { name: 'prescriptionOnly', label: t('item.f.prescription') },
            { name: 'allowNegativeStock', label: t('item.f.negativeStock') },
          ]}
        />
      </DetailSection>
    </>
  );
}
