import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';
import { App, FloatButton, Form, Tabs, type FormInstance } from 'antd';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { ActionItem, ActionVariant } from '../../components/actions/types';
import { useHotkey } from '../../hooks/useHotkey';
import { useGoBack } from '../../hooks/useGoBack';
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

const SECTION_OFFSET = 24;

const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const;

function scrollParentOf(element: HTMLElement | null): HTMLElement {
  for (let node = element?.parentElement; node; node = node.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(node).overflowY)) return node;
  }
  return document.documentElement;
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
  const [active, setActive] = useState(tabs?.[0]?.key);
  const [atBottom, setAtBottom] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [errors, setErrors] = useState<Record<string, number>>({});
  const dirtyRef = useRef(false);
  const navRef = useRef<HTMLDivElement>(null);
  const sections = useRef<Record<string, HTMLElement | null>>({});
  const clickedTab = useRef<string | null>(null);
  const errorTotal = Object.values(errors).reduce((sum, n) => sum + n, 0);
  const tabKeys = tabs?.map((tb) => tb.key).join(',') ?? '';

  const goBack = useGoBack(cancelTo ?? '/');

  useUnsavedGuard(guard ? () => dirtyRef.current : false, guard && dirty);

  useEffect(() => {
    const keys = tabKeys.split(',').filter(Boolean);
    if (!keys.length) return;
    const scroller = scrollParentOf(navRef.current);

    const update = () => {
      const scrollable = scroller.scrollHeight > scroller.clientHeight + 1;
      const bottom =
        scrollable && scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
      const line = (navRef.current?.getBoundingClientRect().bottom ?? 0) + SECTION_OFFSET;
      const passed = keys.filter(
        (key) => (sections.current[key]?.getBoundingClientRect().top ?? Infinity) <= line,
      );
      setAtBottom(bottom);
      setActive(clickedTab.current ?? (bottom ? keys.at(-1) : (passed.at(-1) ?? keys[0])));
    };
    const release = () => {
      clickedTab.current = null;
    };

    update();
    scroller.addEventListener('scroll', update, { passive: true });
    for (const type of USER_SCROLL_EVENTS)
      scroller.addEventListener(type, release, { passive: true });
    return () => {
      scroller.removeEventListener('scroll', update);
      for (const type of USER_SCROLL_EVENTS) scroller.removeEventListener(type, release);
    };
  }, [tabKeys]);

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
  };

  const revealErrors = () => {
    countErrors();
    const first = form.getFieldsError().find((field) => field.errors.length);
    if (first) form.scrollToField(first.name, { block: 'center', behavior: 'smooth' });
  };

  const goTo = (key: string) => {
    clickedTab.current = key;
    setActive(key);
    sections.current[key]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const scrollToEdge = () => {
    const scroller = scrollParentOf(navRef.current);
    scroller.scrollTo({ top: atBottom ? 0 : scroller.scrollHeight, behavior: 'smooth' });
  };

  const submit = async (action: FormSubmitAction) => {
    try {
      if (action.validate === undefined || action.validate === 'all') await form.validateFields();
      else await form.validateFields(action.validate);
    } catch {
      revealErrors();
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
      revealErrors();
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
      ? [{ key: 'cancel', label: t('common.cancel'), variant: 'text' as const, onClick: goBack }]
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

  const edgeLabel = atBottom ? t('common.goTop') : t('common.goBottom');

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
      >
        <SplitLayout
          aside={aside}
          main={
            <section className="erp-card erp-form-card">
              {tabs ? (
                <>
                  <div ref={navRef} className="erp-form-nav">
                    <Tabs
                      className="erp-card-tabs"
                      activeKey={active}
                      onChange={goTo}
                      items={tabs.map((tb) => ({ key: tb.key, label: tabLabel(tb) }))}
                    />
                  </div>
                  <FloatButton
                    className="erp-scroll-edge"
                    tooltip={edgeLabel}
                    aria-label={edgeLabel}
                    icon={atBottom ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    onClick={scrollToEdge}
                  />
                  {tabs.map((tb) => (
                    <div
                      key={tb.key}
                      ref={(element) => {
                        sections.current[tb.key] = element;
                      }}
                      className="erp-form-section"
                    >
                      {tb.content}
                    </div>
                  ))}
                </>
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
