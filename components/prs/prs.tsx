'use client';

import Image from 'next/image';
import { Button } from '../ui/button';
import { FaUsers, FaHandshake, FaLeaf } from 'react-icons/fa';
import FadeInOnScroll from '../ui/fadeInScroll';

export default function PRS() {
    return (
        <section className="relative min-h-dvh bg-pink-100 font-questrial px-4 py-20 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center justify-center">
            <FadeInOnScroll>
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center">
                    {/* Left Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-4xl">Proyek Rumah Surga</h2>
                        <p className="max-w-2xl mx-auto">
                            IWKZ e.V. is dedicated to fostering a vibrant Indonesian community in Berlin. We provide a welcoming space for cultural exchange, support, and collaboration.
                        </p>

                        <ul className="space-y-3 text-gray-700">
                            <li className="flex items-start gap-3">
                                <FaLeaf className="mt-1 text-green-600" />
                                Cultural events that celebrate our heritage and traditions.
                            </li>
                            <li className="flex items-start gap-3">
                                <FaUsers className="mt-1 text-blue-600" />
                                Support services for newcomers and community members.
                            </li>
                            <li className="flex items-start gap-3">
                                <FaHandshake className="mt-1 text-yellow-600" />
                                Networking opportunities for personal and professional growth.
                            </li>
                        </ul>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <Button variant="outline">Donate Now</Button>
                            <Button variant="ghost" className="text-black border border-gray-400">
                                Learn More
                            </Button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] relative">
                        <Image
                            src="/images/hero-bg.webp"
                            alt="Community photo"
                            fill
                            className="object-cover rounded-md"
                            priority
                        />
                    </div>
                </div>
            </FadeInOnScroll>
        </section>
    );
}
