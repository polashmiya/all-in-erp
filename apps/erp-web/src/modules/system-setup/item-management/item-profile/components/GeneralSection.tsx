import type { ItemDetail } from '@erp/api-client';
import { Field, FieldSection, YesNoSwitch } from '@erp/ui';
import { Form, Input, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { childSelectOptions, parentOf, selectOptions } from '../../common/master-data';
import { ITEM_LIMITS, type ItemFormValues } from '../item-form';
import '../item-form.css';
import type { ItemLookups } from '../item-lookups';
import { ImageAttach } from './ImageAttach';
import { MasterItemSelect } from './MasterItemSelect';

export function GeneralSection({
  source,
  itemId,
  lookups,
}: {
  source?: ItemDetail;
  itemId?: number;
  lookups: ItemLookups;
}) {
  const { t } = useTranslation();
  const form = Form.useFormInstance<ItemFormValues>();
  const departmentId = Form.useWatch('departmentId', form);
  const categoryId = Form.useWatch('categoryId', form);
  const subCategoryId = Form.useWatch('subCategoryId', form);
  const isAutoBarcode = Form.useWatch('isAutoBarcode', form);
  const isChildBarcode = Form.useWatch('isChildBarcode', form);
  const { departments, categories, subCategories, minorCategories } = lookups;
  const maxLength = (count: number) => ({
    max: count,
    message: t('master.f.maxLength', { count }),
  });

  const inDepartment = categories?.filter(
    (c) => departmentId == null || c.parentId === departmentId,
  );
  const inCategory = subCategories?.filter((s) =>
    categoryId != null ? s.parentId === categoryId : inDepartment?.some((c) => c.id === s.parentId),
  );

  const fillParents = (subCategory?: number) => {
    const category = parentOf(subCategories, subCategory);
    form.setFieldsValue({
      subCategoryId: subCategory,
      categoryId: category,
      departmentId: parentOf(categories, category),
    });
  };

  return (
    <>
      <FieldSection title={t('item.sec.basic')} columns={4}>
        <Field
          name="name"
          label={t('item.f.name')}
          rules={[
            { required: true, whitespace: true, message: t('item.f.nameRequired') },
            maxLength(ITEM_LIMITS.name),
          ]}
        >
          <Input maxLength={ITEM_LIMITS.name} placeholder={t('item.f.namePlaceholder')} />
        </Field>
        <Field
          name="itemTypeId"
          label={t('item.f.itemType')}
          rules={[{ required: true, message: t('item.f.itemTypeRequired') }]}
        >
          <Select<number> options={selectOptions(lookups.itemTypes)} />
        </Field>
        <Field
          name="hsCode"
          label={t('item.f.hsCode')}
          rules={[
            { required: true, whitespace: true, message: t('item.f.hsCodeRequired') },
            maxLength(ITEM_LIMITS.hsCode),
          ]}
        >
          <Input maxLength={ITEM_LIMITS.hsCode} placeholder={t('item.f.hsCodePlaceholder')} />
        </Field>
        <Field
          name="code"
          label={t('item.f.code')}
          tooltip={t('item.f.codeHint')}
          rules={[maxLength(ITEM_LIMITS.code)]}
        >
          <Input maxLength={ITEM_LIMITS.code} placeholder={t('item.f.codeAuto')} />
        </Field>
        <Field name="description" label={t('item.f.description')} className="erp-item-span-3">
          <Input.TextArea
            maxLength={ITEM_LIMITS.description}
            autoSize={{ minRows: 1, maxRows: 4 }}
          />
        </Field>
        <Field name="imageSource" label={t('item.side.image')} tooltip={t('master.f.imageHint')}>
          <ImageAttach />
        </Field>
      </FieldSection>

      <FieldSection title={t('item.sec.classification')} columns={4}>
        <Field name="departmentId" label={t('item.f.department')}>
          <Select<number>
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={t('item.f.anyDepartment')}
            options={selectOptions(departments, source?.departmentId)}
            onChange={() =>
              form.setFieldsValue({
                categoryId: undefined,
                subCategoryId: undefined,
                minorCategoryId: undefined,
              })
            }
          />
        </Field>
        <Field name="categoryId" label={t('item.f.category')}>
          <Select<number>
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={t('item.f.anyCategory')}
            options={childSelectOptions(categories, departments, departmentId, source?.categoryId)}
            onChange={(next) =>
              form.setFieldsValue({
                departmentId: next == null ? departmentId : parentOf(categories, next),
                subCategoryId: undefined,
                minorCategoryId: undefined,
              })
            }
          />
        </Field>
        <Field name="subCategoryId" label={t('item.f.subCategory')}>
          <Select<number>
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder={t('item.f.anySubCategory')}
            options={childSelectOptions(
              subCategories,
              inDepartment,
              categoryId,
              source?.subCategoryId,
            )}
            onChange={(next) => {
              if (next != null) fillParents(next);
              form.setFieldValue('minorCategoryId', undefined);
            }}
          />
        </Field>
        <Field
          name="minorCategoryId"
          label={t('item.f.minorCategory')}
          tooltip={t('item.sec.classificationHint')}
          rules={[{ required: true, message: t('item.f.minorCategoryRequired') }]}
        >
          <Select<number>
            showSearch
            optionFilterProp="label"
            placeholder={t('item.f.minorCategoryPlaceholder')}
            options={childSelectOptions(
              minorCategories,
              inCategory,
              subCategoryId,
              source?.minorCategoryId,
            )}
            onChange={(next) => fillParents(parentOf(minorCategories, next))}
          />
        </Field>
      </FieldSection>

      <FieldSection title={t('item.sec.barcode')} columns={4}>
        <Field
          name="isAutoBarcode"
          label={t('item.f.autoBarcode')}
          tooltip={t('item.f.autoBarcodeHint')}
          valuePropName="checked"
        >
          <YesNoSwitch />
        </Field>
        <Field
          name="barCode"
          label={t('item.f.barcode')}
          dependencies={['isAutoBarcode']}
          rules={[
            { required: !isAutoBarcode, whitespace: true, message: t('item.f.barcodeRequired') },
            maxLength(ITEM_LIMITS.barCode),
          ]}
        >
          <Input
            maxLength={ITEM_LIMITS.barCode}
            disabled={isAutoBarcode}
            placeholder={isAutoBarcode ? t('item.f.barcodeAuto') : undefined}
          />
        </Field>
        <Field
          name="isChildBarcode"
          label={t('item.f.childBarcode')}
          tooltip={t('item.f.childBarcodeHint')}
          valuePropName="checked"
        >
          <YesNoSwitch />
        </Field>
        {isChildBarcode && (
          <Field
            name="masterItemId"
            label={t('item.f.masterItem')}
            rules={[{ required: true, message: t('item.f.masterItemRequired') }]}
          >
            <MasterItemSelect source={source} excludeId={itemId} />
          </Field>
        )}
      </FieldSection>
    </>
  );
}
