'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Hero from '@/components/hero/hero';
//import PRS from "@/components/prs/prs";
import OurServices from '@/components/ourServices/ourServices';
//import Events from "@/components/events/events";
import ContactFooter from '@/components/contactFooter/contactFooter';
import Header from '@/components/header/header';
//import News from "@/components/news/news";
import LoadingPage from '@/components/loadingPage/loadingPage';
import { IHistoriesComponent, IPageResponse } from '@/types/page.types';
import { IGlobalContent } from '@/types/globalContent.types';
import { notFound } from 'next/navigation';
import Timeline from '@/components/timeline/timeline';
import { getTranslations } from '@/lib/translations';

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;
  const [initialized, setInitialized] = useState(false);
  const [pageData, setPageData] = useState<IPageResponse | null>(null);
  const [globalContent, setGlobalContent] = useState<IGlobalContent | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the locale from URL params
        const apiLocale = locale || 'id';
        const params = new URLSearchParams({
          locale: apiLocale,
        });

        const [pageRes, globalRes] = await Promise.all([
          fetch(`/api/pages?${params.toString()}`),
          fetch(`/api/global?${params.toString()}`),
        ]);

        const [pageJson, globalJson] = await Promise.all([
          pageRes.json(),
          globalRes.json(),
        ]);
        setPageData(pageJson.error ? null : pageJson);
        setGlobalContent(globalJson.error ? null : globalJson);
        setInitialized(true);
      } catch (err) {
        console.error('Failed to fetch one or more resources:', err);
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

  const t = getTranslations(locale);

  const navbarOnlyHome: typeof globalContent.data.navbar = {
    ...globalContent.data.navbar,
    left_navbar_items: [
      { id: 1, text: t.navbar.home, url: '#hero', target: null },
      {
        id: 2,
        text: t.navbar.services,
        url: '#services',
        target: null,
      },
      {
        id: 3,
        text: t.navbar.history,
        url: '#timeline',
        target: null,
      },
      {
        id: 4,
        text: t.navbar.contact,
        url: '#contact',
        target: null,
      },
      ...(globalContent.data.locale === 'id'
        ? [
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
          ]
        : []),
    ],
  };

  const timelineData: IHistoriesComponent | undefined =
    pageData.data[0].content.find(
      (c) => c.__component === 'dynamic-zone.histories'
    );

  return (
    <div>
      <Header headerContent={navbarOnlyHome} />
      <Hero heroContent={pageData?.data[0]!} />
      <OurServices ourServicesContent={pageData?.data[0]!} />
      {timelineData && <Timeline timelineData={timelineData} />}
      <ContactFooter contactFooterContent={globalContent?.data.footer!} />
    </div>
  );
}
