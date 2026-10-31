export const languages = ['en', 'bn'] as const;

export type Language = (typeof languages)[number];

export const languageNames: Record<Language, string> = {
  en: 'English',
  bn: 'বাংলা',
};

/** A label that is either a plain string or a per-language map (the shape metadata uses). */
export type LocalizedText = string | ({ en: string } & Partial<Record<Language, string>>);

export function localize(text: LocalizedText, language: Language): string {
  if (typeof text === 'string') return text;
  return text[language] ?? text.en;
}
