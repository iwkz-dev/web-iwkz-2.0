'use client';

import { useEffect, useState } from 'react';

export function Animated404() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative select-none" aria-hidden="true">
      <span
        className={`block text-[7rem] md:text-[10rem] font-light leading-none tracking-tight text-primary/20 font-mono transition-all duration-1000 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: '200ms' }}
      >
        404
      </span>
    </div>
  );
}
