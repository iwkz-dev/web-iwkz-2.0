'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import PrayerTimesCard from '@/components/prayerTimesCard/prayerTimesCard';
import { IPrayerTimes } from '@/types/prayerTimes.types';

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const locale = params.locale as string;
  const [prayerTimeData, setPrayerTimeData] = useState<IPrayerTimes | null>(
    null
  );

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch('/api/prayer-time');
        const data = await response.json();
        setPrayerTimeData(data.error ? null : data);
      } catch (err) {
        console.error('Failed to fetch prayer times:', err);
      }
    };

    fetchPrayerTimes();
  }, [locale]);

  return (
    <>
      {prayerTimeData && <PrayerTimesCard prayerTimes={prayerTimeData} />}
      {children}
    </>
  );
}
