import dayjs, { Dayjs } from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export type PrayerKey =
  | 'subuh'
  | 'terbit'
  | 'dzuhur'
  | 'ashr'
  | 'maghrib'
  | 'isya';

export const PRAYER_ORDER: PrayerKey[] = [
  'subuh',
  'terbit',
  'dzuhur',
  'ashr',
  'maghrib',
  'isya',
];

export function getCurrentPrayerKey(
  times: Record<PrayerKey, string>,
  currentTime: Dayjs
): PrayerKey | null {
  let current: PrayerKey | null = null;
  for (const key of PRAYER_ORDER) {
    const [h, m] = times[key].split(':').map(Number);
    const time = dayjs().hour(h).minute(m).second(0);
    if (currentTime.isAfter(time) || currentTime.isSame(time)) {
      current = key;
    }
  }
  return current;
}

export function getNextPrayerKey(
  times: Record<PrayerKey, string>,
  currentTime: Dayjs
): PrayerKey {
  for (const key of PRAYER_ORDER) {
    const [h, m] = times[key].split(':').map(Number);
    const time = dayjs().hour(h).minute(m).second(0);
    if (currentTime.isBefore(time)) return key;
  }
  return 'subuh'; // fallback to next day's Subuh
}

export function getTimeDiff(toTime: string, currentTime: Dayjs) {
  const [h, m] = toTime.split(':').map(Number);
  let target = dayjs().hour(h).minute(m).second(0);
  if (currentTime.isAfter(target)) {
    target = target.add(1, 'day');
  }
  const diff = target.diff(currentTime);
  return dayjs.duration(diff);
}
