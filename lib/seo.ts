import type { Metadata } from 'next';
import type { IPageResponse } from '@/types/page.types';
import { DEFAULT_LOCALE, LOCALES, type LocaleCode } from '@/lib/locales';

type LayoutMetadataParams = {
  locale?: string;
};

function resolveLocale(locale?: string): LocaleCode {
  if (locale && locale in LOCALES) {
    return locale as LocaleCode;
  }

  return DEFAULT_LOCALE;
}

function buildLanguageAlternates(): Record<string, string> {
  return {
    id: '/id',
    'de-DE': '/de-DE',
    'x-default': `/${DEFAULT_LOCALE}`,
  };
}

export async function getLayoutMetadata(
  params?: LayoutMetadataParams
): Promise<Metadata> {
  const locale = resolveLocale(params?.locale);

  const fallback: Metadata = {
    title: 'IWKZ Berlin',
    description: 'indonesischer Weisheits- & Kulturzentrum e.V.',
    alternates: {
      languages: buildLanguageAlternates(),
    },
    applicationName: 'IWKZ e.V.',
    manifest: '/site.webmanifest',
    icons: {
      icon: [
        { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/favicon.ico' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    appleWebApp: {
      title: 'IWKZ e.V.',
    },
  };

  try {
    const res = await fetch(
      `${process.env.IWKZ_API_URL}/pages?locale=${encodeURIComponent(locale)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) return fallback;

    const data = (await res.json()) as IPageResponse;
    const page = data?.data?.[0];
    const seo = page?.seo;

    if (!seo) return fallback;

    const keywords = seo.keywords
      ? seo.keywords
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : undefined;

    const robotsStr = (seo.metaRobots ?? '').toLowerCase();
    const robots = {
      index: !robotsStr.includes('noindex'),
      follow: !robotsStr.includes('nofollow'),
    };

    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      keywords,
      alternates: {
        canonical: seo.canonicalURL || `/${locale}`,
        languages: buildLanguageAlternates(),
      },
      robots,
      applicationName: 'IWKZ e.V.',
      manifest: '/site.webmanifest',
      icons: {
        icon: [
          { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
          { url: '/favicon.svg', type: 'image/svg+xml' },
          { url: '/favicon.ico' },
        ],
        apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
      },
      appleWebApp: {
        title: 'IWKZ e.V.',
      },
    };
  } catch {
    return fallback;
  }
}
