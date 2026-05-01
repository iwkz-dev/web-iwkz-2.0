'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';

import FadeInOnScroll from '@/components/ui/fadeInScroll';
import { loadRuntimeConfig } from '@/lib/runtime-config';
import type { IPrsDonationProgress } from '@/types/prsDonationProgress.types';
import DonationProgress from './_parts/DonationProgress';
import DonationActions from './_parts/DonationActions';
import PrsImage from './_parts/PrsImage';

export default function PRS({
  donationProgress,
}: {
  donationProgress: IPrsDonationProgress;
}) {
  const params = useParams();
  const locale = params.locale as string;

  const headline = donationProgress?.headline || '';
  const subHeadline = donationProgress?.subHeadline || '';
  const target = donationProgress?.targetDonation || 0;
  const funded = donationProgress?.currentDonation || 0;
  const payments = donationProgress?.Payments || [];
  const percentage = target ? Math.round((funded / target) * 100) : 0;
  const vzw = donationProgress?.VZW || 'prs';
  const [paypalHostId, setPaypalHostId] = useState('');
  const [paypalUrl, setPaypalUrl] = useState('');
  const [isDevelopment, setIsDevelopment] = useState(
    process.env.NODE_ENV === 'development'
  );

  useEffect(() => {
    let isMounted = true;

    const fetchConfig = async () => {
      try {
        const data = await loadRuntimeConfig();

        if (isMounted) {
          setPaypalHostId(data.paypalHostId || '');
          setPaypalUrl(data.paypalUrl || '');
          setIsDevelopment(Boolean(data.isDevelopment));
        }
      } catch {
        if (isMounted) {
          setPaypalHostId('');
          setPaypalUrl('');
        }
      }
    };

    fetchConfig();

    return () => {
      isMounted = false;
    };
  }, []);

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
            <h2 className="text-4xl">{headline}</h2>
            <p className="max-w-2xl mx-auto">{subHeadline}</p>

            <DonationProgress
              funded={funded}
              target={target}
              percentage={percentage}
            />

            <DonationActions
              paypalUrl={paypalUrl}
              paypalHostId={paypalHostId}
              isDevelopment={isDevelopment}
              vzw={vzw}
              locale={locale}
              payments={payments}
            />
          </motion.div>

          <PrsImage
            imageUrl={donationProgress?.image?.url || '/images/hero-bg.webp'}
          />
        </motion.div>
      </FadeInOnScroll>
    </section>
  );
}
