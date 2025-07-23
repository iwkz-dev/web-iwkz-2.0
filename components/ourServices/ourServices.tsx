'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import FadeInOnScroll from '../ui/fadeInScroll';

const serviceItems = [
    {
        key: 'support',
        title: 'Community Support',
        description:
            'Our community support services provide assistance to families and individuals in need. We aim to create a strong network of support and resources.',
        image: '/images/hero-bg.webp',
    },
    {
        key: 'education',
        title: 'Educational Programs',
        description:
            'We offer various educational programs that cater to all ages, focusing on cultural and religious education. Our goal is to empower individuals through knowledge.',
        image: '/images/hero-bg.webp',
    },
    {
        key: 'religion',
        title: 'Religious Services',
        description:
            'Our religious services provide a space for worship and spiritual growth. We invite everyone to join us in our community gatherings and prayers.',
        image: '/images/hero-bg.webp',
    },
];

export default function CommunityServices() {
    const [activeKey, setActiveKey] = useState('support');
    const activeItem = serviceItems.find((item) => item.key === activeKey);

    return (
        <section className="relative min-h-dvh bg-green-50 px-6 py-20 font-questrial flex m-auto flex-col items-center justify-center">
            <FadeInOnScroll>
                <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
                    <h2 className="text-4xl">
                        Our Services
                    </h2>
                    <p className="max-w-2xl mx-auto">
                        At IWKZ e.V., we offer a range of services designed to uplift and support the Indonesian community in Berlin.
                        From educational programs to religious services, we are committed to fostering a nurturing environment.
                    </p>
                    <Button variant="ghost" className="text-black border border-gray-400">Learn More</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
                    <div className="w-full h-[350px] md:h-[400px] lg:h-[450px] relative overflow-hidden transition-all duration-300">
                        <Image
                            src={activeItem?.image || ''}
                            alt={activeItem?.title || ''}
                            fill
                            className="object-cover"
                            key={activeItem?.image}
                        />
                    </div>

                    {/* Text List */}
                    <div className="space-y-6 m-auto">
                        {serviceItems.map((item) => {
                            const isActive = activeKey === item.key;

                            return (
                                <div
                                    key={item.key}
                                    onClick={() => setActiveKey(item.key)}
                                    className={`cursor-pointer p-4 transition-all duration-200 ${isActive ? 'border-l-4 border-pink-200' : ''
                                        }`}
                                >
                                    <h3 className="text-xl text-gray-800">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-700 text-sm mt-1">{item.description}</p>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </FadeInOnScroll>
        </section>
    );
}
