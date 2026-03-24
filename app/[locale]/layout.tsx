import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';
import { IPrayerTimes } from '@/types/prayerTimes.types';
import Header from '@/components/header/header';
import ContactFooter from '@/components/contactFooter/contactFooter';
import { fetchStrapiData } from '@/lib/fetch-strapi-data';
import { IGlobalContent } from '@/types/globalContent.types';

export const revalidate = 300;

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

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
    );
  } catch (error) {
    console.error('Error fetching layout data:', error);

    // Fallback UI when data fetch fails
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">{children}</div>
    );
  }
}
