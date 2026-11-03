import { formatDate, ImageDrop, SectionCard, SwitchList } from '@erp/ui';
import { Form } from 'antd';
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
    <>
      <SectionCard title={t('item.side.image')}>
        <Form.Item name="image" valuePropName="value" noStyle>
          <ImageDrop hint={t('item.side.imageHint')} />
        </Form.Item>
      </SectionCard>

      <SectionCard title={t('item.side.status')}>
        <SwitchList
          options={[
            { name: 'isActive', label: t('item.active') },
            { name: 'availableForSale', label: t('item.side.availableSale') },
            { name: 'availableForPurchase', label: t('item.side.availablePurchase') },
          ]}
        />
      </SectionCard>

      <SectionCard title={t('item.side.recordInfo')}>
        <dl className="erp-dl-inline">
          <dt>{t('item.side.businessUnit')}</dt>
          <dd>{businessUnit}</dd>
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
    </>
  );
}
