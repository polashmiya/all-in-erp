import {
  ApartmentOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  BankOutlined,
  CheckOutlined,
  InboxOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { ApiError, useSetupAccount, type AccountSetupResult } from '@erp/api-client';
import { ShellPage } from '@erp/ui';
import { App, Button, Card, Col, Flex, Form, Row, Steps, Typography, theme } from 'antd';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBlocker, useNavigate } from 'react-router';
import { SetupSuccess } from './SetupSuccess';
import { SetupSummary } from './SetupSummary';
import {
  initialValues,
  STEP_KEYS,
  stepOfField,
  suggestCode,
  toFieldPath,
  toSetupRequest,
  type FieldPath,
  type SetupFormValues,
} from './setup-model';
import { AccountStep } from './steps/AccountStep';
import { BusinessUnitsStep } from './steps/BusinessUnitsStep';
import { MenuAccessStep } from './steps/MenuAccessStep';
import { OfficesStep } from './steps/OfficesStep';
import { ReviewStep } from './steps/ReviewStep';
import { WarehousesStep } from './steps/WarehousesStep';

const LAST_STEP = STEP_KEYS.length - 1;

interface ServerFieldError {
  name: FieldPath;
  errors: string[];
}

/**
 * New Account Setup: one page, five steps, one form. Nothing is saved until "Create account", which sends the
 * whole tree in a single request (and a single database transaction).
 */
