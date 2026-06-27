import dayjs from 'dayjs';

export const PRAYER_LABELS = {
  subuh: 'Subuh',
  dzuhur: 'Dzuhur',
  solatJumat: 'Solat Jumat',
  ashr: 'Ashr',
  maghrib: 'Maghrib',
  isya: 'Isya',
  terbit: 'Terbit',
};

export type PrayerLabelKey = keyof typeof PRAYER_LABELS;

// Helper function to get Solat Jumat time based on timezone
export const getSolatJumatTime = (): string => {
  const now = dayjs();
  const offset = now.utcOffset() / 60; // Returns +1 (CET) or +2 (CEST)
  return offset === 2 ? '13:30' : '12:30'; // CEST: 13:30, CET: 12:30
};

interface PrayerRowConfig {
  isCurrent: boolean;
  effectiveIsNext: boolean;
  label: string;
  time: string;
  containerScale: string;
  labelSize: string;
  timeSize: string;
  bgColorClass: string;
}

const getBgColorClass = (
  isCurrent: boolean,
  effectiveIsNext: boolean,
  isTerbit: boolean,
  isSolatJumat: boolean
): string => {
  if (isCurrent) {
    return 'bg-green-200 text-green-900 shadow-[0_0_28px_rgba(74,222,128,0.55)]';
  }
  if (effectiveIsNext) {
    return 'bg-rose-100 text-rose-900 shadow-[0_6px_18px_rgba(244,114,182,0.22)]';
  }
  if (isTerbit || isSolatJumat) {
    return 'bg-amber-100/70 text-amber-800';
  }
  return 'bg-gray-100/70 text-gray-800';
};

export const getPrayerRowConfig = (
  key: PrayerLabelKey,
  currentPrayerKey: string | null,
  nextPrayerKey: string | null,
  isAfterLastPrayer: boolean,
  prayerTimes: any
): PrayerRowConfig => {
  const isTerbit = key === 'terbit';
  const isSolatJumat = key === 'solatJumat';
  const isCurrent = key === currentPrayerKey && !isTerbit;
  const isNext = key === nextPrayerKey;
  const effectiveIsNext = isNext && !isAfterLastPrayer;
  const label = PRAYER_LABELS[key];
  const time = isSolatJumat
    ? getSolatJumatTime()
    : isTerbit
      ? prayerTimes.terbit
      : prayerTimes[key];

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

  const bgColorClass = getBgColorClass(
    isCurrent,
    effectiveIsNext,
    isTerbit,
    isSolatJumat
  );

  return {
    isCurrent,
    effectiveIsNext,
    label,
    time,
    containerScale,
    labelSize,
    timeSize,
    bgColorClass,
  };
};
