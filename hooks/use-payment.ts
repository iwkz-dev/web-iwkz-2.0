'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import type {
  PaymentConfigData,
  PaypalCheckoutRequest,
} from '@/types/donationApi';
import { fetchPaymentConfig, createPaypalCheckout } from '@/lib/donation-api';

export function usePayment() {
  const [config, setConfig] = useState<PaymentConfigData | null>(null);
  const [loading, setLoading] = useState(false);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchPaymentConfig()
      .then((res) => {
        if (!cancelled) setConfig(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load payment configuration');
      })
      .finally(() => {
        if (!cancelled) setConfigLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const calculatePaypalFee = useCallback(
    (subtotal: number) => {
      if (!config || !config.paypal) return { fee: 0, total: subtotal };
      const { fixFee, percentageFee } = config.paypal;
      // API now returns fee in EUR and percentage as plain percent (e.g. 2.5 => 2.5%)
      const fixFeeEuro = fixFee;
      const percentageRate = percentageFee / 100;
      // Total = (subtotal + fixFee) / (1 - rate)  to cover the fee
      const total = (subtotal + fixFeeEuro) / (1 - percentageRate);
      const fee = total - subtotal;
      return {
        fee: Math.round(fee * 100) / 100,
        total: Math.round(total * 100) / 100,
      };
    },
    [config]
  );

  const submitPaypalCheckout = useCallback(
    async (payload: PaypalCheckoutRequest) => {
      setLoading(true);
      try {
        const res = await createPaypalCheckout(payload);
        if (res.data.paypal_link) {
          window.location.href = res.data.paypal_link;
        } else {
          toast.error('No PayPal link received. Please try again.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Checkout failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    config,
    configLoading,
    loading,
    calculatePaypalFee,
    submitPaypalCheckout,
  };
}
