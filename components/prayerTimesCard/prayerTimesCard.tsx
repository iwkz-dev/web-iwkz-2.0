'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IPrayerTimes } from '@/types/prayerTimes.types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import dayjs, { Dayjs } from 'dayjs';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import duration from 'dayjs/plugin/duration';
import { Clock, MapPin } from 'lucide-react';

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
  prayerTimes: IPrayerTimes | null;
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
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

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
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all"
      >
        <Clock className="w-4 h-4" />
        <span className="hidden sm:inline">Prayer Times</span>
        {isOpen ? <FaChevronDown className="w-3 h-3" /> : <FaChevronUp className="w-3 h-3" />}
      </Button>

      <div
        ref={panelRef}
        className={cn(
          'fixed z-40 bottom-20 right-6 w-[90vw] sm:w-[400px] transition-transform duration-500',
          isOpen ? 'translate-y-0' : 'translate-y-[120%]'
        )}
      >
        <Card className="bg-white/60 backdrop-blur-md shadow-xl rounded-sm gap-2">
          <CardHeader className="pb-4">
            <div className="flex justify-between items-center text-green-900">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <p className="font-bold text-xl tracking-tight">Prayer Times</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-800">
                <MapPin className="w-4 h-4" />
                <span>Berlin</span>
              </div>
            </div>

            <div className="mt-2 flex justify-between items-center">
              <Badge variant="green" className="text-xs font-medium px-3 py-1 rounded-full bg-green-600 text-white">
                {`Next: ${PRAYER_LABELS[nextPrayerKey]} – ${String(countdown.hours()).padStart(2, '0')}:${String(countdown.minutes()).padStart(2, '0')}:${String(countdown.seconds()).padStart(2, '0')}`}
              </Badge>
              <p className="text-sm text-green-700 font-mono">{currentTime.format('HH:mm:ss')}</p>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex flex-col gap-2">
              {PRAYER_ORDER.map((key) => (
                <div
                  key={key}
                  className={cn(
                    'flex justify-between items-center px-4 py-3 text-sm shadow transition-colors',
                    key === currentPrayerKey
                      ? 'bg-green-700 text-white shadow-md'
                      : 'bg-white/60 text-green-900 shadow-md'
                  )}
                >
                  <span className="font-semibold">{PRAYER_LABELS[key]}</span>
                  <span className="font-mono">{prayerTimes[key]}</span>
                </div>
              ))}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col items-center mt-4 text-xs text-green-800 space-y-1">
            <p>{`${currentTime.format('dddd, D MMMM YYYY')}`}</p>
            <p>{`🕋 ${prayerTimes.hijriahDate} ${prayerTimes.hijriahMonth} ${prayerTimes.hijriahYear} H`}</p> {/* 👈 Added Hijri date */}
            <p>{`🌤️ Sunrise (Terbit): ${prayerTimes.terbit}`}</p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
