import { App, Form, Tabs, type FormInstance } from 'antd';
import { useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActionItem, ActionVariant } from '../../components/actions/types';
import { useHotkey } from '../../hooks/useHotkey';
import { useUnsavedGuard } from '../../hooks/useUnsavedGuard';
import { ActionBar, PageContainer, type PageStatus } from '../page/PageContainer';
import { SplitLayout } from '../page/CardGrid';

export interface FormTab {
  key: string;
  label: ReactNode;
  fields?: string[];
  content: ReactNode;
}

export interface FormSubmitAction {
  key: string;
  label: string;
  icon?: ReactNode;
  variant?: ActionVariant;
  validate?: 'all' | string[];
  placement?: ('header' | 'footer')[];
  hidden?: boolean;
}

export interface FormPageLayoutProps<T> {
  form: FormInstance<T>;
  initialValues?: Partial<T>;
  title: ReactNode;
  subTitle?: ReactNode;
  status?: PageStatus;
  backTo?: string;
  crumbs?: string[];
  tabs?: FormTab[];
  children?: ReactNode;
  aside?: ReactNode;
  submitActions: FormSubmitAction[];
  cancelTo?: string;
  saving?: boolean;
  guard?: boolean;
  onSubmit: (values: T, actionKey: string) => Promise<unknown>;
}

export function FormPageLayout<T extends object>({
  form,
  initialValues,
  title,
  subTitle,
  status,
  backTo,
  crumbs,
  tabs,
  children,
  aside,
  submitActions,
  cancelTo,
  saving,
  guard = true,
  onSubmit,
}: FormPageLayoutProps<T>) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [tab, setTab] = useState(tabs?.[0]?.key);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, number>>({});
  const dirtyRef = useRef(false);
  const errorTotal = Object.values(errors).reduce((sum, n) => sum + n, 0);

  useUnsavedGuard(guard ? () => dirtyRef.current : false, guard && dirty);

  const markDirty = (value: boolean) => {
    dirtyRef.current = value;
    setDirty(value);
  };

  const tabOf = (name: (string | number)[]) =>
    tabs?.find((tb) => tb.fields?.includes(String(name[0])))?.key ?? tabs?.[0]?.key ?? 'main';

  const countErrors = () => {
    const counts: Record<string, number> = {};
    for (const field of form.getFieldsError()) {
      if (field.errors.length) {
        const key = tabOf(field.name);
        counts[key] = (counts[key] ?? 0) + 1;
      }
    }
    setErrors(counts);
    return counts;
  };

  const submit = async (action: FormSubmitAction) => {
    try {
      if (action.validate === undefined || action.validate === 'all') await form.validateFields();
      else await form.validateFields(action.validate);
    } catch {
      const counts = countErrors();
      const first = tabs?.find((tb) => counts[tb.key]);
      if (first) setTab(first.key);
      void message.error(t('common.formInvalid'));
      return;
    }
    const values = form.getFieldsValue(true) as T;
    dirtyRef.current = false;
    try {
      await onSubmit(values, action.key);
      setErrors({});
      setDirty(false);
    } catch {
      dirtyRef.current = dirty;
    }
  };

  const saveAction =
    submitActions.find((a) => a.variant === 'primary' && !a.hidden) ??
    submitActions.find((a) => !a.hidden);

  useHotkey('s', () => saveAction && void submit(saveAction), { mod: true, enabled: !saving });

  const toAction = (action: FormSubmitAction): ActionItem => ({
    key: action.key,
    label: action.label,
    icon: action.icon,
    variant: action.variant ?? 'default',
    loading: saving,
    hidden: action.hidden,
    onClick: () => submit(action),
  });

  const headerActions = submitActions
    .filter((a) => a.placement?.includes('header') ?? true)
    .map(toAction);
  const footerActions: ActionItem[] = [
    ...(cancelTo
      ? [{ key: 'cancel', label: t('common.cancel'), variant: 'text' as const, to: cancelTo }]
      : []),
    ...submitActions.filter((a) => a.placement?.includes('footer') ?? true).map(toAction),
  ];

  const statusText = errorTotal
    ? [dirty ? t('common.unsaved') : null, t('common.needsAttention', { count: errorTotal })]
        .filter(Boolean)
        .join(' · ')
    : dirty
      ? t('common.unsaved')
      : t('common.noChanges');

  const tone = errorTotal ? 'warning' : dirty ? 'warning' : 'success';

  const tabLabel = (tb: FormTab) => (
    <span>
      {tb.label}
      {!!errors[tb.key] && <span className="erp-tab-err">{errors[tb.key]}</span>}
    </span>
  );

  return (
    <PageContainer
      title={title}
      subTitle={subTitle}
      status={status}
      backTo={backTo}
      crumbs={crumbs}
      actions={headerActions}
    >
      <Form<T>
        form={form}
        layout="vertical"
        className="erp-form"
        initialValues={initialValues}
        onValuesChange={() => markDirty(true)}
        onFieldsChange={() => errorTotal > 0 && countErrors()}
        scrollToFirstError={{ block: 'center' }}
      >
        <SplitLayout
          aside={aside}
          main={
            <section className="erp-card erp-form-card">
              {tabs ? (
                <Tabs
                  className="erp-card-tabs"
                  activeKey={tab}
                  onChange={setTab}
                  items={tabs.map((tb) => ({
                    key: tb.key,
                    label: tabLabel(tb),
                    forceRender: true,
                    children: tb.content,
                  }))}
                />
              ) : (
                children
              )}
              <ActionBar
                status={
                  <span className={`erp-status-dot erp-status-dot--${tone}`}>{statusText}</span>
                }
                actions={footerActions}
              />
            </section>
          }
        />
      </Form>
    </PageContainer>
  );
}
