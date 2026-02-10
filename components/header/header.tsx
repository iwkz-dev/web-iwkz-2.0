'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { INavbar } from '@/types/globalContent.types';
import { FiMenu, FiX } from 'react-icons/fi';
import {
  detectLocaleFromPathname,
  getLocalePrefix,
  getAvailableLocales,
} from '@/lib/locales';

interface IHeaderContentProps {
  headerContent: INavbar;
}

export default function Header({ headerContent }: IHeaderContentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Detect current locale from pathname
  const currentLocale = detectLocaleFromPathname(pathname);
  const localePrefix = getLocalePrefix(currentLocale);
  const navbarItems = headerContent.left_navbar_items;

  const handleLocaleChange = (newLocale: string) => {
    // Save locale preference to cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`; // 1 year

    // Navigate to the new locale path
    const newPath = `/${newLocale}`;
    router.push(newPath);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const renderNavLink = (
    item: INavbar['left_navbar_items'][0],
    mode: 'desktop' | 'mobile'
  ) => {
    const baseClass = 'border px-3 py-1';
    const desktopClass = scrolled
      ? 'border-gray-300 hover:bg-gray-100'
      : 'border-white hover:bg-white hover:text-black';
    const mobileClass = 'border-gray-800'; // consistent dark border, no hover needed

    if (item.text === 'PRS') {
      return (
        <Link
          key={item.id}
          href={`${localePrefix}/${item.url}`}
          className={`${baseClass} ${mode === 'desktop' ? desktopClass : mobileClass}`}
        >
          {item.text}
        </Link>
      );
    }

    return (
      <Link
        key={item.id}
        href={`${localePrefix}/${item.url}`}
        className="block"
      >
        {item.text}
      </Link>
    );
  };

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? 'bg-white text-gray-800 shadow'
          : 'bg-transparent text-white'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled || menuOpen ? 'py-4' : 'py-6'
        }`}
      >
        <Link href={localePrefix} className="flex items-center gap-2">
          {headerContent.logo.image?.url && (
            <div className="relative w-8 h-8">
              <Image
                src={headerContent.logo.image.url}
                alt={headerContent.logo.image.alternativeText || 'IWKZ logo'}
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
          <span className="text-xl font-semibold tracking-tight">
            {headerContent.logo.iwkz || 'IWKZ e.V.'}
          </span>
        </Link>

        <nav
          className="hidden md:flex items-center gap-6 text-sm font-medium"
          aria-label="Main Navigation"
        >
          {navbarItems.map((item) => renderNavLink(item, 'desktop'))}

          {/* Language Dropdown */}
          <select
            value={currentLocale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            className={`border px-3 py-1 rounded cursor-pointer ${
              scrolled
                ? 'border-gray-300 bg-white text-gray-800'
                : 'border-white bg-transparent text-white'
            }`}
            style={{
              color: scrolled ? undefined : 'white',
            }}
          >
            {getAvailableLocales().map(([code, { flag, label }]) => (
              <option key={code} value={code} style={{ color: 'black' }}>
                {label}
              </option>
            ))}
          </select>
        </nav>

        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-60 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
        } bg-white text-gray-800 px-4 border-t border-gray-200`}
      >
        <div className="space-y-3 text-sm font-medium">
          {navbarItems.map((item) => renderNavLink(item, 'mobile'))}

          {/* Mobile Language Dropdown */}
          <select
            value={currentLocale}
            onChange={(e) => handleLocaleChange(e.target.value)}
            className="w-full border border-gray-800 px-3 py-1 rounded cursor-pointer bg-white text-gray-800"
          >
            {getAvailableLocales().map(([code, { flag, label }]) => (
              <option key={code} value={code} style={{ color: 'black' }}>
                {flag} {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
