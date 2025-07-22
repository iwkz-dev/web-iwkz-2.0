import fetchPrayerTime from '@/actions/prayerTime';
import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';
import Hero from '@/components/hero/hero';
import PRS from '@/components/prs/prs';
import OurServices from '@/components/ourServices/ourServices';
import Events from '@/components/events/events';
import GetInTouch from '@/components/getInTouch/getInTouch';
import Header from '@/components/header/header';
import News from '@/components/news/news';

export default async function Home() {
  const prayerTimeData = await fetchPrayerTime();

  return (
    <div>
      <Header />
      <Hero />
      <PrayerTimesCard prayerTimes={prayerTimeData} />
      <PRS />
      <News />
      <OurServices />
      <Events />
      <GetInTouch />
    </div>
  );
}
