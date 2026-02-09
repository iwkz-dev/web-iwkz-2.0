'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function FadeInOnScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2 }); // triggers when 20% visible
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start('visible');
    } else {
      controls.start('hidden'); // fade out when not in view
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
