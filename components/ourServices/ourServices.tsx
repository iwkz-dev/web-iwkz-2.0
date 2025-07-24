'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import FadeInOnScroll from '@/components/ui/fadeInScroll';
import { IActivityCategory, IActivityCategorySectionComponent, IPage } from '@/types/page.types';

interface IOurServicesProps {
    ourServicesContent: IPage;
}

export default function CommunityServices({ ourServicesContent }: IOurServicesProps) {
    const content = ourServicesContent.content[1] as IActivityCategorySectionComponent;
    const { headline, subHeadline, ActivityCategory: categories } = content;

    const [activeKey, setActiveKey] = useState<number>(categories[0].id);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const activeItem = useMemo(() => {
        return categories.find((item: IActivityCategory) => item.id === activeKey);
    }, [activeKey, categories]);

    const resetInterval = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setActiveKey((prevId) => {
                const currentIndex = categories.findIndex((cat) => cat.id === prevId);
                const nextIndex = (currentIndex + 1) % categories.length;
                return categories[nextIndex].id;
            });
        }, 5000);
    };

    useEffect(() => {
        resetInterval();
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [categories]);

    const handleClick = (id: number) => {
        setActiveKey(id);
        resetInterval(); // restart timer after manual click
    };

    return (
        <section className="relative min-h-dvh bg-green-50 px-6 py-20 font-questrial flex flex-col items-center justify-center">
            <FadeInOnScroll>
                <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
                    <h2 className="text-4xl">{headline}</h2>
                    <p className="max-w-2xl mx-auto">{subHeadline}</p>
                    <Button variant="ghost" className="text-black border border-gray-400">
                        Learn More
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start max-w-6xl mx-auto">
                    {/* Image Section */}
                    <figure className="w-full h-[350px] md:h-[400px] lg:h-[450px] relative overflow-hidden">
                        {activeItem?.image?.[0]?.url && (
                            <div
                                key={activeItem.image[0].id}
                                className="absolute inset-0"
                                style={{
                                    opacity: 0,
                                    animation: 'fadeIn 0.8s ease-in-out forwards',
                                }}
                            >
                                <Image
                                    src={activeItem.image[0].url}
                                    alt={activeItem.image[0].alternativeText || 'Community image'}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        )}
                    </figure>

                    {/* Text Section */}
                    <div className="space-y-3 my-auto">
                        {categories.map(({ id, title, content }) => {
                            const isActive = activeKey === id;
                            return (
                                <article
                                    key={id}
                                    onClick={() => handleClick(id)}
                                    className={`cursor-pointer p-4 transition-all duration-200 ${isActive ? 'border-l-4 border-pink-300' : ''
                                        }`}
                                >
                                    <h3 className="text-xl text-gray-800">{title}</h3>
                                    <p
                                        className={`text-gray-700 text-sm mt-1 transition-opacity duration-500 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
                                            }`}
                                    >
                                        {content}
                                    </p>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </FadeInOnScroll>
        </section>
    );
}
