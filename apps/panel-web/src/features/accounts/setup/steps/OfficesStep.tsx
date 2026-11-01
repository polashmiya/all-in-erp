import { MailOutlined, PhoneOutlined, PlusOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Col, Empty, Flex, Form, Input, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { setupRules, suggestCodeOnBlur } from '../rules';
import { normalizeCode } from '../setup-model';
import { ItemCard } from './ItemCard';
import { UnitTabs } from './UnitTabs';

const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' };

function OfficeList({ unitIndex }: { unitIndex: number }) {
  const { t } = useTranslation();
  const form = Form.useFormInstance();
  const rules = setupRules(t);
  const listPath = ['businessUnits', unitIndex, 'offices'];

  return (
    <Form.List name={listPath}>
      {(fields, { add, remove }) => (
        <Flex vertical gap={12}>
          {fields.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={t('setup.noOffices')} style={{ marginBlock: 8 }} />}
          {fields.map((field, index) => {
            const path = [...listPath, field.name];
            return (
              <ItemCard
                key={field.key}
                path={path}
                icon={<ShopOutlined />}
                fallbackTitle={t('setup.officeN', { n: index + 1 })}
                onRemove={() => remove(field.name)}
              >
                <Row gutter={16}>
                  <Col xs={24} md={8}>
                    <Form.Item name={[field.name, 'code']} label={t('field.unitCode')} normalize={normalizeCode} rules={[...rules.code, rules.uniqueIn(listPath, field.name)]}>
                      <Input placeholder="HO" style={mono} maxLength={32} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={16}>
                    <Form.Item name={[field.name, 'name']} label={t('field.unitName')} rules={[rules.required, { max: 200 }]}>
                      <Input placeholder={t('setup.placeholder.officeName')} onBlur={suggestCodeOnBlur(form, path)} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name={[field.name, 'phone']} label={t('field.phone')} rules={[rules.phone]}>
                      <Input prefix={<PhoneOutlined />} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item name={[field.name, 'email']} label={t('field.email')} rules={[rules.email, { max: 256 }]}>
                      <Input prefix={<MailOutlined />} />
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
          <Button type="dashed" block icon={<PlusOutlined />} onClick={() => add({})}>
            {t('setup.addOffice')}
          </Button>
        </Flex>
      )}
    </Form.List>
  );
}

export function OfficesStep({ activeUnit, onUnitChange }: { activeUnit: number; onUnitChange: (index: number) => void }) {
  const { t } = useTranslation();

  return (
    <>
      <Typography.Paragraph type="secondary">{t('setup.officesIntro')}</Typography.Paragraph>
      <UnitTabs
        activeUnit={activeUnit}
        onChange={onUnitChange}
        count={(unit) => unit.offices?.length ?? 0}
        renderUnit={(unitIndex) => <OfficeList unitIndex={unitIndex} />}
      />
    </>
  );
}
