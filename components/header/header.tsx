'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { INavbar } from '@/types/globalContent.types';
import {
  detectLocaleFromPathname,
  getLocalePrefix,
  getAvailableLocales,
} from '@/lib/locales';
import { usePathnameWithoutLocale } from '@/hooks/use-pathname-without-locale';

import HeaderLogo from './_parts/header-logo';
import DesktopNav from './_parts/desktop-nav';
import MobileMenuButton from './_parts/mobile-menu-button';
import MobileMenu from './_parts/mobile-menu';

interface IHeaderContentProps {
  headerContent: INavbar;
}

export default function Header({ headerContent }: IHeaderContentProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const pathnameWithoutLocale = usePathnameWithoutLocale();

  const currentLocale = detectLocaleFromPathname(pathname);
  const localePrefix = getLocalePrefix(currentLocale);
  const navbarItems = headerContent.left_navbar_items;
  const availableLocales = getAvailableLocales();

  const handleLocaleChange = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    router.push(`/${newLocale}/${pathnameWithoutLocale}`);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isMainUrl =
    pathname === '/' ||
    pathname === localePrefix ||
    pathname === `${localePrefix}/`;
  const isTransparent = !scrolled && !menuOpen && isMainUrl;
  const isLight = scrolled || menuOpen;

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isLight
          ? 'bg-white/90 backdrop-blur-md text-gray-800 shadow-sm border-b border-gray-100'
          : isMainUrl
            ? 'bg-transparent text-white'
            : 'bg-gray-900/95 backdrop-blur-md text-white border-b border-white/10'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-5'
        }`}
      >
        <HeaderLogo logo={headerContent.logo} localePrefix={localePrefix} />

        <DesktopNav
          navbarItems={navbarItems}
          localePrefix={localePrefix}
          isTransparent={isTransparent}
          isLight={isLight}
          availableLocales={availableLocales}
          currentLocale={currentLocale}
          onLocaleChange={handleLocaleChange}
        />

        <MobileMenuButton
          menuOpen={menuOpen}
          isLight={isLight}
          onToggle={() => setMenuOpen((prev) => !prev)}
        />
      </div>

      <MobileMenu
        menuOpen={menuOpen}
        navbarItems={navbarItems}
        localePrefix={localePrefix}
        availableLocales={availableLocales}
        currentLocale={currentLocale}
        onLocaleChange={handleLocaleChange}
        onClose={() => setMenuOpen(false)}
      />
    </header>
  );
}