export function AccountSetupPage() {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { message, modal } = App.useApp();
  const navigate = useNavigate();
  const [form] = Form.useForm<SetupFormValues>();
  const values = Form.useWatch([], { form, preserve: true }) as SetupFormValues | undefined;
  const setup = useSetupAccount();

  const [step, setStep] = useState(0);
  const [reached, setReached] = useState(0);
  const [activeUnit, setActiveUnit] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [result, setResult] = useState<AccountSetupResult>();
  const codeEdited = useRef(false);
  const pendingErrors = useRef<ServerFieldError[]>([]);
  const confirmingLeave = useRef(false);

  // Server error paths are dynamic (list indexes), so they bypass the typed name paths.
  const showErrors = useCallback(
    (fields: ServerFieldError[]) => form.setFields(fields as Parameters<typeof form.setFields>[0]),
    [form],
  );

  // ---- leaving with unsaved entries ----
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => dirty && !result && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state !== 'blocked' || confirmingLeave.current) return;
    confirmingLeave.current = true;
    modal.confirm({
      title: t('setup.leaveTitle'),
      content: t('setup.leaveText'),
      okText: t('setup.leaveOk'),
      okButtonProps: { danger: true },
      cancelText: t('setup.stay'),
      onOk: () => blocker.proceed(),
      onCancel: () => blocker.reset(),
      afterClose: () => (confirmingLeave.current = false),
    });
  }, [blocker, modal, t]);

  useEffect(() => {
    if (!dirty || result) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, result]);

  // ---- step changes ----
  useEffect(() => {
    // Server errors for fields of this step (fields only exist while their step is shown).
    const forStep = pendingErrors.current.filter((e) => stepOfField(e.name) === step);
    if (forStep.length) {
      showErrors(forStep);
      pendingErrors.current = pendingErrors.current.filter((e) => !forStep.includes(e));
    }

    // Default the admin from the account the first time the review step opens.
    if (step === LAST_STEP) {
      const all = form.getFieldsValue(true) as SetupFormValues;
      if (!all.admin?.email && all.account?.email) form.setFieldValue(['admin', 'email'], all.account.email.trim().toLowerCase());
      if (!all.admin?.fullName && all.account?.name) {
        form.setFieldValue(['admin', 'fullName'], t('setup.defaultAdminName', { account: all.account.name.trim() }));
      }
    }
  }, [step, form, t, showErrors]);

  const validateCurrentStep = async () => {
    try {
      await form.validateFields(); // only the current step's fields are mounted
      return true;
    } catch (error) {
      const first = (error as { errorFields?: { name: FieldPath }[] }).errorFields?.[0]?.name;
      if (first?.[0] === 'businessUnits' && typeof first[1] === 'number' && (step === 2 || step === 3)) setActiveUnit(first[1]);
      void message.error(t('setup.fixErrors'));
      return false;
    }
  };

  const goTo = async (target: number) => {
    if (target === step) return;
    if (target > step && !(await validateCurrentStep())) return;
    setStep(target);
    setReached((r) => Math.max(r, target));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = async () => {
    if (!(await validateCurrentStep())) return;

    try {
      const created = await setup.mutateAsync({ data: toSetupRequest(form.getFieldsValue(true) as SetupFormValues) });
      setDirty(false);
      setResult(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      if (error instanceof ApiError && error.status === 400 && Object.keys(error.fieldErrors).length) {
        const fields = Object.entries(error.fieldErrors).map(([key, errors]) => ({ name: toFieldPath(key), errors }));
        const firstStep = Math.min(...fields.map((f) => stepOfField(f.name)));
        const first = fields.find((f) => stepOfField(f.name) === firstStep)!;
        if (first.name[0] === 'businessUnits' && typeof first.name[1] === 'number') setActiveUnit(first.name[1]);

        if (firstStep === step) showErrors(fields.filter((f) => stepOfField(f.name) === step));
        pendingErrors.current = fields.filter((f) => stepOfField(f.name) !== step);
        setStep(firstStep);
        void message.error(t('setup.fixErrors'));
      } else if (error instanceof ApiError && error.status === 409) {
        void message.error(error.problem?.detail ?? t('setup.saveFailed'));
      } else {
        void message.error(t('setup.saveFailed'));
      }
    }
  };

  const onValuesChange = (changed: SetupFormValues) => {
    setDirty(true);
    const account = changed.account;
    if (!account) return;
    // The account code follows the name until the user types a code of their own.
    if ('code' in account) codeEdited.current = !!account.code;
    if ('name' in account && !codeEdited.current) form.setFieldValue(['account', 'code'], suggestCode(account.name));
  };

  const startAnother = () => {
    form.resetFields();
    codeEdited.current = false;
    pendingErrors.current = [];
    setResult(undefined);
    setDirty(false);
    setStep(0);
    setReached(0);
    setActiveUnit(0);
  };

  const crumbs = [t('setup.title')];

  if (result) {
    return (
      <ShellPage title={t('setup.title')} crumbs={crumbs}>
        <SetupSuccess result={result} onDone={() => navigate('/accounts')} onAnother={startAnother} />
      </ShellPage>
    );
  }

  const stepItems = [
    { icon: <BankOutlined />, title: t('setup.step.account'), description: t('setup.step.accountDesc') },
    { icon: <ApartmentOutlined />, title: t('setup.step.units'), description: t('setup.step.unitsDesc') },
    { icon: <ShopOutlined />, title: t('setup.step.offices'), description: t('setup.step.optional') },
    { icon: <InboxOutlined />, title: t('setup.step.warehouses'), description: t('setup.step.optional') },
    { icon: <AppstoreOutlined />, title: t('setup.step.menus'), description: t('setup.step.menusDesc') },
    { icon: <SafetyCertificateOutlined />, title: t('setup.step.review'), description: t('setup.step.reviewDesc') },
  ].map((item, index) => ({ ...item, disabled: index > reached }));

  return (
    <ShellPage
      title={t('setup.title')}
      subTitle={t('setup.subtitle')}
      crumbs={crumbs}
      extra={<Button onClick={() => navigate('/accounts')}>{t('setup.cancel')}</Button>}
    >
      <Row gutter={[16, 16]} align="top">
        <Col xs={24} xl={17}>
          <Card styles={{ body: { padding: 0 } }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${token.colorSplit}` }}>
              <Steps current={step} items={stepItems} onChange={(target) => void goTo(target)} size="small" labelPlacement="vertical" />
            </div>

            <div style={{ padding: 24 }}>
              <Form
                form={form}
                layout="vertical"
                initialValues={initialValues}
                onValuesChange={onValuesChange}
                onFinish={() => void (step === LAST_STEP ? submit() : goTo(step + 1))}
                scrollToFirstError={{ block: 'center', behavior: 'smooth' }}
              >
                {step === 0 && <AccountStep />}
                {step === 1 && <BusinessUnitsStep />}
                {step === 2 && <OfficesStep activeUnit={activeUnit} onUnitChange={setActiveUnit} />}
                {step === 3 && <WarehousesStep activeUnit={activeUnit} onUnitChange={setActiveUnit} />}
                {step === 4 && <MenuAccessStep />}
                {step === 5 && <ReviewStep onEdit={(target) => void goTo(target)} />}
              </Form>
            </div>

            <Flex
              justify="space-between"
              align="center"
              gap={12}
              style={{
                position: 'sticky',
                bottom: 0,
                zIndex: 2,
                padding: '14px 24px',
                borderTop: `1px solid ${token.colorSplit}`,
                background: token.colorBgContainer,
                borderEndStartRadius: token.borderRadiusLG,
                borderEndEndRadius: token.borderRadiusLG,
              }}
            >
              <Button icon={<ArrowLeftOutlined />} disabled={step === 0} onClick={() => void goTo(step - 1)}>
                {t('setup.back')}
              </Button>
              <Typography.Text type="secondary">{t('setup.stepOf', { current: step + 1, total: STEP_KEYS.length })}</Typography.Text>
              {step < LAST_STEP ? (
                <Button type="primary" onClick={() => void goTo(step + 1)}>
                  {t('setup.next')} <ArrowRightOutlined />
                </Button>
              ) : (
                <Button type="primary" icon={<CheckOutlined />} loading={setup.isPending} onClick={() => void submit()}>
                  {t('setup.create')}
                </Button>
              )}
            </Flex>
          </Card>
        </Col>

        <Col xs={24} xl={7}>
          <div style={{ position: 'sticky', top: 72 }}>
            <SetupSummary values={values} />
          </div>
        </Col>
      </Row>
    </ShellPage>
  );
}
