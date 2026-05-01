'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

import type {
  IPayment,
  IPaymentInfoNode,
} from '@/types/prsDonationProgress.types';

function BlocksRenderer({ nodes }: { nodes: IPaymentInfoNode[] }) {
  return (
    <div className="space-y-1">
      {nodes.map((node, i) => {
        if (node.type === 'paragraph') {
          return (
            <p key={i} className="text-sm text-gray-700">
              {node.children.map((child, j) => {
                let content: React.ReactNode = child.text;
                if (child.bold) content = <strong key={j}>{content}</strong>;
                if (child.italic) content = <em key={j}>{content}</em>;
                if (child.code)
                  content = (
                    <code
                      key={j}
                      className="bg-gray-100 rounded px-1 font-mono text-xs"
                    >
                      {content}
                    </code>
                  );
                return <span key={j}>{content}</span>;
              })}
            </p>
          );
        }
        return null;
      })}
    </div>
  );
}

function PaymentMethodItem({ payment }: { payment: IPayment }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <span>{payment.paymentType}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 bg-white">
              <BlocksRenderer nodes={payment.paymentInfo} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface PaymentMethodsProps {
  payments: IPayment[];
}

export default function PaymentMethods({ payments }: PaymentMethodsProps) {
  const t = useTranslations('prs');

  if (!payments || payments.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold text-gray-700 mb-3">
        {t('manualDonation')}
      </p>
      <div className="space-y-2">
        {payments.map((payment) => (
          <PaymentMethodItem key={payment.id} payment={payment} />
        ))}
      </div>
    </div>
  );
}
