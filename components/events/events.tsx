'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import FadeInOnScroll from '@/components/ui/fadeInScroll';

const events = [
    {
        id: 1,
        title: 'Cultural Awareness Workshop',
        tag: 'Workshop',
        city: 'Berlin',
        date: '2024-02-09',
        description: 'Explore the richness of Indonesian culture through interactive sessions.',
        image: '/images/hero-bg.webp',
    },
    {
        id: 2,
        title: 'Islamic Finance Seminar',
        tag: 'Seminar',
        city: 'Berlin',
        date: '2024-02-10',
        description: 'Learn about Islamic finance principles and their applications in modern society.',
        image: '/images/hero-bg.webp',
    },
    {
        id: 3,
        title: 'Community Potluck',
        tag: 'Community',
        city: 'Berlin',
        date: '2024-02-11',
        description: 'Bring a dish to share and connect with fellow community members!',
        image: '/images/hero-bg.webp',
    },
];

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dayNum = date.getDate();
    const monthYear = date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
    });
    return { day, dayNum, monthYear };
}

export default function Events() {
    return (
        <section className="relative min-h-dvh px-6 py-20 font-questrial flex m-auto flex-col items-center justify-center">
            <FadeInOnScroll>
                <div className="text-center space-y-4 mb-12 max-w-xl mx-auto">
                    <h2 className="text-4xl">Upcoming Events</h2>
                    <p className="text-gray-700">
                        Join us for our exciting upcoming community events!
                    </p>
                </div>

                <div
                    className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible max-w-6xl mx-auto"
                >
                    {events.map((event) => {
                        const { day, dayNum, monthYear } = formatDate(event.date);
                        return (
                            <div
                                key={event.id}
                                className="flex-shrink-0 w-72 md:w-auto snap-start overflow-hidden shadow transition"
                            >
                                <div className="relative h-64 bg-gray-100">
                                    <Image
                                        src={event.image}
                                        alt={event.title}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2 bg-white text-center px-3 py-1 rounded-sm text-sm font-medium text-gray-800">
                                        <div className="text-xs">{day}</div>
                                        <div className="text-xl font-bold">{dayNum}</div>
                                        <div className="text-xs">{monthYear}</div>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm text-white p-4">
                                        <Link href={`/events/${event.id}`}>
                                            <h3 className="text-lg font-semibold hover:underline">
                                                {event.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm text-gray-200 line-clamp-2">
                                            {event.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </FadeInOnScroll>
        </section>
    );

}