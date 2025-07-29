'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { FaUsers, FaHandshake, FaLeaf, FaHeart } from 'react-icons/fa';
import FadeInOnScroll from '@/components/ui/fadeInScroll';
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function PRS() {
    const target = 600000;
    const funded = 264353;
    const percentage = Math.round((funded / target) * 100);

    return (
        <section className="relative min-h-dvh bg-pink-50 font-questrial px-4 py-20 sm:px-6 lg:px-8 md:py-24 flex flex-col items-center justify-center">
            <FadeInOnScroll>
                <motion.div
                    className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ amount: 0.3 }}
                    transition={{ staggerChildren: 0.2 }}
                >
                    <motion.div
                        className="space-y-6"
                        variants={{
                            hidden: { opacity: 0, y: 50 },
                            visible: { opacity: 1, y: 0 },
                        }}
                    >
                        <h2 className="text-4xl">Proyek Rumah Surga</h2>
                        <p className="max-w-2xl mx-auto">
                            IWKZ e.V. is dedicated to fostering a vibrant Indonesian community
                            in Berlin. We provide a welcoming space for cultural exchange,
                            support, and collaboration.
                        </p>

                        {/* Donation Progress */}
                        <motion.div
                            className="mt-8"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex justify-between text-sm mb-2">
                                <span className="font-semibold text-gray-800">
                                    Donation Progress
                                </span>
                                <span className="text-gray-600">
                                    €<CountUp end={funded} duration={2} separator="," enableScrollSpy /> / €
                                    {target.toLocaleString()}
                                </span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                <motion.div
                                    className="bg-green-500 h-4"
                                    initial={{ width: "0%" }}
                                    whileInView={{ width: `${percentage}%` }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                ></motion.div>
                            </div>

                            <p className="mt-2 text-xs text-gray-500">
                                <CountUp end={percentage} duration={2} enableScrollSpy />% funded
                            </p>
                        </motion.div>

                        <div className="flex flex-wrap gap-4 mt-6">
                            <Button variant="outline" className="flex items-center gap-2">
                                <FaHeart className="text-red-500" />
                                Donate Now
                            </Button>
                            <Button
                                variant="ghost"
                                className="text-black border border-gray-400"
                            >
                                Learn More
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[450px] relative"
                        variants={{
                            hidden: { opacity: 0, x: 50 },
                            visible: { opacity: 1, x: 0 },
                        }}
                    >
                        <Image
                            src="/images/hero-bg.webp"
                            alt="Community photo"
                            fill
                            className="object-cover"
                            priority
                        />
                    </motion.div>
                </motion.div>
            </FadeInOnScroll>
        </section>
    );
}
