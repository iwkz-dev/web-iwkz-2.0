import { notFound } from 'next/navigation';

import Hero from '@/components/hero/hero';
import OurServices from '@/components/ourServices/ourServices';
import Timeline from '@/components/timeline/timeline';
import PRS from '@/components/prs/prs';
import {
  IActivityCategorySectionComponent,
  IHeroComponent,
  IHistoriesComponent,
  IPageResponse,
} from '@/types/page.types';
import type { IPrsDonationProgressResponse } from '@/types/prsDonationProgress.types';
import { fetchStrapiData } from '@/lib/fetch-strapi-data';

export const revalidate = 300;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const apiLocale = locale || 'id';
  const queryParams = new URLSearchParams({ locale: apiLocale });

  const [pageData, donationProgress] = await Promise.all([
    fetchStrapiData(`/pages?${queryParams.toString()}`, {
      revalidate,
    }) as Promise<IPageResponse>,
    fetchStrapiData(`/prs-donation-progress?${queryParams.toString()}`, {
      revalidate,
    }) as Promise<IPrsDonationProgressResponse>,
  ]);

  if (
    !pageData ||
    !donationProgress ||
    'error' in pageData ||
    'error' in donationProgress ||
    !pageData.data?.length
  ) {
    notFound();
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
