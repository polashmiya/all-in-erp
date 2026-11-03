import dayjs from 'dayjs';
import 'dayjs/locale/bn';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { languages, type Language } from './language';
import { commonResources } from './resources';

export type AppResources = Record<Language, Record<string, string>>;

export function mergeResources(...parts: AppResources[]): AppResources {
  return Object.fromEntries(
    languages.map((lng) => [lng, Object.assign({}, ...parts.map((part) => part[lng]))]),
  ) as AppResources;
}

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    { name: 'erp.ui.language' },
  ),
);

function applyLanguage(language: Language) {
  dayjs.locale(language);
  if (i18next.language !== language) void i18next.changeLanguage(language);
  if (typeof document !== 'undefined') document.documentElement.lang = language;
}

export function initI18n(appResources?: AppResources) {
  const language = useLanguageStore.getState().language;

  void i18next.use(initReactI18next).init({
    lng: language,
    fallbackLng: 'en',
    supportedLngs: [...languages],
    interpolation: { escapeValue: false },
    keySeparator: false,
    resources: Object.fromEntries(
      languages.map((lng) => [
        lng,
        { translation: { ...commonResources[lng], ...(appResources?.[lng] ?? {}) } },
      ]),
    ),
  });

  applyLanguage(language);
  useLanguageStore.subscribe((state) => applyLanguage(state.language));

  return i18next;
}
