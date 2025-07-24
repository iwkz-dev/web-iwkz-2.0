import fetchPrayerTime from '@/actions/prayerTime';
import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';
import Hero from '@/components/hero/hero';
import PRS from '@/components/prs/prs';
import OurServices from '@/components/ourServices/ourServices';
import Events from '@/components/events/events';
import GetInTouch from '@/components/getInTouch/getInTouch';
import Header from '@/components/header/header';
import News from '@/components/news/news';
import fetchGlobalContent from '@/actions/globalContent';
import fetchPageContent from '@/actions/page';
import { IPageResponse } from '@/types/page.types';
import { IGlobalContent } from '@/types/globalContent.types';
import { IPrayerTimes } from '@/types/prayerTimes.types';

export default async function Home() {
  const prayerTimeData: IPrayerTimes | null = await fetchPrayerTime();
  const globalContent: IGlobalContent | null = await fetchGlobalContent();
  const pageData: IPageResponse | null = await fetchPageContent();

  return (
    <div>
      <Header />
      <Hero heroContent={pageData?.data[0]!} />
      <PrayerTimesCard prayerTimes={prayerTimeData} />
      <PRS />
      <News />
      <OurServices ourServicesContent={pageData?.data[0]!} />
      <Events />
      <GetInTouch />
    </div>
  );
}
