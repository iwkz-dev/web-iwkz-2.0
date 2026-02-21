'use client';
import { useEffect, useState } from 'react';

import { IHeroComponent, IPage } from '@/types/page.types';
import { Button } from '@/components/ui/button';
import FadeInOnScroll from '@/components/ui/fadeInScroll';
import LightRays from '@/components/ui/lightRays/LightRays';

interface IHeroProps {
  heroContent: IHeroComponent;
}

export default function Hero(props: IHeroProps) {
  const heroContent = props.heroContent;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // Initial check
    setIsMobile(mql.matches);
    // Subscribe to changes
    mql.addEventListener('change', onChange);
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-dvh flex items-center justify-center px-4 font-questrial overflow-hidden"
    >
      <div
        className="absolute inset-0 z-0 h-full w-full overflow-hidden"
        style={{
          backgroundImage: `
      radial-gradient(circle at center, rgba(0,0,0,0) 25%, rgba(0,0,0,0.85) 100%),
      url(${heroContent.image.url})
    `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: isMobile ? 'scroll' : 'fixed',
          backgroundRepeat: 'no-repeat',
          backgroundBlendMode: 'overlay',
          filter: 'blur(5px)',
        }}
      />
      <div className="absolute inset-0 bg-black/60 z-0" />
      <div className="absolute inset-0 w-full h-full z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          className="custom-rays"
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>
      <FadeInOnScroll>
        <div className="relative z-10 text-center max-w-2xl space-y-6 m-auto">
          <h1 className="text-4xl md:text-5xl text-white">
            {heroContent.headline}
          </h1>
          <p className="text-lg md:text-xl leading-relaxed text-white">
            {heroContent.subHeadline}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild variant="ghost" className="text-white border">
              <a href="#services">See More</a>
            </Button>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
