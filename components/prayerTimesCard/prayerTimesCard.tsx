'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Clock, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';
import { PrayerTimes } from '@/types/prayerTimes.types';
import { pick } from '@/lib/pick';
import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { cn } from '@/lib/utils';

dayjs.extend(duration);

const PRAYER_LABELS = {
  subuh: 'Subuh',
  dzuhur: 'Dzuhur',
  ashr: 'Ashr',
  maghrib: 'Maghrib',
  isya: 'Isya',
};

type PrayerKey = keyof typeof PRAYER_LABELS;

const PRAYER_ORDER: PrayerKey[] = [
  'subuh',
  'dzuhur',
  'ashr',
  'maghrib',
  'isya',
];

export default function PrayerTimesCard({
  prayerTimes,
}: {
  prayerTimes: PrayerTimes | null;
}) {
  if (!prayerTimes) {
    return (
      <section className="py-8 px-4 bg-white">
        <Card className="container mx-auto max-w-6xl border text-card-foreground shadow-2xs bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <p className="text-red-500">Prayer times data is not available.</p>
          </CardHeader>
        </Card>
      </section>
    );
  }

  const [currentTime, setCurrentTime] = useState(dayjs());

  function getCurrentPrayerKey(
    times: Record<PrayerKey, string>,
    currentTime: Dayjs
  ): PrayerKey {
    let current: PrayerKey = 'subuh';
    for (const key of PRAYER_ORDER) {
      const [h, m] = times[key].split(':').map(Number);
      const time = dayjs().hour(h).minute(m);
      if (currentTime.isAfter(time) || currentTime.isSame(time)) {
        current = key;
      }
    }

    return current; // fallback to next day's Subuh
  }

  function getNextPrayerKey(
    times: Record<PrayerKey, string>,
    currentTime: Dayjs
  ): PrayerKey {
    for (const key of PRAYER_ORDER) {
      const [h, m] = times[key].split(':').map(Number);
      const time = dayjs().hour(h).minute(m);
      if (currentTime.isBefore(time)) return key;
    }

    return 'subuh'; // fallback to next day's Subuh
  }

  function getTimeDiff(toTime: string, currentTime: Dayjs) {
    const [h, m] = toTime.split(':').map(Number);
    let target = dayjs().hour(h).minute(m).second(0);
    if (currentTime.isAfter(target)) {
      target = target.add(1, 'day');
    }
    const diff = target.diff(currentTime);
    return dayjs.duration(diff);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentPrayerKey = getCurrentPrayerKey(prayerTimes, currentTime);
  const nextPrayerKey = getNextPrayerKey(prayerTimes, currentTime);
  const countdown = getTimeDiff(prayerTimes[nextPrayerKey], currentTime);

  return (
    <section className="py-8 px-4 bg-white select-none">
      <Card className="container mx-auto max-w-6xl border text-card-foreground shadow-2xs bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex justify-between">
            <div className="grid grid-cols-[auto_1fr] items-center gap-2 text-green-800">
              <Clock className="w-5 h-5" />
              <p className="font-bold text-lg">Prayer Times</p>
            </div>
            <div className="grid grid-cols-[auto_1fr] items-center gap-2 text-green-800">
              <MapPin className="w-3 h-3" />
              <p className="text-sm">Berlin</p>
            </div>
          </div>
          <div className="flex justify-between">
            <Badge variant="green">
              {`Next prayer: ${PRAYER_LABELS[nextPrayerKey]} - ${String(
                countdown.hours()
              ).padStart(2, '0')}:${String(countdown.minutes()).padStart(
                2,
                '0'
              )}:${String(countdown.seconds()).padStart(2, '0')}`}
            </Badge>
            <p className="text-sm">{currentTime.format('HH:mm:ss')}</p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-rows-5 grid-cols-1 sm:grid-rows-1 sm:grid-cols-5 gap-2">
            {PRAYER_ORDER.map((key) => (
              <div
                key={key}
                className={cn(
                  'flex-1 flex flex-col items-center p-4 rounded-lg',
                  key === currentPrayerKey
                    ? ' text-white bg-green-700'
                    : 'bg-white/70 text-green-800'
                )}
              >
                <p className="font-bold">{PRAYER_LABELS[key]}</p>
                <p className="text-sm">{prayerTimes[key]}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center flex-col text-sm text-green-800">
          <p>{`🕌 ${currentTime.format('dddd D MMMM YYYY')}`}</p>
          <p>{`🌤️ ${prayerTimes.terbit}`}</p>
        </CardFooter>
      </Card>
    </section>
  );
}
