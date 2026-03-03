'use client';

import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { X, Loader2, Copy, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useDonationStore } from '@/store/donation-store';
import { usePayment } from '@/hooks/use-payment';
import type { PaypalCheckoutItem } from '@/types/donationApi';
import { MarkdownRenderer } from '../ui/markdownRenderer';
import { QuantityCounter } from '../ui/quantityCounter';
import { PaymentTabs } from '../ui/paymentTabs';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CheckoutDrawer() {
  const {
    selectedPackage,
    drawerOpen,
    cartItems,
    customAmount,
    closeDrawer,
    setQuantity,
    setDonatorInfo,
    setCustomAmount,
    getTotalPrice,
    getTotalQuantity,
  } = useDonationStore();

  const {
    config,
    configLoading,
    loading,
    calculatePaypalFee,
    submitPaypalCheckout,
  } = usePayment();

  const [paymentTab, setPaymentTab] = useState<'bank' | 'paypal'>('paypal');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const totalPrice = getTotalPrice();
  const totalQuantity = getTotalQuantity();
  const { fee: paypalFee, total: paypalTotal } = calculatePaypalFee(totalPrice);

  useEffect(() => {
    if (config) {
      if (paymentTab === 'bank' && !config.postbank && config.paypal) {
        setPaymentTab('paypal');
      } else if (paymentTab === 'paypal' && !config.paypal && config.postbank) {
        setPaymentTab('bank');
      }
    }
  }, [config, paymentTab]);

  const singleItem = selectedPackage?.donationItems?.[0];
  const isFixedSingleItem = Boolean(
    selectedPackage &&
    selectedPackage.donationItems.length === 1 &&
    singleItem &&
    singleItem.price !== null &&
    singleItem.price > 1
  );

  const isSubpackageMode = Boolean(
    selectedPackage &&
    (selectedPackage.donationItems.length > 1 || isFixedSingleItem)
  );

  const isOpenDonation = Boolean(
    selectedPackage &&
    selectedPackage.donationItems.length === 1 &&
    (!singleItem || singleItem.price === null || singleItem.price <= 1)
  );

  const verwendungszweck = (() => {
    const sourceItems = isSubpackageMode
      ? cartItems.filter((item) => item.quantity > 0)
      : cartItems.slice(0, 1);
    if (!sourceItems.length) return '';
    return sourceItems
      .map((item) => {
        const info = item.donatorInfo?.trim();
        return info ? `${item.uniqueCode}-${info}` : item.uniqueCode;
      })
      .join('; ');
  })();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handlePaypalSubmit = async () => {
    if (totalPrice <= 0) {
      toast.error('Please select at least one item or enter an amount');
      return;
    }

    const missingInfo = isSubpackageMode
      ? cartItems.some(
          (item) =>
            item.requireDonatorInfo &&
            item.quantity > 0 &&
            !item.donatorInfo?.trim()
        )
      : (() => {
          const onlyItem = cartItems[0];
          if (!onlyItem) return false;
          if (!onlyItem.requireDonatorInfo) return false;
          return !onlyItem.donatorInfo?.trim();
        })();

    if (missingInfo) {
      toast.error('Please fill required Donator Info before paying.');
      return;
    }

    const items: PaypalCheckoutItem[] = [];

    if (isSubpackageMode) {
      cartItems
        .filter((item) => item.quantity > 0)
        .forEach((item) => {
          items.push({
            unique_code: item.uniqueCode,
            total_order: item.quantity,
            total_price: item.price * item.quantity,
            // Send donor info under both legacy and new key
            donator_info: item.donatorInfo?.trim(),
            description: item.donatorInfo?.trim(),
          });
        });
    } else if (selectedPackage) {
      const mainItem = selectedPackage.donationItems[0];
      items.push({
        unique_code: mainItem?.uniqueCode ?? '',
        total_order: 1,
        total_price: totalPrice,
        // Send donor info under both legacy and new key
        donator_info: cartItems[0]?.donatorInfo?.trim(),
        description: cartItems[0]?.donatorInfo?.trim(),
      });
    }

    await submitPaypalCheckout({
      total_order: totalQuantity,
      total_price: totalPrice,
      items,
    });
  };

  if (!selectedPackage) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-w-md transform transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl">
          {/* Handle bar */}
          <div className="sticky top-0 z-10 flex items-center justify-center bg-white px-6 pb-2 pt-4 rounded-t-3xl">
            <div className="h-1 w-10 rounded-full bg-gray-200" />
            <button
              onClick={closeDrawer}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-6 pb-8">
            {/* Title */}
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              {selectedPackage.title}
            </h2>

            {/* Description */}
            <MarkdownRenderer
              content={selectedPackage.description}
              className="mt-3 mb-6"
            />

            {/* Subpackage items */}
            {isSubpackageMode && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
                  Pilih Paket
                </h3>
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.uniqueCode}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium">
                          {formatCurrency(item.price)} / paket
                        </p>
                        {item.requireDonatorInfo && (
                          <div className="mt-2 space-y-1">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-600">
                              Donator Info required
                            </p>
                            <input
                              type="text"
                              value={item.donatorInfo || ''}
                              onChange={(e) =>
                                setDonatorInfo(item.uniqueCode, e.target.value)
                              }
                              placeholder="e.g. Family name, student name"
                              className="w-full rounded-lg border border-amber-200 bg-white px-3 py-2 text-sm focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                            />
                          </div>
                        )}
                      </div>
                      <QuantityCounter
                        quantity={item.quantity}
                        onQuantityChange={(qty) =>
                          setQuantity(item.uniqueCode, qty)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Open donation input */}
            {isOpenDonation && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
                  Jumlah Donasi
                </h3>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gray-400">
                    €
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={customAmount || ''}
                    onChange={(e) =>
                      setCustomAmount(parseFloat(e.target.value) || 0)
                    }
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pl-10 pr-4 text-2xl font-bold text-gray-800 outline-none transition-all focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>
              </div>
            )}

            {/* Total */}
            {totalPrice > 0 && (
              <div className="mb-6 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Subtotal
                  </span>
                  <span className="text-xl font-extrabold text-emerald-700">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Payment tabs */}
            <div className="mb-4">
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-400">
                Metode Pembayaran
              </h3>
              <PaymentTabs
                activeTab={paymentTab}
                onTabChange={setPaymentTab}
                bankDisabled={!config?.postbank}
                paypalDisabled={!config?.paypal}
              />
            </div>

            {/* Bank Transfer content */}
            {paymentTab === 'bank' && config && (
              <div className="mb-6 animate-fade-in rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
                <p className="mb-4 text-sm text-gray-500">
                  Transfer ke rekening berikut dan gunakan jumlah{' '}
                  <strong className="text-gray-800">
                    {formatCurrency(totalPrice)}
                  </strong>{' '}
                  sebagai nominal transfer.
                </p>
                {[
                  {
                    label: 'Bank',
                    value: config.postbank.bankName,
                  },
                  {
                    label: 'IBAN',
                    value: config.postbank.iban,
                  },
                  {
                    label: 'BIC',
                    value: config.postbank.bic,
                  },
                  {
                    label: 'Verwendungszweck',
                    value: verwendungszweck || 'Donasi',
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="mb-3 last:mb-0 flex items-center justify-between rounded-xl bg-white p-3 border border-gray-100"
                  >
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800 font-mono">
                        {value}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(value, label)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      {copiedField === label ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* PayPal content */}
            {paymentTab === 'paypal' && (
              <div className="mb-6 animate-fade-in">
                {configLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-300" />
                  </div>
                ) : config ? (
                  <>
                    {/* Fee breakdown */}
                    {totalPrice > 0 && (
                      <div className="mb-4 rounded-2xl border border-gray-100 bg-gray-50/50 p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="font-medium text-gray-700">
                            {formatCurrency(totalPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">
                            PayPal Fee{' '}
                            <span className="text-xs text-gray-400">
                              ({config.paypal.percentageFee.toFixed(2)}% +{' '}
                              {formatCurrency(config.paypal.fixFee)})
                            </span>
                          </span>
                          <span className="font-medium text-amber-600">
                            +{formatCurrency(paypalFee)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                          <span className="font-bold text-gray-800">Total</span>
                          <span className="font-extrabold text-emerald-700 text-lg">
                            {formatCurrency(paypalTotal)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Submit button */}
                    <button
                      type="button"
                      onClick={handlePaypalSubmit}
                      disabled={loading || totalPrice <= 0}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-emerald-500 to-teal-500 px-6 py-4 text-base font-bold text-white shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Pay with PayPal
                          <ArrowRight className="h-5 w-5" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <p className="text-center text-sm text-gray-400 py-4">
                    Payment configuration unavailable
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
