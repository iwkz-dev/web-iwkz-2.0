import type { PaymentConfigData } from '@/types/donationApi';
import { formatCurrency } from '@/lib/utils';
import { LabelValueCopyRow } from '@/components/ui/labelValueCopyRow';
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
        <LabelValueCopyRow
          key={label}
          label={label}
          value={value}
          isCopied={copiedField === label}
          onCopy={() => onCopy(value, label)}
        />
      ))}
    </div>
  );
}
