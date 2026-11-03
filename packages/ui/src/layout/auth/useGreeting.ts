import { useTranslation } from 'react-i18next';
import { timeOfDay } from '../../utils/format';

export function useGreeting() {
  const { t } = useTranslation();
  return t(`auth.greeting.${timeOfDay()}`);
}
