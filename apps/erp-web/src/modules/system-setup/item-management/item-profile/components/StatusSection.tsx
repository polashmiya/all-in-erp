import { CheckboxList, DetailSection } from '@erp/ui';
import { useTranslation } from 'react-i18next';

export function StatusSection() {
  const { t } = useTranslation();

  return (
    <DetailSection title={t('item.side.usage')}>
      <CheckboxList
        options={[
          { name: 'isActive', label: t('item.f.active') },
          { name: 'isSaleable', label: t('item.f.saleable') },
          { name: 'isPurchase', label: t('item.f.purchasable') },
          { name: 'isNegativeSales', label: t('item.f.negativeSales') },
          { name: 'isMultipleSalesPrice', label: t('item.f.multiplePrices') },
        ]}
      />
    </DetailSection>
  );
}
