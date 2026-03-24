import { notFound } from 'next/navigation';
import EventCalendar from '@/components/eventCalendar/eventCalendar';
import { IActivityCategoryComponent, IPageResponse } from '@/types/page.types';
import { fetchStrapiData } from '@/lib/fetch-strapi-data';

export const revalidate = 300;

export default async function KalenderKegiatanPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = locale || 'id';

  // Only allow Indonesian locale
  if (resolvedLocale !== 'id') {
    notFound();
  }

  const pageData = (await fetchStrapiData(`/pages?locale=${resolvedLocale}`, {
    revalidate,
  })) as IPageResponse | undefined;

  if (!pageData || 'error' in pageData || !pageData.data?.length) {
    notFound();
  }

  const eventCalendarData = pageData.data[0].content[3] as
    | IActivityCategoryComponent
    | undefined;

  return (
    <>
      {eventCalendarData ? (
        <EventCalendar eventCalendarContent={eventCalendarData} />
      ) : (
        <div className="min-h-dvh flex items-center justify-center">
          <p>No calendar data available</p>
        </div>
      )}
    </>
  );
}
