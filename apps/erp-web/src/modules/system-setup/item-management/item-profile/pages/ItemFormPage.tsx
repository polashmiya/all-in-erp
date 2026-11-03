import { CheckOutlined } from '@ant-design/icons';
import { DetailSection, Dropzone, FormPageLayout, PageState } from '@erp/ui';
import { App, Form } from 'antd';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router';
import { selectCurrentUnit, useAuthStore } from '@/common/store/auth-store';
import { itemStatus } from '../components/item-display';
import { GeneralSection } from '../components/form/GeneralSection';
import {
  ATTACHMENT_ACCEPT,
  emptyItemValues,
  ITEM_TAB_FIELDS,
  toFormValues,
} from '../components/form/item-form.model';
import { ItemFormAside } from '../components/form/ItemFormAside';
import { PricingSection } from '../components/form/PricingSection';
import { StockSection } from '../components/form/StockSection';
import { itemPaths } from '../constants';
import { nextItemCode } from '../services/item.mock';
import { useItem, useSaveItem } from '../services/item.service';
import type { ItemDetail, ItemFormValues } from '../types/item.types';

type SubmitMode = 'draft' | 'save' | 'new';

export function ItemFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [params] = useSearchParams();
  const copyId = params.get('copy') ?? undefined;
  const source = useItem(id ?? copyId);
  const loading = !!(id || copyId) && source.isPending;

  return (
    <PageState
      loading={loading}
      missing={!!id && !loading && !source.data}
      missingTitle={t('item.notFound')}
      missingActions={[{ key: 'back', label: t('item.backToList'), to: itemPaths.list }]}
    >
      <ItemForm
        key={id ?? copyId ?? 'new'}
        item={id ? (source.data ?? undefined) : undefined}
        copyFrom={copyId ? (source.data ?? undefined) : undefined}
      />
    </PageState>
  );
}

function ItemForm({ item, copyFrom }: { item?: ItemDetail; copyFrom?: ItemDetail }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const unit = useAuthStore(selectCurrentUnit);
  const actor = useAuthStore((s) => s.user?.fullName ?? '');
  const [form] = Form.useForm<ItemFormValues>();
  const save = useSaveItem();
  const isNew = !item;

  const initialValues = useMemo(
    () =>
      item
        ? toFormValues(item)
        : copyFrom
          ? toFormValues(copyFrom, { copy: true, copyName: (name) => t('item.copyName', { name }) })
          : emptyItemValues(),
    [item, copyFrom, t],
  );

  const submit = async (values: ItemFormValues, mode: string) => {
    const saved = await save.mutateAsync({ id: item?.id, values, draft: mode === 'draft' });
    void message.success(
      t(mode === 'draft' ? 'item.form.draftSaved' : 'item.form.saved', { code: saved.code }),
    );
    if ((mode as SubmitMode) === 'new') {
      form.resetFields();
      form.setFieldsValue(emptyItemValues());
      if (!isNew) navigate(itemPaths.create);
    } else {
      navigate(itemPaths.view(saved.id));
    }
  };

  return (
    <FormPageLayout<ItemFormValues>
      form={form}
      initialValues={initialValues}
      title={isNew ? t('item.form.newTitle') : t('item.form.editTitle')}
      status={isNew ? { tone: 'warning', label: t('item.draft') } : itemStatus(t, item)}
      subTitle={t('item.form.subtitle', { unit: unit?.name ?? '' })}
      backTo={item ? itemPaths.view(item.id) : itemPaths.list}
      crumbs={[isNew ? t('item.form.newTitle') : item.code]}
      cancelTo={item ? itemPaths.view(item.id) : itemPaths.list}
      saving={save.isPending}
      onSubmit={submit}
      submitActions={[
        {
          key: 'draft',
          label: t('item.form.saveDraft'),
          validate: ['name'],
          placement: ['header'],
          hidden: !(isNew || item?.isDraft),
        },
        { key: 'new', label: t('item.form.saveNew'), placement: ['footer'] },
        { key: 'save', label: t('item.form.save'), icon: <CheckOutlined />, variant: 'primary' },
      ]}
      tabs={[
        {
          key: 'general',
          label: t('item.tab.general'),
          fields: ITEM_TAB_FIELDS.general,
          content: <GeneralSection code={item?.code ?? nextItemCode()} />,
        },
        {
          key: 'pricing',
          label: t('item.tab.pricing'),
          fields: ITEM_TAB_FIELDS.pricing,
          content: <PricingSection />,
        },
        {
          key: 'stock',
          label: t('item.tab.stock'),
          fields: ITEM_TAB_FIELDS.stock,
          content: <StockSection isNew={isNew} />,
        },
        {
          key: 'attachments',
          label: t('item.tab.attachments'),
          fields: ITEM_TAB_FIELDS.attachments,
          content: (
            <DetailSection
              title={t('item.sec.attachments')}
              description={t('item.sec.attachmentsHint')}
            >
              <Form.Item name="attachments" valuePropName="value" noStyle>
                <Dropzone accept={ATTACHMENT_ACCEPT} hint={t('item.f.attachHint')} />
              </Form.Item>
            </DetailSection>
          ),
        },
      ]}
      aside={<ItemFormAside item={item} businessUnit={unit?.name ?? '—'} actor={actor} />}
    />
  );
}
