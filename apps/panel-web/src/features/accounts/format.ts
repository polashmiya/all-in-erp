import type { Language } from '@erp/ui';

const displayNames = new Map<string, Intl.DisplayNames>();

/** Localised country name for an ISO code ("BD" → "Bangladesh" / "বাংলাদেশ"); falls back to the code. */
export function countryName(code: string | null | undefined, language: Language): string {
  if (!code) return '';
  try {
    let names = displayNames.get(language);
    if (!names) {
      names = new Intl.DisplayNames([language], { type: 'region' });
      displayNames.set(language, names);
    }
    return names.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/** Two-letter avatar text from a company name. */
export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const letters = words.length > 1 ? `${words[0]![0]}${words[1]![0]}` : (words[0] ?? '').slice(0, 2);
  return letters.toUpperCase();
}
