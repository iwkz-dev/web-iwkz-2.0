import { create } from 'zustand';
import type { DonationPackage, CartItem } from '@/types/donationApi';

interface DonationState {
  // Selected package for the drawer
  selectedPackage: DonationPackage | null;
  drawerOpen: boolean;

  // Cart items (subpackage quantities)
  cartItems: CartItem[];

  // Custom amount for open donations
  customAmount: number;

  // Actions
  openDrawer: (pkg: DonationPackage) => void;
  closeDrawer: () => void;
  setQuantity: (uniqueCode: string, quantity: number) => void;
  setDonatorInfo: (uniqueCode: string, info: string) => void;
  setCustomAmount: (amount: number) => void;
  reset: () => void;

  // Computed helpers
  getTotalQuantity: () => number;
  getTotalPrice: () => number;
}

export const useDonationStore = create<DonationState>((set, get) => ({
  selectedPackage: null,
  drawerOpen: false,
  cartItems: [],
  customAmount: 0,

  openDrawer: (pkg) => {
    // If there's only 1 item, it acts as the "single package" mode.
    // We still map it so we can easily get the uniqueCode and price,
    // but cartItems might only be used for "subpackage" mode UI.
    const items: CartItem[] = pkg.donationItems.map((item) => {
      const isFixedSingleItem =
        pkg.donationItems.length === 1 && item.price !== null && item.price > 1;
      return {
        uniqueCode: item.uniqueCode,
        title: item.title,
        price: item.price ?? 0,
        requireDonatorInfo: item.requireDonatorInfo,
        donatorInfo: '',
        // Default quantity to 1 if it's a fixed single item so they don't start at 0
        quantity: isFixedSingleItem ? 1 : 0,
      };
    });
    set({
      selectedPackage: pkg,
      drawerOpen: true,
      cartItems: items,
      customAmount: 0,
    });
  },

  closeDrawer: () => {
    set({ drawerOpen: false });
  },

  setQuantity: (uniqueCode, quantity) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.uniqueCode === uniqueCode
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ),
    }));
  },

  setDonatorInfo: (uniqueCode, info) => {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.uniqueCode === uniqueCode ? { ...item, donatorInfo: info } : item
      ),
    }));
  },

  setCustomAmount: (amount) => {
    set({ customAmount: Math.max(0, amount) });
  },

  reset: () => {
    set({
      selectedPackage: null,
      drawerOpen: false,
      cartItems: [],
      customAmount: 0,
    });
  },

  getTotalQuantity: () => {
    const { selectedPackage, cartItems } = get();
    if (!selectedPackage) return 0;

    const singleItem = selectedPackage.donationItems[0];
    const isFixedSingleItem =
      selectedPackage.donationItems.length === 1 &&
      singleItem &&
      singleItem.price !== null &&
      singleItem.price > 1;

    if (selectedPackage.donationItems.length > 1 || isFixedSingleItem) {
      return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }
    return 1;
  },

  getTotalPrice: () => {
    const { selectedPackage, cartItems, customAmount } = get();
    if (!selectedPackage) return 0;

    const singleItem = selectedPackage.donationItems[0];
    const isFixedSingleItem =
      selectedPackage.donationItems.length === 1 &&
      singleItem &&
      singleItem.price !== null &&
      singleItem.price > 1;

    if (selectedPackage.donationItems.length > 1 || isFixedSingleItem) {
      return cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    // Single item package open donation
    return customAmount;
  },
}));
