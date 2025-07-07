'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Clock, MapPin } from 'lucide-react';
import { Badge } from '../ui/badge';
import { PrayerTimes } from '@/types/prayerTimes.types';
import { pick } from '@/lib/pick';

export default function PrayerTimesCard({
  prayerTimes,
}: {
  prayerTimes: PrayerTimes | null;
}) {
  const [time, setTime] = useState(getCurrentTime());

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
  const prayerTimeData = pick(prayerTimes, [
    'subuh',
    'dzuhur',
    'ashr',
    'maghrib',
    'isya',
  ]);

  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getCurrentTime());
    }, 1000);

    return () => clearInterval(interval); // Clean up on unmount
  }, []);

  return (
    <section className="py-8 px-4 bg-white">
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
              <p className="font-bold">Next prayer: maghrib - {time}</p>
            </Badge>
            <p className="text-sm">{time}</p>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-rows-5 grid-cols-1 sm:grid-rows-1 sm:grid-cols-5 gap-2">
            {Object.entries(prayerTimeData).map(([key, value]) => (
              <div
                key={key}
                className="flex-1 flex flex-col items-center p-4 rounded-lg bg-white/70 text-green-800"
              >
                <p className="font-bold">{key}</p>
                <p className="text-sm">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </section>
  );
}
