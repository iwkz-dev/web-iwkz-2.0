export const translations = {
  id: {
    navbar: {
      home: 'Home',
      services: 'Layanan',
      history: 'Sejarah',
      contact: 'Kontak',
      jadwalShalat: 'Jadwal Shalat',
    },
    contactFooter: {
      heading: 'Hubungi Kami',
      address: 'Alamat',
      email: 'Email',
      emailDesc: 'Untuk pertanyaan atau informasi:',
      socialMedia: 'Sosial Media',
    },
    jadwalShalatPage: {
      title: 'Jadwal Shalat',
      description: 'Download jadwal shalat bulanan dalam format PDF.',
      month: 'Bulan',
      year: 'Tahun',
      generate: 'Download Jadwal Shalat',
      loading: 'Sedang memproses...',
      error: 'Terjadi kesalahan saat membuat PDF',
      downloadRamadan: 'Download Jadwal Shalat Ramadan',
    },
  },
  'de-DE': {
    navbar: {
      home: 'Startseite',
      services: 'Dienstleistungen',
      history: 'Geschichte',
      contact: 'Kontakt',
      jadwalShalat: '-',
    },
    contactFooter: {
      heading: 'Kontaktieren Sie uns',
      address: 'Adresse',
      email: 'E-Mail',
      emailDesc: 'Für Fragen oder Informationen:',
      socialMedia: 'Soziale Medien',
    },
    jadwalShalatPage: {
      title: '-',
      description: '-',
      month: '-',
      year: '-',
      generate: '-',
      loading: '-',
      error: '-',
      downloadRamadan: '-',
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
