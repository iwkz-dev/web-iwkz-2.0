import fetchPrayerTime from '@/actions/prayerTime';
import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';
import Hero from '@/components/hero/hero';

export default async function Home() {
  const prayerTimeData = await fetchPrayerTime();

  return (
    <div>
      <Hero />
      <PrayerTimesCard prayerTimes={prayerTimeData} />
    </div>
  );
}
