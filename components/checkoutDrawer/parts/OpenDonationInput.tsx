import type { CheckoutDrawerText } from '@/types/checkoutDrawer.types';

interface OpenDonationInputProps {
  customAmount: number;
  setCustomAmount: (amount: number) => void;
  t: CheckoutDrawerText;
}

export function OpenDonationInput({
  customAmount,
  setCustomAmount,
  t,
}: OpenDonationInputProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
        {t.donationAmount}
      </h3>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
          EUR
        </span>
        <input
          type="number"
          min="1"
          step="0.01"
          placeholder="0.00"
          value={customAmount || ''}
          onChange={(e) => setCustomAmount(parseFloat(e.target.value) || 0)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-16 pr-4 text-2xl font-bold text-gray-800 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>
    </div>
  );
}
