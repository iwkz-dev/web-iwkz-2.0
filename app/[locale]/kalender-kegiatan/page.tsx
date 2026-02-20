'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Header from '@/components/header/header';
import ContactFooter from '@/components/contactFooter/contactFooter';
import LoadingPage from '@/components/loadingPage/loadingPage';
import EventCalendar from '@/components/eventCalendar/eventCalendar';
import { IActivityCategoryComponent, IPageResponse } from '@/types/page.types';
import { IGlobalContent } from '@/types/globalContent.types';
import { getTranslations } from '@/lib/translations';

export default function KalenderKegiatanPage() {
  const params = useParams();
  const locale = (params.locale as string) || 'id';

  // Only allow Indonesian locale
  if (locale !== 'id') {
    notFound();
  }

  const t = getTranslations(locale);

  const [initialized, setInitialized] = useState(false);
  const [pageData, setPageData] = useState<IPageResponse | null>(null);
  const [globalContent, setGlobalContent] = useState<IGlobalContent | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pageRes, globalRes] = await Promise.all([
          fetch(`/api/pages?locale=${locale}`),
          fetch(`/api/global?locale=${locale}`),
        ]);

        const [pageJson, globalJson] = await Promise.all([
          pageRes.json(),
          globalRes.json(),
        ]);

        setPageData(pageJson.error ? null : pageJson);
        setGlobalContent(globalJson.error ? null : globalJson);
        setInitialized(true);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, [locale]);

  if (!pageData || !globalContent) {
    if (initialized) {
      notFound();
    }
    return <LoadingPage />;
  }

  const navbarContent = {
    ...globalContent.data?.navbar,
    left_navbar_items: [
      { id: 1, text: t.navbar.home, url: '/', target: null },
      { id: 2, text: t.navbar.services, url: '/#services', target: null },
      { id: 3, text: t.navbar.history, url: '/#timeline', target: null },
      { id: 4, text: t.navbar.contact, url: '/#contact', target: null },
      {
        id: 5,
        text: t.navbar.jadwalShalat,
        url: `/jadwal-shalat`,
        target: null,
      },
      {
        id: 6,
        text: 'Kalender Kegiatan',
        url: `/kalender-kegiatan`,
        target: null,
      },
    ],
  };

  const eventCalendarData = pageData.data[0].content[3] as
    | IActivityCategoryComponent
    | undefined;

  return (
    <div>
      <Header headerContent={navbarContent} />
      {eventCalendarData ? (
        <EventCalendar eventCalendarContent={eventCalendarData} />
      ) : (
        <div className="min-h-dvh flex items-center justify-center">
          <p>No calendar data available</p>
        </div>
      )}
      <ContactFooter contactFooterContent={globalContent?.data.footer!} />
    </div>
  );
}
