import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';
import Hero from '@/components/hero/hero';
import PRS from '@/components/prs/prs';
import OurServices from '@/components/ourServices/ourServices';
import Events from '@/components/events/events';
import ContactFooter from '@/components/contactFooter/contactFooter';
import Header from '@/components/header/header';
import News from '@/components/news/news';
import fetchPrayerTime from '@/actions/prayerTime';
import fetchPageContent from '@/actions/page';
import fetchGlobalContent from '@/actions/globalContent';
import { IPageResponse } from '@/types/page.types';
import { IPrayerTimes } from '@/types/prayerTimes.types';
import { IGlobalContent } from '@/types/globalContent.types';

export default async function Home() {
  const prayerTimeData: IPrayerTimes | null = await fetchPrayerTime();
  const pageData: IPageResponse | null = await fetchPageContent();
  const globalContent: IGlobalContent | null = await fetchGlobalContent();

  return (
    <div>
      <Header headerContent={globalContent?.data.navbar!} />
      <Hero heroContent={pageData?.data[0]!} />
      <PrayerTimesCard prayerTimes={prayerTimeData} />
      <PRS />
      <News />
      <OurServices ourServicesContent={pageData?.data[0]!} />
      <Events />
      <ContactFooter contactFooterContent={globalContent?.data.footer!} />
    </div>
  );
}
