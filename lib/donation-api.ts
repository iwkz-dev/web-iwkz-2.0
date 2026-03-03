import type {
  DonationPackageResponse,
  PaymentConfigResponse,
  PaypalCheckoutRequest,
  PaypalCheckoutResponse,
  PaypalCaptureRequest,
  BankTransferRequest,
} from '@/types/donationApi';

const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN ?? '';

function headers(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TOKEN}`,
  };
}

export async function fetchDonationPackages(): Promise<DonationPackageResponse> {
  const res = await fetch('/api/donation-package', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch donation packages');
  return res.json();
}

export async function fetchPaymentConfig(): Promise<PaymentConfigResponse> {
  const res = await fetch('/api/payment-config', {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch payment config');
  return res.json();
}

export async function createPaypalCheckout(
  payload: PaypalCheckoutRequest
): Promise<PaypalCheckoutResponse> {
  const res = await fetch('/api/donation-package/paypal', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create PayPal checkout');
  return res.json();
}

export async function capturePaypalPayment(
  payload: PaypalCaptureRequest
): Promise<Response> {
  const res = await fetch('/api/donation-package/paypal/capture', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return res;
}

export async function recordBankTransfer(
  payload: BankTransferRequest
): Promise<Response> {
  const res = await fetch('/api/donation-package/bank-transfer', {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return res;
}
