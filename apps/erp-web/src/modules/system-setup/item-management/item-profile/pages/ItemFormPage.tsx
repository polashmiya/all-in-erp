import { CheckOutlined } from '@ant-design/icons';
import { ActionBar, DetailSection, Dropzone, EmptyState, PageContainer } from '@erp/ui';
import { App, Button, Form, Skeleton, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useBlocker, useNavigate, useParams, useSearchParams } from 'react-router';
import { selectCurrentUnit, useAuthStore } from '@/common/store/auth-store';
import { ItemStatusTag } from '../components/ItemBits';
import { GeneralSection } from '../components/form/GeneralSection';
import {
  emptyItemValues,
  ITEM_FORM_TABS,
  tabOfField,
  toFormValues,
  type ItemFormTab,
} from '../components/form/item-form.model';
import { ItemFormAside } from '../components/form/ItemFormAside';
import { PricingSection } from '../components/form/PricingSection';
import { StockSection } from '../components/form/StockSection';
import { itemPaths } from '../constants';
import { nextItemCode } from '../services/item.mock';
import { useItem, useSaveItem } from '../services/item.service';
import type { ItemDetail, ItemFormValues } from '../types/item.types';

type SubmitMode = 'save' | 'draft' | 'new';

export function ItemFormPage() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const copyId = params.get('copy') ?? undefined;
  const source = useItem(id ?? copyId);

  if (source.isPending && (id || copyId)) {
    return (
      <PageContainer title={false}>
        <Skeleton active paragraph={{ rows: 12 }} />
      </PageContainer>
    );
  }

  if (id && !source.data) return <ItemMissing />;

  return (
    <ItemForm
      key={id ?? copyId ?? 'new'}
      item={id ? (source.data ?? undefined) : undefined}
      copyFrom={copyId ? (source.data ?? undefined) : undefined}
    />
  );
}

function ItemMissing() {
  const { t } = useTranslation();
  return (
    <PageContainer title={false}>
      <section className="erp-card">
        <EmptyState
          title={t('item.notFound')}
          actions={
            <Link to={itemPaths.list}>
              <Button>{t('item.backToList')}</Button>
            </Link>
          }
        />
      </section>
    </PageContainer>
  );
}

