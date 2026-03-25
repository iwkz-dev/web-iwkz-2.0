import { QuantityCounter } from '@/components/ui/quantityCounter';
import { formatCurrency } from '@/lib/utils';
import type { SubpackageListProps } from '@/types/checkoutDrawer.types';

export function SubpackageList({
  items,
  t,
  setQuantity,
  setDonatorInfo,
}: SubpackageListProps) {
  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
        {t.choosePackage}
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.uniqueCode}
            className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50"
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">
                {item.title}
              </p>
              <p className="text-xs text-emerald-600 font-medium wrap-break-word">
                {formatCurrency(item.price)} / {t.perPackage}
              </p>
              {item.requireDonatorInfo && (
                <div className="mt-1 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                    {t.donatorInfoRequired}
                  </p>
                  <input
                    type="text"
                    value={item.donatorInfo || ''}
                    onChange={(e) =>
                      setDonatorInfo(item.uniqueCode, e.target.value)
                    }
                    placeholder={t.donatorInfoPlaceholder}
                    className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                  />
                </div>
              )}
            </div>
            <QuantityCounter
              quantity={item.quantity}
              onQuantityChange={(qty) => setQuantity(item.uniqueCode, qty)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
