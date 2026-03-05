'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { notFound } from 'next/navigation';
import Hero from '@/components/hero/hero';
import OurServices from '@/components/ourServices/ourServices';
import LoadingPage from '@/components/loadingPage/loadingPage';
import Timeline from '@/components/timeline/timeline';
import PRS from '@/components/prs/prs';
import {
  IActivityCategorySectionComponent,
  IHeroComponent,
  IHistoriesComponent,
  IPageResponse,
} from '@/types/page.types';

export default function Home() {
  const params = useParams();
  const locale = params.locale as string;
  const [initialized, setInitialized] = useState(false);
  const [pageData, setPageData] = useState<IPageResponse | null>(null);
  const [donationProgress, setDonationProgress] = useState<any | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiLocale = locale || 'id';
        const queryParams = new URLSearchParams({ locale: apiLocale });

        const [pageRes, donationProgressRes] = await Promise.all([
          fetch(`/api/pages?${queryParams.toString()}`),
          fetch(`/api/prs-donation-progress?${queryParams.toString()}`),
        ]);

        const [pageJson, donationProgressJson] = await Promise.all([
          pageRes.json(),
          donationProgressRes.json(),
        ]);

        setPageData(pageJson.error ? null : pageJson);
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

  if (!pageData || !donationProgress) {
    if (initialized) {
      notFound();
    }
    return <LoadingPage />;
  }

  const heroContent = pageData.data[0].content.find(
    (c) => c.__component === 'dynamic-zone.hero'
  ) as IHeroComponent;

  const ourServicesContent = pageData.data[0].content.find(
    (c) => c.__component === 'dynamic-zone.activity-category-section'
  ) as IActivityCategorySectionComponent;

  const timelineData = pageData.data[0].content.find(
    (c) => c.__component === 'dynamic-zone.histories'
  ) as IHistoriesComponent;

  const donationProgressData = donationProgress.data || null;

  return (
    <div>
      {heroContent && <Hero heroContent={heroContent} />}
      {donationProgressData && <PRS donationProgress={donationProgressData} />}
      {ourServicesContent && (
        <OurServices ourServicesContent={ourServicesContent} />
      )}
      {timelineData && <Timeline timelineData={timelineData} />}
    </div>
  );
}
