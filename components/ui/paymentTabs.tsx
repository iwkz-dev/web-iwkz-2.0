'use client';

import { Building2, CreditCard } from 'lucide-react';

interface PaymentTabsProps {
  activeTab: 'bank' | 'paypal';
  onTabChange: (tab: 'bank' | 'paypal') => void;
  bankDisabled?: boolean;
  paypalDisabled?: boolean;
}

export function PaymentTabs({
  activeTab,
  onTabChange,
  bankDisabled = false,
  paypalDisabled = false,
}: PaymentTabsProps) {
  return (
    <div className="flex gap-2 rounded-2xl bg-gray-100 p-1.5">
      <button
        type="button"
        onClick={() => !bankDisabled && onTabChange('bank')}
        disabled={bankDisabled}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
          bankDisabled
            ? 'cursor-not-allowed opacity-40 text-gray-300'
            : activeTab === 'bank'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <Building2 className="h-4 w-4" />
        Bank Transfer
      </button>
      <button
        type="button"
        onClick={() => !paypalDisabled && onTabChange('paypal')}
        disabled={paypalDisabled}
        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
          paypalDisabled
            ? 'cursor-not-allowed opacity-40 text-gray-300'
            : activeTab === 'paypal'
              ? 'bg-white text-gray-800 shadow-sm'
              : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <CreditCard className="h-4 w-4" />
        PayPal
      </button>
    </div>
  );
}
