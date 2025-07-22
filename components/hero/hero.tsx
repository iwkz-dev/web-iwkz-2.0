'use client';

import { Button } from "../ui/button";
import FadeInOnScroll from "../ui/fadeInScroll";

export default function Hero() {
    return (
        <section className="relative min-h-dvh flex items-center justify-center px-4 bg-[url('/images/hero-bg.webp')] bg-cover bg-center font-questrial bg-fixed">
            <div className="absolute inset-0 bg-black/60 z-0" />
            <FadeInOnScroll>
                <div className="relative z-10 text-center max-w-2xl space-y-6">
                    <h1 className="text-4xl md:text-5xl text-white">
                        Welcome to IWKZ e.V. Berlin
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed text-white">
                        At IWKZ e.V. Berlin, we unite the Indonesian Islamic community, fostering connections and cultural exchange. Join us in celebrating our rich heritage and vibrant presence in Berlin.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            variant="outline"
                        >
                            Proyek Rumah Surga
                        </Button>

                        <Button
                            variant="ghost"
                            className="text-white border"
                        >
                            Learn More
                        </Button>
                    </div>

                </div>
            </FadeInOnScroll>
        </section >
    );
}
