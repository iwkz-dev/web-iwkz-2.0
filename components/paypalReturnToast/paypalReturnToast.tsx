'use client';

import { useEffect, useRef } from 'react';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { toast } from 'sonner';
import { capturePaypalPayment } from '@/lib/donation-api';
import { getTranslations } from '@/lib/translations';

const PAYPAL_QUERY_KEYS = ['paypal_status', 'token', 'PayerID', 'ba_token'];

export function PaypalReturnToast() {
  const params = useParams();
  const locale = params.locale as string;
  const t = getTranslations(locale);
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
        toast.error(t.donationCancelPage.title, {
          description: (
            <p className="text-sm text-gray-500 leading-relaxed">
              {t.donationCancelPage.descriptionLine1}
              <br />
              {t.donationCancelPage.descriptionLine2}
            </p>
          ),
        });
        clearPaypalParams();
        return;
      }

      if (!token) {
        toast.error(t.checkoutDrawer.paypalReturnVerificationError, {
          description: t.checkoutDrawer.contactSupportMessage,
        });
        clearPaypalParams();
        return;
      }

      try {
        const res = await capturePaypalPayment({ token });
        if (res.ok) {
          toast.success(t.checkoutDrawer.paypalReturnSuccess, {
            description: (
              <div>
                <p className="mt-1 text-sm font-medium text-emerald-700">
                  جَزَاكَ ٱللَّٰهُ خَيْرًا
                </p>
                <p className="mt-1 text-xs text-emerald-500">
                  Jazāk Allāhu Khayran
                </p>
                <p className="mt-1 text-xs text-emerald-500">
                  {t.donationSuccessPage.successDescriptionLine2}
                </p>
              </div>
            ),
          });
        } else {
          toast.error(t.checkoutDrawer.paypalReturnVerificationError, {
            description: t.checkoutDrawer.contactSupportMessage,
          });
        }
      } catch {
        toast.error(t.checkoutDrawer.paypalReturnVerificationError, {
          description: t.checkoutDrawer.contactSupportMessage,
        });
      }

      clearPaypalParams();
    };

    handleReturn();
  }, [pathname, router, searchParams, t]);

  return null;
}
