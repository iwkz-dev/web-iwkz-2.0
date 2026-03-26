'use client';

import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useDonationStore } from '@/store/donation-store';
import { usePayment } from '@/hooks/use-payment';
import type { PaypalCheckoutItem } from '@/types/donationApi';
import type { CheckoutDrawerText } from '@/types/checkoutDrawer.types';
import { MarkdownRenderer } from '../ui/markdownRenderer';
import { PaymentTabs } from '../ui/paymentTabs';
import { formatCurrency } from '@/lib/utils';
import { SubpackageList } from './parts/subpackageList';
import { SingleDonatorInfoField } from './parts/singleDonatorInfoField';
import { OpenDonationInput } from './parts/OpenDonationInput';
import { TotalCard } from './parts/totalCard';
import { BankTransferSection } from './parts/bankTransferSection';
import { PaypalSection } from './parts/paypalSection';

const scrollHideStyle = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export function CheckoutDrawer() {
  const tCheckout = useTranslations('checkoutDrawer');
  const t: CheckoutDrawerText = {
    copiedToClipboard: tCheckout('copiedToClipboard'),
    copyFailed: tCheckout('copyFailed'),
    selectItemOrAmount: tCheckout('selectItemOrAmount'),
    fillRequiredDonatorInfo: tCheckout('fillRequiredDonatorInfo'),
    choosePackage: tCheckout('choosePackage'),
    perPackage: tCheckout('perPackage'),
    donatorInfoRequired: tCheckout('donatorInfoRequired'),
    donatorInfoPlaceholder: tCheckout('donatorInfoPlaceholder'),
    donationAmount: tCheckout('donationAmount'),
    subtotal: tCheckout('subtotal'),
    paymentMethod: tCheckout('paymentMethod'),
    bankTransferInstructionPrefix: tCheckout('bankTransferInstructionPrefix'),
    bankTransferInstructionSuffix: tCheckout('bankTransferInstructionSuffix'),
    ownerName: tCheckout('ownerName'),
    bank: tCheckout('bank'),
    iban: tCheckout('iban'),
    bic: tCheckout('bic'),
    usagePurpose: tCheckout('usagePurpose'),
    donationFallback: tCheckout('donationFallback'),
    paypalFee: tCheckout('paypalFee'),
    total: tCheckout('total'),
    processing: tCheckout('processing'),
    payWithPaypal: tCheckout('payWithPaypal'),
    paymentConfigUnavailable: tCheckout('paymentConfigUnavailable'),
    paypalReturnSuccess: tCheckout('paypalReturnSuccess'),
    paypalReturnCancelled: tCheckout('paypalReturnCancelled'),
    paypalReturnVerificationError: tCheckout('paypalReturnVerificationError'),
    islamicGratitude: tCheckout('islamicGratitude'),
    contactSupportMessage: tCheckout('contactSupportMessage'),
  };

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
  const singleCartItem = cartItems[0];

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
      toast.success(t.copiedToClipboard);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast.error(t.copyFailed);
    }
  };

  const handlePaypalSubmit = async () => {
    if (totalPrice <= 0) {
      toast.error(t.selectItemOrAmount);
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
      toast.error(t.fillRequiredDonatorInfo);
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
              <SubpackageList
                items={cartItems}
                t={t}
                setQuantity={setQuantity}
                setDonatorInfo={setDonatorInfo}
              />
            )}

            {/* Single package donor info */}
            {!isSubpackageMode && (
              <SingleDonatorInfoField
                item={singleCartItem}
                t={t}
                setDonatorInfo={setDonatorInfo}
              />
            )}

            {/* Open donation input */}
            {isOpenDonation && (
              <OpenDonationInput
                customAmount={customAmount}
                setCustomAmount={setCustomAmount}
                t={t}
              />
            )}

            {/* Total */}
            <TotalCard totalPrice={totalPrice} t={t} />

            {/* Payment tabs */}
            <div className="mb-3">
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                {t.paymentMethod}
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
              <BankTransferSection
                config={config}
                totalPrice={totalPrice}
                verwendungszweck={verwendungszweck}
                copiedField={copiedField}
                onCopy={handleCopy}
                t={t}
              />
            )}

            {/* PayPal content */}
            {paymentTab === 'paypal' && (
              <PaypalSection
                configLoading={configLoading}
                config={config}
                totalPrice={totalPrice}
                paypalFee={paypalFee}
                paypalTotal={paypalTotal}
                loading={loading}
                onSubmit={handlePaypalSubmit}
                t={t}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
