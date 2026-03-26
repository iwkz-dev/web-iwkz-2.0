'use client';

import { useTranslations } from 'next-intl';
import { Heart, Users, Target, ChevronRight } from 'lucide-react';
import type { DonationPackage } from '@/types/donationApi';
import { useDonationStore } from '@/store/donation-store';

interface DonationCardProps {
  donationPackage: DonationPackage;
  index: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getSnippet(markdown: string, maxLength = 100): string {
  // Strip markdown formatting for snippet
  const plain = markdown
    .replace(/[#*_~`>\[\]()!|-]/g, '')
    .replace(/\n+/g, ' ')
    .trim();
  if (plain.length <= maxLength) return plain;
  return plain.slice(0, maxLength).trim() + '…';
}

export function DonationCard({
  donationPackage: pkg,
  index,
}: DonationCardProps) {
  const t = useTranslations('donationCard');
  const openDrawer = useDonationStore((s) => s.openDrawer);

  const totalDonation = pkg.donationItems.reduce(
    (sum, item) => sum + (item.total_donation ?? 0),
    0
  );
  const totalOrder = pkg.donationItems.reduce(
    (sum, item) => sum + (item.total_order ?? 0),
    0
  );
  const targetDonation = pkg.donationItems.reduce(
    (sum, item) => sum + (item.targetDonation ?? 0),
    0
  );

  const hasTarget = targetDonation > 0;
  const progress = hasTarget
    ? Math.min((totalDonation / targetDonation) * 100, 100)
    : 0;

  return (
    <button
      onClick={() => openDrawer(pkg)}
      className="group relative flex flex-col w-full text-left rounded-4xl bg-white border border-slate-100 p-6 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-900/5 hover:-translate-y-1 active:scale-[0.98] overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Top row: Icon & Title */}
      <div className="flex flex-col gap-4 mb-4">
        <div className="flex items-start justify-between">
          {pkg.image?.url ? (
            <div className="h-14 w-14 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-slate-100 transition-transform duration-300 group-hover:scale-105">
              <img
                src={pkg.image.url}
                alt={pkg.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-teal-50 to-emerald-50 text-emerald-600 transition-transform duration-300 group-hover:scale-105 group-hover:from-teal-100 group-hover:to-emerald-100 shrink-0">
              <Heart className="h-6 w-6" />
            </div>
          )}

          {/* Subpackage count badge */}
          {pkg.donationItems.length > 1 && (
            <div className="flex h-7 px-3 items-center justify-center rounded-full bg-linear-to-r from-amber-400 to-orange-400 text-xs font-bold text-white shadow-md">
              {pkg.donationItems.length} {t('choices')}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {pkg.title}
          </h3>
          <p className="text-sm font-medium text-slate-500 line-clamp-2 leading-relaxed h-10">
            {getSnippet(pkg.description)}
          </p>
        </div>
      </div>

      {/* Spacer to push progress/footer down */}
      <div className="mt-auto pt-4 flex flex-col gap-5 border-t border-slate-50">
        {/* Progress bar */}
        {hasTarget ? (
          <div>
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Target className="h-3.5 w-3.5 text-emerald-500" />
                {formatCurrency(targetDonation)}
              </span>
              <span className="text-emerald-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-linear-to-r from-teal-400 to-emerald-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : (
          // Placeholder if no target to keep card heights uniform
          <div className="h-8.5 flex items-center">
            <span className="text-xs font-medium text-slate-400">
              {t('openDonation')}
            </span>
          </div>
        )}

        {/* Footer stats */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              {t('collected')}
            </span>
            <span className="text-sm font-bold text-emerald-700">
              {formatCurrency(totalDonation)}
            </span>
          </div>

          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
              {t('donors')}
            </span>
            <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
              <Users className="h-4 w-4 text-emerald-500/70" />
              {totalOrder}
            </span>
          </div>
        </div>
      </div>

      {/* Decorative hover chevron */}
      <div className="absolute top-6 right-6 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}
