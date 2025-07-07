'use server';

import { PrayerTimes } from '@/types/prayerTimes.types';

export default async function fetchPrayerTime(): Promise<PrayerTimes> {
  const response = await fetch(
    `${process.env.IWKZ_API_URL as string}/jadwalshalat`,
    {
      cache: 'no-store',
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch prayer times');
  }
  return response.json();
}
