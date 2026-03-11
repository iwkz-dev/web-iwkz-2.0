'use client';

import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { X, Loader2, Copy, Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { useDonationStore } from '@/store/donation-store';
import { usePayment } from '@/hooks/use-payment';
import type { PaypalCheckoutItem } from '@/types/donationApi';
import { getTranslations } from '@/lib/translations';
import { MarkdownRenderer } from '../ui/markdownRenderer';
import { QuantityCounter } from '../ui/quantityCounter';
import { PaymentTabs } from '../ui/paymentTabs';

const scrollHideStyle = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function CheckoutDrawer() {
  const params = useParams();
  const locale = params.locale as string;
  const t = getTranslations(locale);

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
  const [dragStartY, setDragStartY] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragVelocity, setDragVelocity] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const lastDragYRef = useRef(0);
  const lastDragTimeRef = useRef(0);
  const isDragging = dragStartY !== 0;

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
      toast.success(t.checkoutDrawer.copiedToClipboard);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error(t.checkoutDrawer.copyFailed);
    }
  };

  const handlePaypalSubmit = async () => {
    if (totalPrice <= 0) {
      toast.error(t.checkoutDrawer.selectItemOrAmount);
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
      toast.error(t.checkoutDrawer.fillRequiredDonatorInfo);
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

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartY(clientY);
    lastDragYRef.current = clientY;
    lastDragTimeRef.current = Date.now();
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartY === 0) return;

    if ('touches' in e && e.cancelable) {
      e.preventDefault();
    }

    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const distance = clientY - dragStartY;

    // Only allow positive drag (downward)
    if (distance >= 0) {
      setDragOffset(distance);

      // Calculate velocity
      const now = Date.now();
      const timeDelta = now - lastDragTimeRef.current;
      if (timeDelta > 0) {
        const yDelta = clientY - lastDragYRef.current;
        setDragVelocity(yDelta / timeDelta);
      }
      lastDragYRef.current = clientY;
      lastDragTimeRef.current = now;
    }
  };

  const handleDragEnd = () => {
    if (dragStartY === 0) return;

    const threshold = 80; // Close if dragged down more than 80px
    const velocityThreshold = 0.5; // Close if velocity > 0.5px/ms

    // Close if distance exceeded threshold OR velocity is high enough
    if (dragOffset > threshold || dragVelocity > velocityThreshold) {
      closeDrawer();
      // Reset state after close animation
      setTimeout(() => {
        setDragOffset(0);
        setDragVelocity(0);
        setDragStartY(0);
      }, 300);
    } else {
      // Snap back
      setDragOffset(0);
      setDragVelocity(0);
    }

    setDragStartY(0);
    lastDragYRef.current = 0;
    lastDragTimeRef.current = 0;
  };

  if (!selectedPackage) return null;

  return (
    <>
      <style>{scrollHideStyle}</style>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm ${
          drawerOpen ? '' : 'pointer-events-none'
        }`}
        style={{
          opacity: drawerOpen ? Math.max(0, 1 - dragOffset / 200) : 0,
          transition: dragStartY === 0 ? 'opacity 300ms ease-out' : 'none',
        }}
        onClick={closeDrawer}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed inset-x-0 bottom-0 z-50 mx-auto max-w-3xl transform ${
          drawerOpen ? '' : 'pointer-events-none'
        }`}
        style={{
          transform: drawerOpen
            ? `translateY(${Math.max(0, dragOffset)}px)`
            : 'translateY(100%)',
          transition: dragStartY === 0 ? 'transform 300ms ease-out' : 'none',
        }}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        <div
          className={`max-h-[90vh] ${
            isDragging ? 'overflow-y-hidden' : 'overflow-y-auto'
          } scrollbar-hide rounded-t-3xl bg-white shadow-2xl`}
        >
          {/* Handle bar */}
          <div
            className="sticky top-0 z-10 flex items-center justify-center bg-white px-4 pb-1 pt-2 rounded-t-3xl cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
          >
            <div className="h-1 w-10 rounded-full bg-gray-200" />
            <button
              onClick={closeDrawer}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 pb-4">
            {/* Title */}
            <h2 className="text-lg font-extrabold text-gray-900 mb-1">
              {selectedPackage.title}
            </h2>

            {/* Description */}
            <MarkdownRenderer
              content={selectedPackage.description}
              className="mt-2 mb-4 text-sm"
            />

            {/* Subpackage items */}
            {isSubpackageMode && (
              <div className="mb-4">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  {t.checkoutDrawer.choosePackage}
                </h3>
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div
                      key={item.uniqueCode}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium wrap-break-word">
                          {formatCurrency(item.price)} /{' '}
                          {t.checkoutDrawer.perPackage}
                        </p>
                        {item.requireDonatorInfo && (
                          <div className="mt-1 space-y-1">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600">
                              {t.checkoutDrawer.donatorInfoRequired}
                            </p>
                            <input
                              type="text"
                              value={item.donatorInfo || ''}
                              onChange={(e) =>
                                setDonatorInfo(item.uniqueCode, e.target.value)
                              }
                              placeholder={
                                t.checkoutDrawer.donatorInfoPlaceholder
                              }
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
                  {t.checkoutDrawer.donationAmount}
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
              <div className="mb-3 rounded-lg bg-linear-to-r from-emerald-50 to-teal-50 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-gray-500">
                    {t.checkoutDrawer.subtotal}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-700 wrap-break-word">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
              </div>
            )}

            {/* Payment tabs */}
            <div className="mb-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                {t.checkoutDrawer.paymentMethod}
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
              <div className="mb-4 animate-fade-in rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                <p className="mb-3 text-xs text-gray-500 wrap-break-word">
                  {t.checkoutDrawer.bankTransferInstructionPrefix}{' '}
                  <strong className="text-gray-800 wrap-break-word">
                    {formatCurrency(totalPrice)}
                  </strong>
                  {t.checkoutDrawer.bankTransferInstructionSuffix}
                </p>
                {[
                  {
                    label: t.checkoutDrawer.ownerName,
                    value: config.postbank.ownerName,
                  },
                  {
                    label: t.checkoutDrawer.bank,
                    value: config.postbank.bankName,
                  },
                  {
                    label: t.checkoutDrawer.iban,
                    value: config.postbank.iban,
                  },
                  {
                    label: t.checkoutDrawer.bic,
                    value: config.postbank.bic,
                  },
                  {
                    label: t.checkoutDrawer.usagePurpose,
                    value:
                      verwendungszweck || t.checkoutDrawer.donationFallback,
                  },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="mb-2 last:mb-0 flex items-center justify-between rounded-lg bg-white p-2 border border-gray-100 gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        {label}
                      </p>
                      <p className="text-xs font-semibold text-gray-800 font-mono wrap-break-word">
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
              <div className="mb-4 animate-fade-in">
                {configLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-300" />
                  </div>
                ) : config ? (
                  <>
                    {/* Fee breakdown */}
                    {totalPrice > 0 && (
                      <div className="mb-3 rounded-lg border border-gray-100 bg-gray-50/50 p-3 space-y-2">
                        <div className="flex justify-between text-xs gap-2">
                          <span className="text-gray-500">
                            {t.checkoutDrawer.subtotal}
                          </span>
                          <span className="font-medium text-gray-700 wrap-break-word">
                            {formatCurrency(totalPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs gap-2">
                          <span className="text-gray-500 flex-1">
                            {t.checkoutDrawer.paypalFee}{' '}
                            <span className="text-xs text-gray-400">
                              ({config.paypal.percentageFee.toFixed(2)}% +{' '}
                              {formatCurrency(config.paypal.fixFee)})
                            </span>
                          </span>
                          <span className="font-medium text-amber-600">
                            +{formatCurrency(paypalFee)}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-1 flex justify-between items-center gap-2">
                          <span className="font-bold text-gray-800 text-xs">
                            {t.checkoutDrawer.total}
                          </span>
                          <span className="font-extrabold text-emerald-700 text-sm wrap-break-word">
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
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-emerald-500 to-teal-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-emerald-500/20 transition-all duration-200 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:shadow-emerald-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-xs">
                            {t.checkoutDrawer.processing}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-xs">
                            {t.checkoutDrawer.payWithPaypal}
                          </span>
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <p className="text-center text-sm text-gray-400 py-4">
                    {t.checkoutDrawer.paymentConfigUnavailable}
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
