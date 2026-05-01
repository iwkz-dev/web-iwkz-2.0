import Link from 'next/link';

import { INavbarItem } from '@/types/globalContent.types';
import LanguageSwitcher from './language-switcher';

interface IMobileMenuProps {
  menuOpen: boolean;
  navbarItems: INavbarItem[];
  localePrefix: string;
  availableLocales: [string, { flag: string; label: string }][];
  currentLocale: string;
  onLocaleChange: (locale: string) => void;
  onClose: () => void;
}

export default function MobileMenu({
  menuOpen,
  navbarItems,
  localePrefix,
  availableLocales,
  currentLocale,
  onLocaleChange,
  onClose,
}: IMobileMenuProps) {
  const handleLocaleChange = (locale: string) => {
    onLocaleChange(locale);
    onClose();
  };

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } bg-white text-gray-800 border-t border-gray-100`}
    >
      <div className="px-4 py-4 space-y-1 text-sm font-medium">
        {navbarItems.map((item) => {
          if (item.text === 'PRS') {
            return (
              <Link
                key={item.id}
                href={`${localePrefix}/${item.url}`}
                onClick={onClose}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition-colors duration-150"
              >
                <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                {item.text}
              </Link>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.url}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onClose();
              }}
              className="flex items-center px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
            >
              {item.text}
            </Link>
          );
        })}

        <LanguageSwitcher
          availableLocales={availableLocales}
          currentLocale={currentLocale}
          onLocaleChange={handleLocaleChange}
          variant="mobile"
        />
      </div>
    </div>
  );
}
