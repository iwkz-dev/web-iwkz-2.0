'use server';

import { IPrayerTimes } from '@/types/prayerTimes.types';

export default async function fetchPrayerTime(): Promise<IPrayerTimes | null> {
  const response = await fetch(
    `${process.env.IWKZ_API_URL as string}/jadwalshalat`,
    {
      cache: 'no-store',
    }
  );
  if (!response.ok) {
    console.error('Failed to fetch prayer times');
    return null;
  }
  return response.json();
}
