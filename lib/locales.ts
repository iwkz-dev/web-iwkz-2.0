// Locale configuration - add more locales here as needed
export const LOCALES = {
  id: { code: 'id', flag: '🇮🇩', label: 'ID' },
  'de-DE': { code: 'de-DE', flag: '🇩🇪', label: 'DE' },
} as const;

export const DEFAULT_LOCALE = 'id';

export type LocaleCode = keyof typeof LOCALES;

/**
 * Detect current locale from pathname
 */
export function detectLocaleFromPathname(pathname: string | null): LocaleCode {
  if (!pathname) return DEFAULT_LOCALE;

  const localeCode = Object.keys(LOCALES).find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  return (localeCode as LocaleCode) || DEFAULT_LOCALE;
}
/**
 * Get locale prefix for URLs
 */
export function getLocalePrefix(locale: LocaleCode): string {
  return `/${locale}`;
}

/**
 * Get all available locales as array
 */
export function getAvailableLocales() {
  return Object.entries(LOCALES);
}
