'use client';

import { IHeroComponent, IPage } from "@/types/page.types";
import { Button } from "@/components/ui/button";
import FadeInOnScroll from "@/components/ui/fadeInScroll";

interface IHeroProps {
    heroContent: IPage
}

export default function Hero(props: IHeroProps) {
    const heroContent = props.heroContent.content[0] as IHeroComponent;

    return (
        <section className="relative min-h-dvh flex items-center justify-center px-4 font-questrial overflow-hidden">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
      radial-gradient(circle at center, rgba(0,0,0,0) 25%, rgba(0,0,0,0.85) 100%),
      url(${heroContent.image.url})
    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'overlay',
                    filter: 'blur(5px)',
                }}
            />
            <div className="absolute inset-0 bg-black/60 z-0" />
            <FadeInOnScroll>
                <div className="relative z-10 text-center max-w-2xl space-y-6 m-auto">
                    <h1 className="text-4xl md:text-5xl text-white">
                        {heroContent.headline}
                    </h1>
                    <p className="text-lg md:text-xl leading-relaxed text-white">
                        {heroContent.subHeadline}
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
