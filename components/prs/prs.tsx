'use client';

import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

import { Button } from '@/components/ui/button';
import { FaHeart } from 'react-icons/fa';
import FadeInOnScroll from '@/components/ui/fadeInScroll';
import { getTranslations } from '@/lib/translations';

export default function PRS({ donationProgress }: { donationProgress: any }) {
  const router = useRouter();
  const params = useParams();
  const locale = params.locale as string;
  const t = getTranslations(locale);

  const headline = donationProgress?.headline || '';
  const subHeadline = donationProgress?.subHeadline || '';
  const target = donationProgress?.targetDonation || 0;
  const funded = donationProgress?.currentDonation || 0;
  const percentage = target ? Math.round((funded / target) * 100) : 0;
  const vzw = donationProgress?.VZW || 'prs';

  const paypalHostId =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_PAYPAL_HOST_ID_DEV || ''
      : process.env.NEXT_PUBLIC_PAYPAL_HOST_ID || '';

  const paypalUrl =
    process.env.NODE_ENV === 'development'
      ? process.env.NEXT_PUBLIC_PAYPAL_SANDBOX_URL || ''
      : process.env.NEXT_PUBLIC_PAYPAL_PRODUCTION_URL || '';

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

            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-800">
                  {t.prs.donationProgress}
                </span>
                <span className="text-gray-600">
                  €
                  <CountUp
                    end={funded}
                    duration={2}
                    separator=","
                    enableScrollSpy
                  />{' '}
                  / €{target.toLocaleString()}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <motion.div
                  className="bg-green-500 h-4"
                  initial={{ width: '0%' }}
                  whileInView={{ width: `${percentage}%` }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                ></motion.div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                <CountUp end={percentage} duration={2} enableScrollSpy />
                {'% ' + t.prs.funded}
              </p>
            </motion.div>

            <div className="flex flex-wrap gap-4 mt-6">
              <form action={paypalUrl} method="post" target="_blank">
                {process.env.NODE_ENV === 'development' && (
                  <>
                    <input type="hidden" name="cmd" value="_s-xclick" />
                    <input
                      type="hidden"
                      name="hosted_button_id"
                      value={paypalHostId}
                    />
                    <input type="hidden" name="item_name" value={vzw} />
                  </>
                )}
                <Button
                  type="submit"
                  name="submit"
                  variant="outline"
                  className="flex items-center gap-2 "
                >
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'loop',
                      ease: 'easeInOut',
                    }}
                  >
                    <FaHeart className="text-red-500" />
                  </motion.div>
                  {t.prs.donateNow}
                </Button>
              </form>
              <Button
                variant="ghost"
                className="text-black border border-gray-400"
                onClick={() => router.push(`/${locale}/donation`)}
              >
                {t.prs.viewOtherDonations}
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="w-full h-62.5 sm:h-75 md:h-100 lg:h-112.5 relative"
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Image
              src="/images/hero-bg.webp"
              alt={t.prs.imageAlt}
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
