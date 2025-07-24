'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FadeInOnScroll from '@/components/ui/fadeInScroll';

const newsItems = [
    {
        id: 1,
        image: '/images/hero-bg.webp',
        title: 'Bincang Full Faedah – Food & Climate Change',
        excerpt: 'Rerata orang Indonesia buang makanan setara Rp330 triliun/tahun*. Ini menjadikannya negara terbesar kedua mubazir makanan...',
    },
    {
        id: 2,
        image: '/images/hero-bg.webp',
        title: 'Sate Somay 2021 – Bazar Makanan Indonesia di Berlin-Jerman',
        excerpt: 'Sate Somay a.k.a SASO, salah satu event Bazar makanan Indonesia terbesar di Berlin-Jerman yang diinisiasi oleh Jamaah IWKZ...',
    },
    {
        id: 3,
        image: '/images/hero-bg.webp',
        title: 'Tag der offenen Moschee – Islam adalah bagian dari Jerman',
        excerpt: 'Setiap tanggal 3 Oktober Jerman memperingati Hari Reunifikasi. Salah satu moment paling bersejarah ditandai sebagai simbol kebebasan...',
    },
];

export default function NewsSection() {
    return (
        <section className="relative min-h-dvh px-6 py-20 font-questrial flex flex-col items-center justify-center">
            <FadeInOnScroll>
                <div className="text-center space-y-4 mb-12 max-w-xl mx-auto">
                    <h2 className="text-4xl">News</h2>
                    <p className="text-gray-700">
                        Stay updated with the latest news from IWKZ. Explore recent activities, community events, and inspiring stories from the Indonesian Muslim community in Berlin.
                    </p>
                </div>

                {/* Grid now supports 3 columns on large screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 items-start max-w-6xl mx-auto">
                    {newsItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white shadow-md overflow-hidden transition hover:shadow-lg"
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
                                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.excerpt}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 text-center">
                    <Button variant="ghost" className="text-black border border-gray-400">
                        View More
                    </Button>
                </div>
            </FadeInOnScroll>
        </section>
    );
}