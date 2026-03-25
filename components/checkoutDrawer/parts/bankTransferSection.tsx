import { Check, Copy } from 'lucide-react';
import type { PaymentConfigData } from '@/types/donationApi';
import { formatCurrency } from '@/lib/utils';
import type { CheckoutDrawerText } from '@/types/checkoutDrawer.types';

interface BankTransferSectionProps {
  config: PaymentConfigData;
  totalPrice: number;
  verwendungszweck: string;
  copiedField: string | null;
  onCopy: (value: string, label: string) => void;
  t: CheckoutDrawerText;
}

export function BankTransferSection({
  config,
  totalPrice,
  verwendungszweck,
  copiedField,
  onCopy,
  t,
}: BankTransferSectionProps) {
  return (
    <div className="mb-4 animate-fade-in rounded-lg border border-gray-100 bg-gray-50/50 p-3">
      <p className="mb-3 text-xs text-gray-500 wrap-break-word">
        {t.bankTransferInstructionPrefix}{' '}
        <strong className="text-gray-800 wrap-break-word">
          {formatCurrency(totalPrice)}
        </strong>{' '}
        {t.bankTransferInstructionSuffix}
      </p>
      {[
        {
          label: t.ownerName,
          value: config.postbank.ownerName,
        },
        {
          label: t.bank,
          value: config.postbank.bankName,
        },
        {
          label: t.iban,
          value: config.postbank.iban,
        },
        {
          label: t.bic,
          value: config.postbank.bic,
        },
        {
          label: t.usagePurpose,
          value: verwendungszweck || t.donationFallback,
        },
      ].map(({ label, value }) => (
        <div
          key={label}
          className="mb-2 last:mb-0 flex items-center justify-between rounded-lg bg-white p-2 border border-gray-100 gap-2"
        >
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              {label}
            </p>
            <p className="text-xs font-semibold text-gray-800 font-mono wrap-break-word">
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onCopy(value, label)}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
          >
            {copiedField === label ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
