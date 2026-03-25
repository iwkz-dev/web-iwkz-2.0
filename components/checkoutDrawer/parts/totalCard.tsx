import { formatCurrency } from '@/lib/utils';
import type { CheckoutDrawerText } from '@/types/checkoutDrawer.types';

interface TotalCardProps {
  totalPrice: number;
  t: CheckoutDrawerText;
}

export function TotalCard({ totalPrice, t }: TotalCardProps) {
  if (totalPrice <= 0) {
    return null;
  }

  return (
    <div className="mb-3 rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-gray-500">{t.subtotal}</span>
        <span className="text-sm font-extrabold text-emerald-700 wrap-break-word">
          {formatCurrency(totalPrice)}
        </span>
      </div>
    </div>
  );
}
