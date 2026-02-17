import type { Metadata } from 'next';
import type { IPageResponse } from '@/types/page.types';

export async function getLayoutMetadata(): Promise<Metadata> {
  const fallback: Metadata = {
    title: 'IWKZ Berlin',
    description: 'indonesischer Weisheits- & Kulturzentrum e.V.',
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
    const res = await fetch(`${process.env.IWKZ_API_URL}/pages`, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: 'no-store',
    });

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
      alternates: seo.canonicalURL
        ? { canonical: seo.canonicalURL }
        : undefined,
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
