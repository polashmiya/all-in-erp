import { ApartmentOutlined, MailOutlined, PhoneOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Input, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { setupRules, suggestCodeOnBlur } from '../../model/rules';
import { newBusinessUnit, normalizeCode } from '../../model/setup-model';
import { ItemCard } from './ItemCard';

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' };

export function BusinessUnitsStep() {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const rules = setupRules(t);

  return (
    <>
      <Typography.Paragraph type="secondary">{t('setup.unitsIntro')}</Typography.Paragraph>
      <Form.List
        name="businessUnits"
        rules={[
          {
            validator: async (_, units?: unknown[]) => {
              if (!units?.length) throw new Error(t('setup.needOneUnit'));
            },
          },
        ]}
      >
        {(fields, { add, remove }, { errors }) => (
          <Flex vertical gap={16}>
            {fields.map((field, index) => {
              const path = ['businessUnits', field.name];
              return (
                <ItemCard
                  key={field.key}
                  path={path}
                  icon={<ApartmentOutlined />}
                  fallbackTitle={t('setup.unitN', { n: index + 1 })}
                  removeDisabled={fields.length === 1}
                  confirmRemove={t('setup.removeUnitConfirm')}
                  onRemove={() => remove(field.name)}
                >
                  <Row gutter={16}>
                    <Col xs={24} md={8}>
                      <Form.Item
                        name={[field.name, 'code']}
                        label={t('field.unitCode')}
                        normalize={normalizeCode}
                        rules={[...rules.code, rules.uniqueIn(['businessUnits'], field.name)]}
                      >
                        <Input placeholder="DHK" style={mono} maxLength={32} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={16}>
                      <Form.Item name={[field.name, 'name']} label={t('field.unitName')} rules={[rules.required, { max: 200 }]}>
                        <Input placeholder={t('setup.placeholder.unitName')} onBlur={suggestCodeOnBlur(form, path)} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name={[field.name, 'email']} label={t('field.email')} rules={[rules.email, { max: 256 }]}>
                        <Input prefix={<MailOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24} md={12}>
                      <Form.Item name={[field.name, 'phone']} label={t('field.phone')} rules={[rules.phone]}>
                        <Input prefix={<PhoneOutlined />} />
                      </Form.Item>
                    </Col>
                    <Col xs={24}>
                      <Form.Item name={[field.name, 'address']} label={t('field.address')} rules={[{ max: 500 }]} style={{ marginBottom: 4 }}>
                        <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </ItemCard>
              );
            })}
            <Button type="dashed" size="large" block icon={<PlusOutlined />} onClick={() => add(newBusinessUnit())}>
              {t('setup.addUnit')}
            </Button>
            <Form.ErrorList errors={errors} />
          </Flex>
        )}
      </Form.List>
    </>
  );
}
