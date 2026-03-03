'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Hero from '@/components/hero/hero';
import OurServices from '@/components/ourServices/ourServices';
import ContactFooter from '@/components/contactFooter/contactFooter';
import Header from '@/components/header/header';
import LoadingPage from '@/components/loadingPage/loadingPage';
import Timeline from '@/components/timeline/timeline';
import PRS from '@/components/prs/prs';
import {
  IActivityCategorySectionComponent,
  IHeroComponent,
  IHistoriesComponent,
  IPageResponse,
} from '@/types/page.types';
import { IGlobalContent } from '@/types/globalContent.types';
import { getTranslations } from '@/lib/translations';

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;
  const [initialized, setInitialized] = useState(false);
  const [pageData, setPageData] = useState<IPageResponse | null>(null);
  const [globalContent, setGlobalContent] = useState<IGlobalContent | null>(
    null
  );
  const [donationProgress, setDonationProgress] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiLocale = locale || 'id';
        const queryParams = new URLSearchParams({ locale: apiLocale });

        const [pageRes, globalRes, donationProgressRes] = await Promise.all([
          fetch(`/api/pages?${queryParams.toString()}`),
          fetch(`/api/global?${queryParams.toString()}`),
          fetch(`/api/prs-donation-progress?${queryParams.toString()}`),
        ]);

        const [pageJson, globalJson, donationProgressJson] = await Promise.all([
          pageRes.json(),
          globalRes.json(),
          donationProgressRes.json(),
        ]);

        setPageData(pageJson.error ? null : pageJson);
        setGlobalContent(globalJson.error ? null : globalJson);
        setDonationProgress(
          donationProgressJson.error ? null : donationProgressJson
        );
        setInitialized(true);
      } catch (err) {
        console.error('Failed to fetch one or more resources:', err);
      }
    };

    fetchData();
  }, [locale]);

  if (!pageData || !globalContent || !donationProgress) {
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
      ...(globalContent.data.locale === 'de-DE'
        ? [
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
          ]
        : []),
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
            {
              id: 7,
              text: 'Donasi',
              url: `/donation`,
              target: null,
            },
          ]
        : []),
    ],
  };

  const heroContent = pageData.data[0].content.find(
    (c) => c.__component === 'dynamic-zone.hero'
  ) as IHeroComponent;

  const ourServicesContent = pageData.data[0].content.find(
    (c) => c.__component === 'dynamic-zone.activity-category-section'
  ) as IActivityCategorySectionComponent;

  const timelineData = pageData.data[0].content.find(
    (c) => c.__component === 'dynamic-zone.histories'
  ) as IHistoriesComponent;

  const donationProgressData = donationProgress.data;

  return (
    <div>
      <Header headerContent={navbarOnlyHome} />
      {heroContent && <Hero heroContent={heroContent} />}
      <PRS donationProgress={donationProgressData} />
      {ourServicesContent && (
        <OurServices ourServicesContent={ourServicesContent} />
      )}
      {timelineData && <Timeline timelineData={timelineData} />}
      <ContactFooter contactFooterContent={globalContent.data.footer} />
    </div>
  );
}
