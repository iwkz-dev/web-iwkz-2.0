import fetchPrayerTime from '@/actions/prayerTime';
import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';

export default async function Home() {
  const prayerTimeData = await fetchPrayerTime();
  return (
    <div>
      <PrayerTimesCard prayerTimes={prayerTimeData} />
    </div>
  );
}
