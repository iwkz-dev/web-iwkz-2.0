import type { CartItem } from '@/types/donationApi';

export interface CheckoutDrawerText {
  copiedToClipboard: string;
  copyFailed: string;
  selectItemOrAmount: string;
  fillRequiredDonatorInfo: string;
  choosePackage: string;
  perPackage: string;
  donatorInfoRequired: string;
  donatorInfoPlaceholder: string;
  donationAmount: string;
  subtotal: string;
  paymentMethod: string;
  bankTransferInstructionPrefix: string;
  bankTransferInstructionSuffix: string;
  ownerName: string;
  bank: string;
  iban: string;
  bic: string;
  usagePurpose: string;
  donationFallback: string;
  paypalFee: string;
  total: string;
  processing: string;
  payWithPaypal: string;
  paymentConfigUnavailable: string;
  paypalReturnSuccess: string;
  paypalReturnCancelled: string;
  paypalReturnVerificationError: string;
  islamicGratitude: string;
  contactSupportMessage: string;
}

export interface SubpackageListProps {
  items: CartItem[];
  t: CheckoutDrawerText;
  setQuantity: (uniqueCode: string, quantity: number) => void;
  setDonatorInfo: (uniqueCode: string, info: string) => void;
}

export interface SingleDonatorInfoProps {
  item?: CartItem;
  t: CheckoutDrawerText;
  setDonatorInfo: (uniqueCode: string, info: string) => void;
}
