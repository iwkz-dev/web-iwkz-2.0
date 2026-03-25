import type { SingleDonatorInfoProps } from '@/types/checkoutDrawer.types';

export function SingleDonatorInfoField({
  item,
  t,
  setDonatorInfo,
}: SingleDonatorInfoProps) {
  if (!item?.requireDonatorInfo) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-600">
        {t.donatorInfoRequired}
      </h3>
      <input
        type="text"
        value={item.donatorInfo || ''}
        onChange={(e) => setDonatorInfo(item.uniqueCode, e.target.value)}
        placeholder={t.donatorInfoPlaceholder}
        className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
      />
    </div>
  );
}
