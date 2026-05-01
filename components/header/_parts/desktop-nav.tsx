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
  const handlePrsClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const prsSection = document.getElementById('prs');
    if (!prsSection) return;

    event.preventDefault();
    window.history.replaceState(null, '', `${window.location.pathname}#prs`);

    const top = prsSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
  };

  return (
    <nav
      className="hidden md:flex items-center gap-1 text-sm font-medium"
      aria-label="Main Navigation"
    >
      {navbarItems.map((item) => {
        if (item.text === 'PRS') {
          const prsClassName = isTransparent
            ? 'ml-2 px-3 py-1.5 rounded-md bg-emerald-100/15 text-emerald-50 hover:bg-emerald-100/25'
            : isLight
              ? 'ml-2 px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-800 hover:bg-emerald-100/80'
              : 'ml-2 px-3 py-1.5 rounded-md bg-emerald-100/10 text-emerald-100 hover:bg-emerald-100/20';

          return (
            <Link
              key={item.id}
              href={`${localePrefix}#prs`}
              onClick={handlePrsClick}
              className={`${prsClassName} text-sm font-medium transition-colors duration-150`}
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
