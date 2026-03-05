'use client';

import { Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, Loader2, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { getTranslations } from '@/lib/translations';

function CancelContent() {
  const params = useParams();
  const locale = params.locale as string;
  const t = getTranslations(locale);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md px-6">
        <div className="animate-fade-in text-center">
          {/* Error icon */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-red-100 to-orange-100">
            <XCircle className="h-12 w-12 text-red-400" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">
            {t.donationCancelPage.title}
          </h1>
          <p className="mt-3 text-base text-gray-500 leading-relaxed">
            {t.donationCancelPage.descriptionLine1}
            <br />
            {t.donationCancelPage.descriptionLine2}
          </p>

          {token && (
            <div className="mt-6 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400">
                {t.donationCancelPage.reference}{' '}
                <span className="font-mono text-gray-500">{token}</span>
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
            >
              <RefreshCw className="h-4 w-4" />
              {t.donationCancelPage.tryAgain}
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.donationCancelPage.backToHome}
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CancelPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </main>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
