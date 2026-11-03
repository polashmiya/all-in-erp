import { formatDate, ImageDrop, SectionCard } from '@erp/ui';
import { Form, Switch } from 'antd';
import { useTranslation } from 'react-i18next';
import type { Item } from '../../types/item.types';

export function ItemFormAside({
  item,
  businessUnit,
  actor,
}: {
  item?: Item;
  businessUnit: string;
  actor: string;
}) {
  const { t } = useTranslation();

  return (
    <aside className="erp-split__side">
      <SectionCard title={t('item.side.image')}>
        <Form.Item name="image" valuePropName="value" noStyle>
          <ImageDrop hint={t('item.side.imageHint')} />
        </Form.Item>
      </SectionCard>

      <SectionCard title={t('item.side.status')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(
            [
              ['isActive', 'item.active'],
              ['availableForSale', 'item.side.availableSale'],
              ['availableForPurchase', 'item.side.availablePurchase'],
            ] as const
          ).map(([name, label]) => (
            <label key={name} className="erp-toggle-row">
              <span>{t(label)}</span>
              <Form.Item name={name} valuePropName="checked">
                <Switch aria-label={t(label)} />
              </Form.Item>
            </label>
          ))}
        </div>
      </SectionCard>

      <SectionCard title={t('item.side.recordInfo')}>
        <dl className="erp-dl-inline">
          <dt>{t('item.side.businessUnit')}</dt>
          <dd style={{ fontWeight: 500 }}>{businessUnit}</dd>
          <dt>{t('item.side.createdBy')}</dt>
          <dd>{item?.createdBy ?? actor}</dd>
          {item && (
            <>
              <dt>{t('item.side.updated')}</dt>
              <dd>{formatDate(item.updatedAt)}</dd>
            </>
          )}
          <dt>{t('item.side.layout')}</dt>
          <dd>{t('item.side.layoutValue')}</dd>
        </dl>
      </SectionCard>
    </aside>
  );
}
