// ─── Donation Package ───

export interface DonationImage {
  url: string;
}

export interface DonationItem {
  id: number;
  title: string;
  price: number | null;
  uniqueCode: string;
  targetDonation: number | null;
  requireDonatorInfo?: boolean;
  total_order?: number;
  total_donation?: number;
}

export interface DonationPackage {
  id: number;
  title: string;
  description: string;
  image: DonationImage | null;
  donationItems: DonationItem[];
  endDate: string | null;
  published: boolean;
}

export interface DonationPackageData {
  headline: string;
  subHeadline: string;
  image: DonationImage | null;
  donationPackages: DonationPackage[];
}

export interface DonationPackageResponse {
  data: DonationPackageData;
}

// ─── Payment Config ───

export interface PostbankConfig {
  ownerName: string;
  bankName: string;
  iban: string;
  bic: string;
}

export interface PaypalConfig {
  returnUrl: string;
  cancelUrl: string;
  fixFee: number;
  percentageFee: number;
}

export interface PaymentConfigData {
  postbank: PostbankConfig;
  paypal: PaypalConfig;
}

export interface PaymentConfigResponse {
  data: PaymentConfigData;
}

// ─── PayPal Checkout ───

export interface PaypalCheckoutItem {
  unique_code: string;
  total_order: number;
  total_price: number;
  donator_info?: string;
  description?: string;
}

export interface PaypalCheckoutRequest {
  total_order: number;
  total_price: number;
  items: PaypalCheckoutItem[];
}

export interface PaypalCheckoutResponse {
  data: {
    paypal_link: string;
    paypal_gross_amount: number;
  };
}

// ─── PayPal Capture ───

export interface PaypalCaptureRequest {
  token: string;
}

// ─── Cart State ───

export interface CartItem {
  uniqueCode: string;
  title: string;
  price: number;
  quantity: number;
  requireDonatorInfo?: boolean;
  donatorInfo?: string;
}

// ─── Admin Bank Transfer ───

export interface BankTransferItem {
  donation_code: string;
  total_order: number;
  total_price: number;
  donator_info?: string;
}

export interface BankTransferRequest {
  items: BankTransferItem[];
}
