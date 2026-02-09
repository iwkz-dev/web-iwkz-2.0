'use client';

import { useEffect, useState } from 'react';

export function MosqueSilhouette() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className={`transition-all duration-1000 ease-out ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      aria-hidden="true"
    >
      <svg
        width="160"
        height="100"
        viewBox="0 0 160 100"
        fill="none"
        className="text-primary/15"
      >
        {/* Left minaret */}
        <rect x="18" y="30" width="8" height="70" fill="currentColor" />
        <rect x="16" y="24" width="12" height="8" rx="1" fill="currentColor" />
        {/* Left minaret cap */}
        <ellipse cx="22" cy="22" rx="4" ry="4" fill="currentColor" />
        <line
          x1="22"
          y1="12"
          x2="22"
          y2="18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Left crescent */}
        <circle cx="22" cy="11" r="2.5" fill="currentColor" />
        <circle
          cx="23"
          cy="10.5"
          r="2"
          className="text-background"
          fill="currentColor"
        />

        {/* Main dome */}
        <path d="M 50 60 Q 50 20 80 16 Q 110 20 110 60" fill="currentColor" />
        <rect x="50" y="58" width="60" height="42" fill="currentColor" />

        {/* Dome crescent */}
        <line
          x1="80"
          y1="4"
          x2="80"
          y2="12"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <circle cx="80" cy="3" r="2.5" fill="currentColor" />
        <circle
          cx="81"
          cy="2.5"
          r="2"
          className="text-background"
          fill="currentColor"
        />

        {/* Door arch */}
        <path
          d="M 70 100 L 70 78 Q 70 68 80 68 Q 90 68 90 78 L 90 100"
          className="text-background"
          fill="currentColor"
        />

        {/* Windows */}
        <ellipse
          cx="63"
          cy="76"
          rx="4"
          ry="6"
          className="text-background"
          fill="currentColor"
        />
        <ellipse
          cx="97"
          cy="76"
          rx="4"
          ry="6"
          className="text-background"
          fill="currentColor"
        />

        {/* Right minaret */}
        <rect x="134" y="30" width="8" height="70" fill="currentColor" />
        <rect x="132" y="24" width="12" height="8" rx="1" fill="currentColor" />
        {/* Right minaret cap */}
        <ellipse cx="138" cy="22" rx="4" ry="4" fill="currentColor" />
        <line
          x1="138"
          y1="12"
          x2="138"
          y2="18"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        {/* Right crescent */}
        <circle cx="138" cy="11" r="2.5" fill="currentColor" />
        <circle
          cx="139"
          cy="10.5"
          r="2"
          className="text-background"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
