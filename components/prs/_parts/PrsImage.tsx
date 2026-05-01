'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface PrsImageProps {
  imageUrl: string;
}

export default function PrsImage({ imageUrl }: PrsImageProps) {
  const t = useTranslations('prs');

  return (
    <motion.div
      className="relative w-full max-w-64 sm:max-w-72 md:max-w-80 lg:max-w-96 aspect-square mx-auto"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Image
        src={imageUrl}
        alt={t('imageAlt')}
        fill
        className="object-fit"
        priority
      />
    </motion.div>
  );
}
