import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useGoBack } from '../../hooks/useGoBack';

export function BackButton({ to }: { to: string }) {
  const { t } = useTranslation();
  const goBack = useGoBack(to);

  return (
    <button type="button" className="erp-backbtn" aria-label={t('shell.back')} onClick={goBack}>
      <ArrowLeftOutlined />
    </button>
  );
}
