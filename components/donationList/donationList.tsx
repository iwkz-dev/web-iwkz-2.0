'use client';

import type { DonationPackageData } from '@/types/donationApi';
import { DonationCard } from './donationCard/donationCard';
import FadeInOnScroll from '../ui/fadeInScroll';

interface DonationListProps {
  donationData: DonationPackageData;
}

export function DonationList({ donationData }: DonationListProps) {
  const { headline, subHeadline, donationPackages } = donationData;
  return (
    <section
      id="donation-package"
      className="relative min-h-dvh bg-primary-foreground px-4 py-30 font-questrial flex flex-col items-center justify-center"
      style={{ backgroundColor: '#e9eef6' }}
    >
      <FadeInOnScroll>
        <div className="max-w-5xl mx-auto text-center space-y-4 mb-12">
          <h2 className="text-4xl">{headline}</h2>
          <p className="text-lg">{subHeadline}</p>
        </div>
      </FadeInOnScroll>
      <div className="w-full max-w-5xl h-screen">
        <div className="flex items-center gap-2"></div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {donationPackages.map((pkg, index) => (
            <DonationCard key={pkg.id} donationPackage={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
