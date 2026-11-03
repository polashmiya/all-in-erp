import { ApartmentOutlined, AppstoreOutlined, BankOutlined, InboxOutlined, ShopOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Flex, Row, Tag, Typography, theme } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { structureFromForm } from '../../components/structure';
import { useStructureColors } from '../../components/structure-colors';
import { StructureTree } from '../../components/StructureTree';
import { initials } from '../../utils/format';
import { countStructure, type SetupFormValues } from '../model/setup-model';

function Count({ icon, value, label, color }: { icon: ReactNode; value: number; label: string; color: string }) {
  return (
    <Flex vertical align="center" gap={2}>
      <span style={{ color, fontSize: 16 }}>{icon}</span>
      <Typography.Text strong style={{ fontSize: 20, lineHeight: 1.2 }}>
        {value}
      </Typography.Text>
      <Typography.Text type="secondary" style={{ fontSize: 12, textAlign: 'center' }}>
        {label}
      </Typography.Text>
    </Flex>
  );
}

export function SetupSummary({ values }: { values: SetupFormValues | undefined }) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const colors = useStructureColors();
  const name = values?.account?.name?.trim();
  const code = values?.account?.code;
  const counts = countStructure(values?.businessUnits);

  return (
    <Card title={t('setup.summary')}>
      <Flex align="center" gap={12}>
        <Avatar shape="square" size={44} icon={name ? undefined : <BankOutlined />} style={{ background: token.colorPrimary, fontWeight: 600, flexShrink: 0 }}>
          {name ? initials(name) : null}
        </Avatar>
        <div style={{ minWidth: 0 }}>
          <Typography.Text strong ellipsis style={{ display: 'block' }} type={name ? undefined : 'secondary'}>
            {name || t('setup.unnamed')}
          </Typography.Text>
          {code && (
            <Tag bordered={false} style={{ fontFamily: 'ui-monospace, monospace', marginTop: 2 }}>
              {code}
            </Tag>
          )}
        </div>
      </Flex>

      <Row gutter={8} style={{ marginTop: 20 }}>
        <Col span={8}>
          <Count icon={<ApartmentOutlined />} value={counts.businessUnits} label={t('accounts.stat.businessUnits')} color={colors.unit} />
        </Col>
        <Col span={8}>
          <Count icon={<ShopOutlined />} value={counts.offices} label={t('accounts.stat.offices')} color={colors.office} />
        </Col>
        <Col span={8}>
          <Count icon={<InboxOutlined />} value={counts.warehouses} label={t('accounts.stat.warehouses')} color={colors.warehouse} />
        </Col>
      </Row>

      {values?.featureCodes !== undefined && (
        <Typography.Text type="secondary" style={{ display: 'block', marginTop: 14, fontSize: 13 }}>
          <AppstoreOutlined style={{ marginInlineEnd: 6 }} />
          {t('setup.menusSelected', { count: values.featureCodes.length })}
        </Typography.Text>
      )}

      <Divider style={{ margin: '16px 0 12px' }} />
      <StructureTree units={structureFromForm(values?.businessUnits)} />
    </Card>
  );
}
