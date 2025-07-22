'use client';

import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Detect scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled || menuOpen
                    ? 'bg-white text-gray-800 shadow'
                    : 'bg-transparent text-white'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="text-2xl font-logo">Logo</div>

                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="#">Home Page</Link>
                    <Link href="#">News</Link>
                    <Link href="#">Our Services</Link>
                    <Link href="#">Upcoming Events</Link>
                    <Link
                        href="#"
                        className={`border px-3 py-1 rounded ${scrolled
                                ? 'border-gray-300 hover:bg-gray-100'
                                : 'border-white hover:bg-white hover:text-black'
                            }`}
                    >
                        Proyek Rumah Surga
                    </Link>
                </nav>

                <button
                    className="md:hidden text-2xl"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </div>

            {/* Smooth mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-60 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'
                    } bg-white text-gray-800 px-4 border-t border-gray-200`}
            >
                <div className="space-y-3 text-sm font-medium">
                    <Link href="#" className="block">
                        Home Page
                    </Link>
                    <Link href="#" className="block">
                        News
                    </Link>
                    <Link href="#" className="block">
                        Our Services
                    </Link>
                    <Link href="#" className="block">
                        Upcoming Events
                    </Link>
                    <Link href="#" className="block font-semibold">
                        Proyek Rumah Surga
                    </Link>
                </div>
            </div>
        </header>
    );
}
