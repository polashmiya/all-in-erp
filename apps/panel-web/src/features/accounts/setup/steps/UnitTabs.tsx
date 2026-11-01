import { ApartmentOutlined } from '@ant-design/icons';
import { Badge, Form, Space, Tabs, theme } from 'antd';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import type { BusinessUnitForm } from '../setup-model';

/**
 * One tab per business unit for the offices / warehouses steps. Every tab is rendered (forceRender) so its
 * fields are validated when the step is; the page switches to the tab holding the first error.
 */
export function UnitTabs({
  activeUnit,
  onChange,
  count,
  renderUnit,
}: {
  activeUnit: number;
  onChange: (index: number) => void;
  count: (unit: BusinessUnitForm) => number;
  renderUnit: (unitIndex: number, unit: BusinessUnitForm) => ReactNode;
}) {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const form = Form.useFormInstance();
  const units = (Form.useWatch('businessUnits', { form, preserve: true }) as BusinessUnitForm[] | undefined) ?? [];

  return (
    <Tabs
      activeKey={String(Math.min(activeUnit, Math.max(units.length - 1, 0)))}
      onChange={(key) => onChange(Number(key))}
      items={units.map((unit, index) => ({
        key: String(index),
        forceRender: true,
        label: (
          <Space size={8}>
            <ApartmentOutlined />
            {unit?.name?.trim() || t('setup.unitN', { n: index + 1 })}
            <Badge count={count(unit ?? {})} showZero size="small" color={count(unit ?? {}) ? token.colorPrimary : token.colorTextQuaternary} />
          </Space>
        ),
        children: renderUnit(index, unit ?? {}),
      }))}
    />
  );
}
