'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import { Info, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { LabelValueCopyRow } from '@/components/ui/labelValueCopyRow';
import type { IPayment } from '@/types/prsDonationProgress.types';

interface DonationActionsProps {
  paypalUrl: string;
  paypalHostId: string;
  isDevelopment: boolean;
  vzw: string;
  locale: string;
  payments?: IPayment[];
}

export default function DonationActions({
  paypalUrl,
  paypalHostId,
  isDevelopment,
  vzw,
  locale,
  payments = [],
}: DonationActionsProps) {
  const t = useTranslations('prs');
  const router = useRouter();
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const flattenedPaymentRows = useMemo(() => {
    return payments.map((payment) => {
      const rows = payment.paymentInfo
        .filter((node) => node.type === 'paragraph')
        .map((node) => {
          const rawText = node.children
            .map((child) => child.text)
            .join('')
            .trim();

          if (!rawText) return null;

          const separatorIndex = rawText.indexOf(':');
          if (separatorIndex === -1) {
            return {
              label: payment.paymentType,
              value: rawText,
            };
          }

          const label = rawText.slice(0, separatorIndex).trim();
          const value = rawText.slice(separatorIndex + 1).trim();

          return {
            label: label || payment.paymentType,
            value: value || rawText,
          };
        })
        .filter((row): row is { label: string; value: string } => row !== null);

      return {
        id: payment.id,
        paymentType: payment.paymentType,
        description: payment.description?.trim() || '',
        rows,
      };
    });
  }, [payments]);

  const handleCopy = async (value: string, key: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((prev) => (prev === key ? null : prev));
      }, 1600);
    } catch {
      setCopiedKey(null);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-6 items-center">
        <div className="flex items-stretch">
          <form action={paypalUrl} method="post" target="_blank">
            {isDevelopment && (
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
              className={
                flattenedPaymentRows.length > 0
                  ? 'rounded-r-none border-r-0 flex items-center gap-2'
                  : 'flex items-center gap-2'
              }
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
              {t('donateNow')}
            </Button>
          </form>
          {flattenedPaymentRows.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-l-none"
              onClick={() => setIsInfoOpen(true)}
              aria-label={t('paymentInfoButton')}
              title={t('paymentInfoButton')}
            >
              <Info className="text-gray-700" />
            </Button>
          )}
        </div>
        <Button
          variant="ghost"
          className="text-black border border-gray-400"
          onClick={() => router.push(`/${locale}/donation`)}
        >
          {t('viewOtherDonations')}
        </Button>
      </div>

      <AnimatePresence>
        {isInfoOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsInfoOpen(false)}
          >
            <motion.div
              className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              onClick={(event) => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={t('paymentInfoTitle')}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {t('paymentInfoTitle')}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t('paymentInfoSubtitle')}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setIsInfoOpen(false)}
                  aria-label={t('closeDialog')}
                >
                  <X className="text-gray-600" />
                </Button>
              </div>

              <div className="max-h-[62vh] space-y-3 overflow-auto pr-1">
                {flattenedPaymentRows.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-3"
                  >
                    <p className="mb-2 text-sm font-semibold text-gray-800">
                      {payment.paymentType}
                    </p>
                    {payment.rows.map((row, rowIndex) => {
                      const rowKey = `${payment.id}-${rowIndex}`;
                      const isCopied = copiedKey === rowKey;

                      return (
                        <LabelValueCopyRow
                          key={rowKey}
                          label={row.label}
                          value={row.value}
                          isCopied={isCopied}
                          onCopy={() => handleCopy(row.value, rowKey)}
                        />
                      );
                    })}
                    {payment.description && (
                      <LabelValueCopyRow
                        label={t('paymentDescriptionLabel')}
                        value={payment.description}
                        isCopied={copiedKey === `${payment.id}-description`}
                        onCopy={() =>
                          handleCopy(
                            payment.description,
                            `${payment.id}-description`
                          )
                        }
                      />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
