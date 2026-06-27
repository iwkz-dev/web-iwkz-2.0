import React from 'react';
import { cn } from '@/lib/utils';
import {
  PrayerLabelKey,
  getPrayerRowConfig,
} from '@/lib/prayerTimesCardHelpers';
import { IPrayerTimes } from '@/types/prayerTimes.types';

interface PrayerRowProps {
  prayerKey: PrayerLabelKey;
  currentPrayerKey: string | null;
  nextPrayerKey: string | null;
  isAfterLastPrayer: boolean;
  prayerTimes: IPrayerTimes;
  fmtCountdown: string;
}

export default function PrayerRow({
  prayerKey,
  currentPrayerKey,
  nextPrayerKey,
  isAfterLastPrayer,
  prayerTimes,
  fmtCountdown,
}: PrayerRowProps) {
  const config = getPrayerRowConfig(
    prayerKey,
    currentPrayerKey,
    nextPrayerKey,
    isAfterLastPrayer,
    prayerTimes
  );

  return (
    <div
      className={cn(
        'flex items-center justify-between rounded-2xl px-4 font-sans backdrop-blur-md transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.10)] will-change-transform',
        'py-4',
        config.containerScale,
        config.bgColorClass,
        'hover:bg-orange-100! hover:text-orange-900! hover:shadow-[0_0_28px_rgba(251,146,60,0.55)]! hover:scale-100!'
      )}
    >
      <span className={cn('tracking-wide', config.labelSize)}>
        {config.label}
      </span>
      <div className="flex items-center gap-3">
        {config.isCurrent && (
          <span className="text-xs uppercase tracking-widest text-green-800">
            NOW
          </span>
        )}
        {config.effectiveIsNext && !config.isCurrent && (
          <span className="text-xs font-mono text-rose-800">
            (-{fmtCountdown})
          </span>
        )}
        <span className={cn('font-mono', config.timeSize)}>{config.time}</span>
      </div>
    </div>
  );
}
