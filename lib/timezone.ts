const BERLIN_TIMEZONE = 'Europe/Berlin';

// Returns Berlin's UTC offset label, e.g. "GMT+1" (CET) or "GMT+2" (CEST)
export const getBerlinOffset = (date: Date = new Date()): string | undefined =>
  new Intl.DateTimeFormat('en-US', {
    timeZone: BERLIN_TIMEZONE,
    timeZoneName: 'shortOffset',
  })
    .formatToParts(date)
    .find((part) => part.type === 'timeZoneName')?.value;

// Checks whether Berlin is on summer time (CEST), regardless of the visitor's/server's timezone
export const isCEST = (date: Date = new Date()): boolean =>
  getBerlinOffset(date) === 'GMT+2';
