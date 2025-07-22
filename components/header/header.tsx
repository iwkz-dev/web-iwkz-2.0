'use client';

import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        handleScroll();
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
            <div
                className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between transition-all duration-300 ${scrolled || menuOpen ? 'py-4' : 'py-6'
                    }`}
            >

                <Link href="/" className="flex items-center gap-2">
                    <div className="relative w-8 h-8">
                        <Image
                            src="/iwkz-logo.svg"
                            alt="IWKZ Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <span className="text-xl font-semibold tracking-tight">IWKZ e.V.</span>
                </Link>
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <Link href="#">Home</Link>
                    <Link href="#">News</Link>
                    <Link href="#">Our Services</Link>
                    <Link href="#">Upcoming Events</Link>
                    <Link
                        href="#"
                        className={`border px-3 py-1 ${scrolled
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
                        Home
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
