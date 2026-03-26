import { routing } from '@/i18n/routing';
import type { AbstractIntlMessages } from 'next-intl';

declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: AbstractIntlMessages;
  }
}
