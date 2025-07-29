'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FadeInOnScroll from '@/components/ui/fadeInScroll';
import Link from 'next/link';

const newsItems = [
    {
        id: 1,
        image: '/images/hero-bg.webp',
        title: 'Bincang Full Faedah – Food & Climate Change',
        excerpt: 'Rerata orang Indonesia buang makanan setara Rp330 triliun/tahun*. Ini menjadikannya negara terbesar kedua mubazir makanan...',
        createdAt: "01.12.2022"
    },
    {
        id: 2,
        image: '/images/hero-bg.webp',
        title: 'Sate Somay 2021 – Bazar Makanan Indonesia di Berlin-Jerman',
        excerpt: 'Sate Somay a.k.a SASO, salah satu event Bazar makanan Indonesia terbesar di Berlin-Jerman yang diinisiasi oleh Jamaah IWKZ...',
        createdAt: "03.10.2023"
    },
    {
        id: 3,
        image: '/images/hero-bg.webp',
        title: 'Tag der offenen Moschee – Islam adalah bagian dari Jerman',
        excerpt: 'Setiap tanggal 3 Oktober Jerman memperingati Hari Reunifikasi. Salah satu moment paling bersejarah ditandai sebagai simbol kebebasan...',
        createdAt: "04.07.2025"
    },
];

export default function NewsSection() {
    return (
        <section className="relative min-h-dvh px-6 py-20 font-questrial flex flex-col items-center justify-center">
            <FadeInOnScroll>
                <div className="text-center space-y-4 mb-12 max-w-xl mx-auto">
                    <h2 className="text-4xl">News</h2>
                    <p className="text-gray-700">
                        Stay updated with the latest news from IWKZ. Explore recent activities,
                        community events, and inspiring stories from the Indonesian Muslim
                        community in Berlin.
                    </p>
                </div>

                <div
                    className="flex flex-col gap-10 lg:flex-row lg:justify-center lg:items-stretch max-w-6xl mx-auto"
                >
                    {newsItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white shadow-md overflow-hidden transition hover:shadow-lg flex-1"
                        >
                            <div className="relative w-full h-64">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4 space-y-2">
                                <p className="text-xs text-gray-500">
                                    {new Date(item.createdAt).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </p>

                                <h3 className="text-lg font-semibold text-gray-800 hover:underline">
                                    <Link href="/">{item.title}</Link>
                                </h3>

                                <p className="text-sm text-gray-600 line-clamp-2">
                                    {item.excerpt}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeInOnScroll>
        </section >

    );
}