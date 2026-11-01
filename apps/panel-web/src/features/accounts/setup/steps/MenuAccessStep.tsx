import { Alert, Form, Typography } from 'antd';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FeatureAccessTree } from '../../components/FeatureAccess';
import { useFeatureCatalog } from '../../components/feature-catalog';
import type { SetupFormValues } from '../setup-model';

/** Which ERP modules / features the new account gets. Everything is selected until the user decides otherwise. */
export function MenuAccessStep() {
  const { t } = useTranslation();
  const form = Form.useFormInstance<SetupFormValues>();
  const { allCodes, loading } = useFeatureCatalog();
  const selected = Form.useWatch('featureCodes', form) as string[] | undefined;

  useEffect(() => {
    if (!loading && form.getFieldValue('featureCodes') === undefined) form.setFieldValue('featureCodes', allCodes);
  }, [loading, allCodes, form]);

  return (
    <>
      <Typography.Paragraph type="secondary">{t('setup.menusIntro')}</Typography.Paragraph>
      <Alert type="info" showIcon message={t('menus.adminNote')} style={{ marginBottom: 16 }} />
      <Form.Item name="featureCodes" noStyle>
        <FeatureAccessTree />
      </Form.Item>
      {selected?.length === 0 && <Alert type="warning" showIcon message={t('menus.noneWarning')} style={{ marginTop: 12 }} />}
    </>
  );
}
