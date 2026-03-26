import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';
import { IPrayerTimes } from '@/types/prayerTimes.types';
import Header from '@/components/header/header';
import ContactFooter from '@/components/contactFooter/contactFooter';
import { fetchStrapiData } from '@/lib/fetch-strapi-data';
import { IGlobalContent } from '@/types/globalContent.types';
import { getLayoutMetadata } from '@/lib/seo';
import { routing } from '@/i18n/routing';

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getLayoutMetadata({ locale });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  try {
    // Parallel data fetching for better performance
    const [prayerTimesData, globalData] = await Promise.all([
      fetchStrapiData('/jadwalshalat', {
        revalidate,
      }) as Promise<IPrayerTimes>,
      fetchStrapiData(`/global?locale=${locale}`, {
        revalidate,
      }) as Promise<IGlobalContent>,
    ]);

    return (
      <NextIntlClientProvider messages={messages}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          {prayerTimesData && <PrayerTimesCard prayerTimes={prayerTimesData} />}
          {globalData?.data?.navbar && (
            <Header headerContent={globalData.data.navbar} />
          )}
          {children}
          {globalData?.data?.footer && (
            <ContactFooter contactFooterContent={globalData.data.footer} />
          )}
        </div>
      </NextIntlClientProvider>
    );
  } catch (error) {
    console.error('Error fetching layout data:', error);

    // Fallback UI when data fetch fails
    return (
      <NextIntlClientProvider messages={messages}>
        <div className="min-h-screen flex flex-col bg-gray-50">{children}</div>
      </NextIntlClientProvider>
    );
  }
}
