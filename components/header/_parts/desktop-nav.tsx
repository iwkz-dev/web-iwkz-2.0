import Link from 'next/link';

import { INavbarItem } from '@/types/globalContent.types';
import LanguageSwitcher from './language-switcher';

interface IDesktopNavProps {
  navbarItems: INavbarItem[];
  localePrefix: string;
  isTransparent: boolean;
  isLight: boolean;
  availableLocales: [string, { flag: string; label: string }][];
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
}

export default function DesktopNav({
  navbarItems,
  localePrefix,
  isTransparent,
  isLight,
  availableLocales,
  currentLocale,
  onLocaleChange,
}: IDesktopNavProps) {
  return (
    <nav
      className="hidden md:flex items-center gap-1 text-sm font-medium"
      aria-label="Main Navigation"
    >
      {navbarItems.map((item) => {
        if (item.text === 'PRS') {
          return (
            <Link
              key={item.id}
              href={`${localePrefix}/${item.url}`}
              className="ml-2 px-4 py-1.5 rounded-full bg-green-500 text-white text-sm font-semibold hover:bg-green-600 active:bg-green-700 transition-colors duration-150 shadow-sm"
            >
              {item.text}
            </Link>
          );
        }

        return (
          <Link
            key={item.id}
            href={item.url}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`relative px-3 py-1.5 rounded-md transition-colors duration-150 group ${
              isTransparent
                ? 'hover:bg-white/15'
                : isLight
                  ? 'hover:bg-gray-100 text-gray-700'
                  : 'hover:bg-white/10'
            }`}
          >
            {item.text}
            <span className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full bg-green-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
          </Link>
        );
      })}

      <LanguageSwitcher
        availableLocales={availableLocales}
        currentLocale={currentLocale}
        onLocaleChange={onLocaleChange}
        variant="desktop"
        isLight={isLight}
      />
    </nav>
  );
}
