'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useTranslations } from 'next-intl';

interface DonationProgressProps {
  funded: number;
  target: number;
  percentage: number;
}

export default function DonationProgress({
  funded,
  target,
  percentage,
}: DonationProgressProps) {
  const t = useTranslations('prs');

  return (
    <motion.div
      className="mt-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex justify-between text-sm mb-2">
        <span className="font-semibold text-gray-800">
          {t('donationProgress')}
        </span>
        <span className="text-gray-600">
          €
          <CountUp end={funded} duration={2} separator="," enableScrollSpy /> /
          €{target.toLocaleString()}
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
        {'% ' + t('funded')}
      </p>
    </motion.div>
  );
}
