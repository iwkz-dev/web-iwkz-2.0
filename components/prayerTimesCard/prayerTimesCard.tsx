'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { IPrayerTimes } from '@/types/prayerTimes.types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import duration from 'dayjs/plugin/duration';
import { Clock } from 'lucide-react';
import {
  getCurrentPrayerKey,
  getNextPrayerKey,
  getTimeDiff,
} from '@/lib/prayerTimes';

dayjs.extend(duration);

const PRAYER_LABELS = {
  subuh: 'Subuh',
  dzuhur: 'Dzuhur',
  ashr: 'Ashr',
  maghrib: 'Maghrib',
  isya: 'Isya',
  terbit: 'Terbit',
};

type PrayerLabelKey = keyof typeof PRAYER_LABELS;

export default function PrayerTimesCard({
  prayerTimes,
}: {
  prayerTimes: IPrayerTimes | null;
}) {
  const { toast } = useToast();

  useEffect(() => {
    if (!prayerTimes) {
      toast({
        title: 'Prayer times unavailable',
        description:
          'The prayer times API is not working right now. Please try again later.',
        variant: 'destructive',
        duration: 6000,
      });
    }
  }, [prayerTimes, toast]);

  if (!prayerTimes) {
    return null; // toast informs the user
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

  // logic moved to utils

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentPrayerKey = getCurrentPrayerKey(prayerTimes, currentTime);
  const nextPrayerKey = getNextPrayerKey(prayerTimes, currentTime);
  const isAfterLastPrayer = currentPrayerKey === 'isya';
  const countdown = getTimeDiff(prayerTimes[nextPrayerKey], currentTime);

  // Minimal countdown format for "(−hh:mm:ss)"
  const fmtCountdown =
    `${String(countdown.hours()).padStart(2, '0')}:` +
    `${String(countdown.minutes()).padStart(2, '0')}:` +
    `${String(countdown.seconds()).padStart(2, '0')}`;

  // Display order includes muted "terbit" between subuh and dzuhur
  const DISPLAY_ORDER: Array<PrayerLabelKey> = [
    'subuh',
    'terbit',
    'dzuhur',
    'ashr',
    'maghrib',
    'isya',
  ];

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 bottom-6 right-6 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-full shadow-lg flex items-center gap-2 transition-all"
      >
        <Clock className="w-4 h-4" />
        <span>
          {isAfterLastPrayer
            ? `Now: ${PRAYER_LABELS[currentPrayerKey]}`
            : `Next: ${PRAYER_LABELS[nextPrayerKey]} (-${fmtCountdown})`}
        </span>
        {isOpen ? (
          <FaChevronDown className="w-3 h-3" />
        ) : (
          <FaChevronUp className="w-3 h-3" />
        )}
      </Button>

      <div
        ref={panelRef}
        className={cn(
          'fixed z-50 bottom-20 right-6 w-[90vw] sm:w-100 transition-transform duration-500',
          isOpen ? 'translate-y-0' : 'translate-y-[120%]'
        )}
      >
        <Card className="bg-white/30 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/40 py-4 gap-4">
          <CardHeader className="px-4">
            <p className="text-center text-base sm:text-lg font-medium tracking-wide text-gray-900">
              {currentTime.format('DD. MMMM YYYY')}
            </p>
          </CardHeader>

          <CardContent className="px-4 pt-0">
            <div className="space-y-2">
              {DISPLAY_ORDER.map((key) => {
                const isTerbit = key === 'terbit';
                // Do not highlight when current is 'terbit' – treat as default
                const isCurrent = key === currentPrayerKey && !isTerbit;
                // After Isya, do NOT treat Subuh as next for styling
                const isNext = key === nextPrayerKey;
                const effectiveIsNext = isNext && !isAfterLastPrayer;
                const label = PRAYER_LABELS[key];
                const time = isTerbit ? prayerTimes.terbit : prayerTimes[key];

                // unified row height to prevent panel resizing (more compact)
                const containerSize = 'py-4';
                const containerScale = isCurrent
                  ? 'scale-[1.02]'
                  : effectiveIsNext
                    ? 'scale-[1.01]'
                    : 'scale-100';
                const labelSize = isCurrent
                  ? 'text-base'
                  : effectiveIsNext
                    ? 'text-sm'
                    : 'text-xs';
                const timeSize = isCurrent
                  ? 'text-xl'
                  : effectiveIsNext
                    ? 'text-lg'
                    : 'text-sm';

                console.log(currentPrayerKey);
                return (
                  <div
                    key={key}
                    className={cn(
                      'flex items-center justify-between rounded-2xl px-4 font-sans backdrop-blur-md transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.10)] will-change-transform',
                      containerSize,
                      containerScale,
                      isCurrent &&
                        'bg-green-200 text-green-900 shadow-[0_0_28px_rgba(74,222,128,0.55)]',
                      effectiveIsNext &&
                        !isCurrent &&
                        'bg-rose-100 text-rose-900 shadow-[0_6px_18px_rgba(244,114,182,0.22)]',
                      !isCurrent &&
                        !effectiveIsNext &&
                        'bg-gray-100/70 text-gray-800',
                      // On hover of a row, shine orange without changing layout size
                      'hover:bg-orange-100! hover:text-orange-900! hover:shadow-[0_0_28px_rgba(251,146,60,0.55)]! hover:scale-100!'
                    )}
                  >
                    <span className={cn('tracking-wide', labelSize)}>
                      {label}
                    </span>
                    <div className="flex items-center gap-3">
                      {isCurrent && (
                        <span className="text-xs uppercase tracking-widest text-green-800">
                          NOW
                        </span>
                      )}
                      {effectiveIsNext && !isCurrent && (
                        <span className="text-xs font-mono text-rose-800">
                          (-{fmtCountdown})
                        </span>
                      )}
                      <span className={cn('font-mono', timeSize)}>{time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="px-2 flex justify-center">
            <span className="text-[12px] text-gray-900">
              {`${prayerTimes.hijriahDate} ${prayerTimes.hijriahMonth} ${prayerTimes.hijriahYear} H`}
            </span>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
