'use client';

import { usePathname } from 'next/navigation';

export function usePathnameWithoutLocale(
  locales: string[] = ['id', 'de-DE']
): string | null {
  const pathname = usePathname();

  if (!pathname) return pathname;

  const segments = pathname.split('/');
  const firstSegment = segments[1];

  if (locales.includes(firstSegment)) {
    return '/' + segments.slice(2).join('/');
  }

  return pathname;
}
