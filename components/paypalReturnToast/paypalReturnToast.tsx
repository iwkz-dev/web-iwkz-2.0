'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { capturePaypalPayment } from '@/lib/donation-api';

const PAYPAL_QUERY_KEYS = ['paypal_status', 'token', 'PayerID', 'ba_token'];

export function PaypalReturnToast() {
  const tCheckout = useTranslations('checkoutDrawer');
  const tCancel = useTranslations('donationCancelPage');
  const tSuccess = useTranslations('donationSuccessPage');
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const handledRef = useRef<string | null>(null);

  useEffect(() => {
    const status = searchParams.get('paypal_status');
    const token = searchParams.get('token');
    const payerId = searchParams.get('PayerID');

    if (!status || (status !== 'success' && status !== 'cancel')) {
      return;
    }

    const flowKey = `${status}:${token ?? ''}:${payerId ?? ''}`;
    if (handledRef.current === flowKey) {
      return;
    }
    handledRef.current = flowKey;

    const clearPaypalParams = () => {
      const nextParams = new URLSearchParams(searchParams.toString());
      PAYPAL_QUERY_KEYS.forEach((key) => nextParams.delete(key));
      const nextQuery = nextParams.toString();
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    };

    const handleReturn = async () => {
      if (status === 'cancel') {
        toast.error(tCancel('title'), {
          description: (
            <p className="text-sm text-gray-500 leading-relaxed">
              {tCancel('descriptionLine1')}
              <br />
              {tCancel('descriptionLine2')}
            </p>
          ),
        });
        clearPaypalParams();
        return;
      }

      if (!token) {
        toast.error(tCheckout('paypalReturnVerificationError'), {
          description: tCheckout('contactSupportMessage'),
        });
        clearPaypalParams();
        return;
      }

      try {
        const res = await capturePaypalPayment({ token });
        if (res.ok) {
          toast.success(tCheckout('paypalReturnSuccess'), {
            description: (
              <div>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  جَزَاكَ ٱللَّٰهُ خَيْرًا
                </p>
                <p className="mt-1 text-xs text-emerald-500">
                  Jazāk Allāhu Khayran
                </p>
                <p className="mt-1 text-xs text-emerald-500">
                  {tSuccess('successDescriptionLine2')}
                </p>
              </div>
            ),
          });
        } else {
          toast.error(tCheckout('paypalReturnVerificationError'), {
            description: tCheckout('contactSupportMessage'),
          });
        }
      } catch {
        toast.error(tCheckout('paypalReturnVerificationError'), {
          description: tCheckout('contactSupportMessage'),
        });
      }

      clearPaypalParams();
    };

    handleReturn();
  }, [pathname, router, searchParams, tCancel, tCheckout, tSuccess]);

  return null;
}
