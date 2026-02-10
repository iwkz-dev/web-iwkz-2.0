export const translations = {
  id: {
    navbar: {
      home: 'Home',
      services: 'Layanan',
      history: 'Sejarah',
      contact: 'Kontak',
    },
    contactFooter: {
      heading: 'Hubungi Kami',
      address: 'Alamat',
      email: 'Email',
      emailDesc: 'Untuk pertanyaan atau informasi:',
      socialMedia: 'Sosial Media',
    },
  },
  'de-DE': {
    navbar: {
      home: 'Startseite',
      services: 'Dienstleistungen',
      history: 'Geschichte',
      contact: 'Kontakt',
    },
    contactFooter: {
      heading: 'Kontaktieren Sie uns',
      address: 'Adresse',
      email: 'E-Mail',
      emailDesc: 'Für Fragen oder Informationen:',
      socialMedia: 'Soziale Medien',
    },
  },
} as const;

export type LocaleKey = keyof typeof translations;

/**
 * Get translations for a specific locale
 * Falls back to Indonesian if locale not found
 */
export function getTranslations(locale: string) {
  return translations[locale as LocaleKey] || translations.id;
}
