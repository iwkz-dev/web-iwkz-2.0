import { ArrowRight, Loader2 } from 'lucide-react';
import type { PaymentConfigData } from '@/types/donationApi';
import { formatCurrency } from '@/lib/utils';
import type { CheckoutDrawerText } from '@/types/checkoutDrawer.types';

interface PaypalSectionProps {
  configLoading: boolean;
  config: PaymentConfigData | null;
  totalPrice: number;
  paypalFee: number;
  paypalTotal: number;
  loading: boolean;
  onSubmit: () => void;
  t: CheckoutDrawerText;
}

export function PaypalSection({
  configLoading,
  config,
  totalPrice,
  paypalFee,
  paypalTotal,
  loading,
  onSubmit,
  t,
}: PaypalSectionProps) {
  return (
    <div className="mb-4 animate-fade-in">
      {configLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
        </div>
      ) : config ? (
        <>
          {totalPrice > 0 && (
            <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 space-y-2">
              <div className="flex justify-between text-xs gap-2">
                <span className="text-gray-500">{t.subtotal}</span>
                <span className="font-medium text-gray-700 wrap-break-word">
                  {formatCurrency(totalPrice)}
                </span>
              </div>
              <div className="flex justify-between text-xs gap-2">
                <span className="text-gray-500 flex-1">
                  {t.paypalFee}{' '}
                  <span className="text-xs text-gray-400">
                    ({config.paypal.percentageFee.toFixed(2)}% +{' '}
                    {formatCurrency(config.paypal.fixFee)})
                  </span>
                </span>
                <span className="font-medium text-amber-600">
                  +{formatCurrency(paypalFee)}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-1 flex justify-between items-center gap-2">
                <span className="font-bold text-gray-800 text-xs">
                  {t.total}
                </span>
                <span className="font-extrabold text-emerald-700 text-sm wrap-break-word">
                  {formatCurrency(paypalTotal)}
                </span>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || totalPrice <= 0}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-xs">{t.processing}</span>
              </>
            ) : (
              <>
                <span className="text-xs">{t.payWithPaypal}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </>
      ) : (
        <p className="text-center text-sm text-gray-400 py-4">
          {t.paymentConfigUnavailable}
        </p>
      )}
    </div>
  );
}
