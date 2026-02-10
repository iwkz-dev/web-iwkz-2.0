'use client';

import { useEffect, useState } from 'react';
import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';
import Hero from '@/components/hero/hero';
//import PRS from "@/components/prs/prs";
import OurServices from '@/components/ourServices/ourServices';
//import Events from "@/components/events/events";
import ContactFooter from '@/components/contactFooter/contactFooter';
import Header from '@/components/header/header';
//import News from "@/components/news/news";
import LoadingPage from '@/components/loadingPage/loadingPage';
import { IHistoriesComponent, IPageResponse } from '@/types/page.types';
import { IPrayerTimes } from '@/types/prayerTimes.types';
import { IGlobalContent } from '@/types/globalContent.types';
import { notFound } from 'next/navigation';
import Timeline from '@/components/timeline';

export default function Home() {
  const [initialized, setInitialized] = useState(false);
  const [prayerTimeData, setPrayerTimeData] = useState<IPrayerTimes | null>(
    null
  );
  const [pageData, setPageData] = useState<IPageResponse | null>(null);
  const [globalContent, setGlobalContent] = useState<IGlobalContent | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prayerRes, pageRes, globalRes] = await Promise.all([
          fetch('/api/prayer-time'),
          fetch(`/api/pages`),
          fetch('/api/global'),
        ]);

        const [prayerJson, pageJson, globalJson] = await Promise.all([
          prayerRes.json(),
          pageRes.json(),
          globalRes.json(),
        ]);
        setPrayerTimeData(prayerJson.error ? null : prayerJson);
        setPageData(pageJson.error ? null : pageJson);
        setGlobalContent(globalJson.error ? null : globalJson);
        console.log(pageJson);

        setInitialized(true);
      } catch (err) {
        console.error('Failed to fetch one or more resources:', err);
      }
    };

    fetchData();
  }, []);

  if (!prayerTimeData || !pageData || !globalContent) {
    if (initialized) {
      notFound();
    }
    return <LoadingPage />;
  }

  const navbarOnlyHome: typeof globalContent.data.navbar = {
    ...globalContent.data.navbar,
    left_navbar_items: [
      { id: 1, text: 'Home', url: '#hero', target: null },
      { id: 3, text: 'Layanan', url: '#services', target: null },
      { id: 4, text: 'Kontak', url: '#contact', target: null },
    ],
  };

  const timelineData: IHistoriesComponent | undefined =
    pageData.data[0].content.find(
      (c) => c.__component === 'dynamic-zone.histories'
    );
  return (
    <div>
      <Header headerContent={navbarOnlyHome} />
      <PrayerTimesCard prayerTimes={prayerTimeData} />
      <Hero heroContent={pageData?.data[0]!} />
      <OurServices ourServicesContent={pageData?.data[0]!} />
      {timelineData && <Timeline timelineData={timelineData} />}
      <ContactFooter contactFooterContent={globalContent?.data.footer!} />
    </div>
  );
}