function ItemForm({ item, copyFrom }: { item?: ItemDetail; copyFrom?: ItemDetail }) {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const unit = useAuthStore(selectCurrentUnit);
  const actor = useAuthStore((s) => s.user?.fullName ?? '');
  const [form] = Form.useForm<ItemFormValues>();
  const save = useSaveItem();
  const [tab, setTab] = useState<ItemFormTab>('general');
  const [errorCounts, setErrorCounts] = useState<Partial<Record<ItemFormTab, number>>>({});
  const [dirty, setDirty] = useState(false);
  const isNew = !item;

  const initialValues = useMemo(
    () =>
      item
        ? toFormValues(item)
        : copyFrom
          ? toFormValues(copyFrom, { copy: true })
          : emptyItemValues(),
    [item, copyFrom],
  );
  const code = item?.code ?? nextItemCode();
  const errorTotal = Object.values(errorCounts).reduce((sum, n) => sum + (n ?? 0), 0);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirty && !save.isPending && currentLocation.pathname !== nextLocation.pathname,
  );
  useEffect(() => {
    if (blocker.state !== 'blocked') return;
    modal.confirm({
      title: t('item.form.leaveConfirm'),
      okText: t('item.form.discard'),
      okButtonProps: { danger: true },
      cancelText: t('item.cancel'),
      onOk: () => blocker.proceed(),
      onCancel: () => blocker.reset(),
    });
  }, [blocker, modal, t]);

  const countErrors = () => {
    const counts: Partial<Record<ItemFormTab, number>> = {};
    for (const field of form.getFieldsError()) {
      if (field.errors.length) {
        const key = tabOfField(field.name);
        counts[key] = (counts[key] ?? 0) + 1;
      }
    }
    setErrorCounts(counts);
    return counts;
  };

  const submit = async (mode: SubmitMode) => {
    let values: ItemFormValues;
    try {
      values =
        mode === 'draft'
          ? (await form.validateFields(['name']), form.getFieldsValue(true))
          : await form.validateFields();
    } catch {
      const counts = countErrors();
      const first = ITEM_FORM_TABS.find((key) => counts[key]);
      if (first) setTab(first);
      void message.error(t('item.form.invalid'));
      return;
    }

    const saved = await save.mutateAsync({
      id: item?.id,
      values: { ...form.getFieldsValue(true), ...values },
      draft: mode === 'draft',
    });
    setDirty(false);
    setErrorCounts({});
    void message.success(
      mode === 'draft'
        ? t('item.form.draftSaved', { code: saved.code })
        : t('item.form.saved', { code: saved.code }),
    );

    if (mode === 'new') {
      form.resetFields();
      form.setFieldsValue(emptyItemValues());
      setTab('general');
      if (!isNew) setTimeout(() => navigate(itemPaths.create), 0);
    } else {
      setTimeout(() => navigate(itemPaths.view(saved.id)), 0);
    }
  };

  const tabLabel = (key: ItemFormTab) => (
    <span>
      {t(`item.tab.${key}`)}
      {!!errorCounts[key] && <span className="erp-tab-err">{errorCounts[key]}</span>}
    </span>
  );

  const status = errorTotal
    ? [dirty ? t('item.form.unsaved') : null, t('item.form.needsAttention', { count: errorTotal })]
        .filter(Boolean)
        .join(' · ')
    : dirty
      ? t('item.form.unsaved')
      : t('item.form.noChanges');

  return (
    <PageContainer
      title={isNew ? t('item.form.newTitle') : t('item.form.editTitle')}
      tags={
        isNew || item?.isDraft ? (
          <ItemStatusTag active draft />
        ) : (
          <ItemStatusTag active={!!item?.isActive} />
        )
      }
      subTitle={t('item.form.subtitle', { unit: unit?.name ?? '' })}
      backTo={item ? itemPaths.view(item.id) : itemPaths.list}
      crumbs={[isNew ? t('item.form.newTitle') : item.code]}
      extra={
        <>
          {(isNew || item?.isDraft) && (
            <Button onClick={() => void submit('draft')} loading={save.isPending}>
              {t('item.form.saveDraft')}
            </Button>
          )}
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => void submit('save')}
            loading={save.isPending}
          >
            {t('item.form.save')}
          </Button>
        </>
      }
    >
      <Form<ItemFormValues>
        form={form}
        layout="vertical"
        className="erp-form"
        initialValues={initialValues}
        onValuesChange={() => setDirty(true)}
        onFieldsChange={() => errorTotal && countErrors()}
        scrollToFirstError={{ block: 'center' }}
      >
        <div className="erp-split">
          <section className="erp-card erp-split__main">
            <Tabs
              className="erp-card-tabs"
              aria-label={t('item.form.sections')}
              activeKey={tab}
              onChange={(key) => setTab(key as ItemFormTab)}
              items={[
                {
                  key: 'general',
                  label: tabLabel('general'),
                  forceRender: true,
                  children: <GeneralSection code={code} />,
                },
                {
                  key: 'pricing',
                  label: tabLabel('pricing'),
                  forceRender: true,
                  children: <PricingSection />,
                },
                {
                  key: 'stock',
                  label: tabLabel('stock'),
                  forceRender: true,
                  children: <StockSection isNew={isNew} />,
                },
                {
                  key: 'attachments',
                  label: tabLabel('attachments'),
                  forceRender: true,
                  children: (
                    <DetailSection
                      title={t('item.sec.attachments')}
                      description={t('item.sec.attachmentsHint')}
                    >
                      <Form.Item name="attachments" valuePropName="value" noStyle>
                        <Dropzone accept=".pdf,.jpg,.jpeg,.png" hint={t('item.f.attachHint')} />
                      </Form.Item>
                    </DetailSection>
                  ),
                },
              ]}
            />
            <ActionBar
              status={
                <span
                  className="erp-dotted"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    ['--dot' as string]: errorTotal ? '#F59E0B' : dirty ? '#F59E0B' : '#22C55E',
                  }}
                >
                  {status}
                </span>
              }
            >
              <Link to={item ? itemPaths.view(item.id) : itemPaths.list}>
                <Button type="text">{t('item.cancel')}</Button>
              </Link>
              <Button onClick={() => void submit('new')} loading={save.isPending}>
                {t('item.form.saveNew')}
              </Button>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => void submit('save')}
                loading={save.isPending}
              >
                {t('item.form.save')}
              </Button>
            </ActionBar>
          </section>
          <ItemFormAside item={item} businessUnit={unit?.name ?? '—'} actor={actor} />
        </div>
      </Form>
    </PageContainer>
  );
}
