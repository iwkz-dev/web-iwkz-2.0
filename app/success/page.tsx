'use client';

import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, XCircle, ArrowLeft } from 'lucide-react';
import { capturePaypalPayment } from '@/lib/donation-api';
import Link from 'next/link';
import { getTranslations } from '@/lib/translations';

type CaptureStatus = 'loading' | 'success' | 'error';

function SuccessContent() {
  const params = useParams();
  const locale = params.locale as string;
  const t = getTranslations(locale);
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<CaptureStatus>('loading');

  useEffect(() => {
    const capturePaypalPaymentWithToken = async () => {
      if (!token) {
        setStatus('error');
        return;
      }

      capturePaypalPayment({ token })
        .then((res) => {
          if (res.ok) {
            setStatus('success');
          } else {
            setStatus('error');
          }
        })
        .catch(() => {
          setStatus('error');
        });
    };

    capturePaypalPaymentWithToken();
  }, [token]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto w-full max-w-md px-6">
        {status === 'loading' && (
          <div className="animate-fade-in text-center">
            <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-30" />
              <div className="absolute inset-2 rounded-full bg-emerald-50" />
              <Loader2 className="relative h-10 w-10 animate-spin text-emerald-500" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {t.donationSuccessPage.loadingTitle}
            </h1>
            <p className="mt-3 text-sm text-gray-400">
              {t.donationSuccessPage.loadingDescription}
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="animate-fade-in text-center">
            {/* Celebration background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-emerald-200/30 blur-3xl animate-pulse" />
              <div className="absolute top-1/3 right-1/4 h-24 w-24 rounded-full bg-amber-200/30 blur-3xl animate-pulse delay-500" />
              <div className="absolute bottom-1/3 left-1/3 h-28 w-28 rounded-full bg-teal-200/30 blur-3xl animate-pulse delay-1000" />
            </div>

            <div className="relative">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-emerald-400 to-teal-500 shadow-lg shadow-emerald-500/30">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>

              <h1 className="text-3xl font-extrabold text-gray-900">
                {t.donationSuccessPage.successTitle}
              </h1>
              <p className="mt-3 text-base text-gray-500 leading-relaxed">
                {t.donationSuccessPage.successDescriptionLine1}
                <br />
                {t.donationSuccessPage.successDescriptionLine2}
              </p>

              <div className="mt-8 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 border border-emerald-100 p-5">
                <p className="text-sm text-emerald-700 font-medium">
                  جَزَاكَ ٱللَّٰهُ خَيْرًا
                </p>
                <p className="mt-1 text-xs text-emerald-500">
                  Jazāk Allāhu Khayran
                </p>
              </div>

              <Link
                href="/"
                className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98]"
              >
                <ArrowLeft className="h-4 w-4" />
                {t.donationSuccessPage.backToHome}
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="animate-fade-in text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50">
              <XCircle className="h-12 w-12 text-red-400" />
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              {t.donationSuccessPage.errorTitle}
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              {t.donationSuccessPage.errorDescription}
            </p>
            <Link
              href="/"
              className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-8 py-4 text-sm font-bold text-gray-700 shadow-sm transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.donationSuccessPage.backToHome}
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
